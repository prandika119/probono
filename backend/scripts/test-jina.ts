import { JinaEmbeddings } from '@langchain/community/embeddings/jina';
import * as dotenv from 'dotenv';

dotenv.config();

async function testJina() {
  console.log('Mengetes koneksi ke Jina AI...');
  
  if (!process.env.JINA_API_KEY) {
    console.error('Error: JINA_API_KEY tidak ditemukan di file .env');
    return;
  }

  const embeddings = new JinaEmbeddings({
    apiKey: process.env.JINA_API_KEY,
    model: 'jina-embeddings-v3',
  });

  try {
    const text = "Halo, ini adalah tes untuk model embedding Jina.";
    console.log(`Mengirim teks untuk di-embed: "${text}"`);
    
    const vector = await embeddings.embedQuery(text);
    
    console.log('\n Berhasil terhubung ke Jina AI!');
    console.log(`Panjang Vektor: ${vector.length}`);
    console.log('Snippet Vektor (5 angka pertama):', vector.slice(0, 5));
    
  } catch (error) {
    console.error('\n Gagal terhubung ke Jina AI:');
    console.error(error.message);
  }
}

testJina();
