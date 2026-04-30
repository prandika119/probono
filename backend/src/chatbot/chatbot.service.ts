import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { JinaEmbeddings } from '@langchain/community/embeddings/jina';
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
} from '@langchain/core/messages';

@Injectable()
export class ChatbotService {
  private llm: ChatGoogleGenerativeAI;
  private embeddings: JinaEmbeddings;

  constructor(private prisma: PrismaService) {
    this.llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.2, // Lebih rendah = jawaban lebih konsisten & faktual
    });

    this.embeddings = new JinaEmbeddings({
      apiKey: process.env.JINA_API_KEY,
      model: 'jina-embeddings-v3',
    });
  }

  async createSession(userId: string, title?: string) {
    const session = await this.prisma.botSession.create({
      data: {
        user_id: userId,
        title: title ?? 'Chat Baru',
      },
    });
    return { message: 'Sesi percakapan berhasil dibuat.', data: { session } };
  }

  async getSessions(userId: string) {
    const sessions = await this.prisma.botSession.findMany({
      where: { user_id: userId },
      orderBy: { updated_at: 'desc' },
      select: {
        id: true,
        title: true,
        created_at: true,
        updated_at: true,
        _count: { select: { messages: true } },
      },
    });
    return { data: { sessions } };
  }

  async getMessages(sessionId: string, userId: string) {
    await this.validateSession(sessionId, userId);
    const messages = await this.prisma.botMessage.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'asc' },
    });
    return { data: { messages } };
  }

  async ask(sessionId: string, userId: string, question: string) {
    // 1. Validasi kepemilikan sesi
    await this.validateSession(sessionId, userId);

    // 2. Ambil riwayat 10 pesan terakhir sebagai memori percakapan
    const history = await this.prisma.botMessage.findMany({
      where: { session_id: sessionId },
      orderBy: { created_at: 'asc' },
      take: 5,
    });

    // 3. Ubah pertanyaan menjadi "Standalone Question" berdasarkan riwayat
    const standaloneQuestion = await this.rephraseQuestion(question, history);

    // 4. Cari konteks dokumen yang relevan menggunakan pgvector
    const context = await this.searchSimilarDocuments(standaloneQuestion);

    // 5. Generate jawaban akhir dari LLM
    const answer = await this.generateAnswer(question, context, history);

    // 6. Simpan pesan user dan jawaban AI ke database
    await this.prisma.botMessage.createMany({
      data: [
        { session_id: sessionId, role: 'user', content: question },
        { session_id: sessionId, role: 'ai', content: answer },
      ],
    });

    // 7. Update timestamp sesi agar muncul di urutan teratas
    await this.prisma.botSession.update({
      where: { id: sessionId },
      data: { updated_at: new Date() },
    });

    return {
      data: {
        question,
        answer,
        session_id: sessionId,
      },
    };
  }

  /**
   * Mengubah pertanyaan user menjadi pertanyaan mandiri yang dapat berdiri sendiri
   * tanpa bergantung pada konteks percakapan sebelumnya.
   *
   */
  private async rephraseQuestion(
    question: string,
    history: { role: string; content: string }[],
  ): Promise<string> {
    // Jika tidak ada riwayat, pertanyaan sudah mandiri
    if (history.length === 0) return question;

    const historyText = history
      .map((m) => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
      .join('\n');

    const rephrasePrompt = `Berdasarkan riwayat percakapan berikut dan pertanyaan terbaru dari user, \
tulis ulang pertanyaan tersebut menjadi sebuah pertanyaan mandiri yang dapat dipahami \
tanpa riwayat percakapan. Jangan menjawab pertanyaan, cukup tulis ulang pertanyaannya saja.

Riwayat Percakapan:
${historyText}

Pertanyaan Terbaru: ${question}

Pertanyaan Mandiri:`;

    const result = await this.llm.invoke([new HumanMessage(rephrasePrompt)]);
    return result.content as string;
  }

  /**
   * Melakukan pencarian vektor (cosine similarity) ke database pgvector
   * untuk menemukan chunk dokumen yang paling relevan.
   */
  private async searchSimilarDocuments(question: string): Promise<string> {
    const questionVector = await this.embeddings.embedQuery(question);
    const vectorString = `[${questionVector.join(',')}]`;

    const results = await this.prisma.$queryRawUnsafe<
      { content: string }[]
    >(
      `SELECT content FROM document_vectors
       ORDER BY embedding <=> $1::vector
       LIMIT 4`,
      vectorString,
    );

    if (results.length === 0) return '';

    console.log(results);
    
    return results.map((r, i) => `[Dokumen ${i + 1}]\n${r.content}`).join('\n\n---\n\n');
  }

  /**
   * Menghasilkan jawaban akhir dari LLM berdasarkan konteks dokumen,
   * riwayat percakapan, dan pertanyaan user.
   * Menggunakan strict prompt engineering untuk mencegah halusinasi.
   */
  private async generateAnswer(
    question: string,
    context: string,
    history: { role: string; content: string }[],
  ): Promise<string> {
    const systemPrompt = `Anda adalah Asisten Hukum virtual untuk platform Probono, sebuah platform \
bantuan hukum pro bono di Indonesia.

TUGAS ANDA:
Membantu pengguna memahami pertanyaan hukum mereka berdasarkan DOKUMEN REFERENSI yang disediakan.

ATURAN KETAT YANG WAJIB DIPATUHI:
1. Anda HANYA boleh menjawab berdasarkan informasi yang terdapat dalam DOKUMEN REFERENSI di bawah.
2. Jika pertanyaan tidak dapat dijawab dari dokumen referensi, WAJIB balas dengan kalimat berikut:
   "Maaf, saya tidak menemukan informasi yang relevan terkait pertanyaan Anda dalam basis pengetahuan kami. Silakan konsultasikan dengan pengacara secara langsung untuk pertanyaan ini."
3. JANGAN mengarang, menebak, atau menggunakan pengetahuan di luar dokumen referensi.
4. Jawab dalam Bahasa Indonesia yang mudah dipahami oleh masyarakat umum.
5. Jika relevan, sebutkan pasal atau sumber dari dokumen referensi.

DOKUMEN REFERENSI:
${context || 'Tidak ada konteks dokumen yang ditemukan.'}`;

    const messages = [
      new SystemMessage(systemPrompt),
      // Tambahkan riwayat percakapan sebagai memori
      ...history.map((m) =>
        m.role === 'user'
          ? new HumanMessage(m.content)
          : new AIMessage(m.content),
      ),
      new HumanMessage(question),
    ];

    const result = await this.llm.invoke(messages);
    return result.content as string;
  }

  /**
   * Memvalidasi bahwa sesi ada dan dimiliki oleh user yang meminta.
   */
  private async validateSession(sessionId: string, userId: string) {
    const session = await this.prisma.botSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Sesi percakapan tidak ditemukan.');
    }

    if (session.user_id !== userId) {
      throw new ForbiddenException('Anda tidak memiliki akses ke sesi ini.');
    }

    return session;
  }
}
