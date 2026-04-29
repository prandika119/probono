import { PrismaService } from '../src/prisma/prisma.service';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { JinaEmbeddings } from '@langchain/community/embeddings/jina';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config();

const prisma = new PrismaService();
prisma.$connect();

async function main() {
  console.log('Memulai proses Ingestion...');
  const docsDir = path.join(process.cwd(), 'docs_to_ingest');
  
  if (!fs.existsSync(docsDir)) {
    console.log(`Direktori ${docsDir} tidak ditemukan. Membuat direktori baru...`);
    fs.mkdirSync(docsDir, { recursive: true });
    console.log('Silakan masukkan file DOCX Anda ke dalam folder docs_to_ingest lalu jalankan kembali skrip ini.');
    return;
  }

  const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.docx'));
  
  if (files.length === 0) {
    console.log('Tidak ada file DOCX di folder docs_to_ingest.');
    return;
  }

  // Gunakan embedding model dari Jina AI (Sangat bagus untuk Bahasa Indonesia)
  const embeddings = new JinaEmbeddings({
    apiKey: process.env.JINA_API_KEY,
    model: 'jina-embeddings-v3', // Anda bisa ganti ke v2 jika v3 belum didukung akun Anda
  });

  // Tentukan ukuran pemotongan (chunking)
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1500,
    chunkOverlap: 200,
  });

  for (const file of files) {
    console.log(`\nMemproses file: ${file}...`);
    const loader = new DocxLoader(path.join(docsDir, file));
    const rawDocs = await loader.load();
    const docs = await splitter.splitDocuments(rawDocs);
    
    console.log(`Berhasil memotong menjadi ${docs.length} bagian (chunks).`);
    console.log('Menghasilkan vektor (embeddings) dan menyimpan ke database...');
    
    for (const doc of docs) {
      const vector = await embeddings.embedQuery(doc.pageContent);
      
      // Simpan ke PostgreSQL (pgvector)
      await prisma.$executeRawUnsafe(
        `INSERT INTO document_vectors (id, content, metadata, embedding) 
         VALUES ($1, $2, $3::jsonb, $4::vector)`,
        randomUUID(),
        doc.pageContent,
        JSON.stringify(doc.metadata),
        `[${vector.join(',')}]`
      );
    }
  }
  
  console.log('\nProses Ingestion Selesai!');
}

main()
  .catch(e => {
    console.error('Terjadi kesalahan:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
