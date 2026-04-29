# Panduan Proses Ingestion RAG (Chatbot)

Dokumen ini menjelaskan tata cara untuk mengolah, memotong (chunking), dan memasukkan dokumen dasar hukum (Knowledge Base) Anda ke dalam sistem Vector Database PostgreSQL (`pgvector`) menggunakan model embedding Jina AI.

## Prasyarat

1. **Jina API Key**: Pastikan Anda telah menambahkan kredensial Jina AI di dalam file `.env` di proyek `backend/` Anda.
   ```env
   JINA_API_KEY=jina_xxxxxxxxx
   ```
2. **Database PostgreSQL**: Pastikan database Anda berjalan dan variabel `DATABASE_URL` di file `.env` sudah sesuai (menggunakan adapter yang mendukung ekstensi `vector`).

---

## Langkah-langkah Menjalankan Ingestion

### 1. Menyiapkan Dokumen
- Skrip ini akan mencari folder bernama `docs_to_ingest` di *root* folder `backend`.
  ```text
  backend/
  ├── docs_to_ingest/    <-- (Masukkan dokumen Anda ke sini)
  ├── scripts/
  │   └── ingest-rag.ts
  ├── src/
  ```
- **Penting:** Pastikan semua dokumen yang ingin Anda masukkan berformat **`.docx`** (Microsoft Word). Skrip ini memanfaatkan library `mammoth` untuk membaca format DOCX karena ia sangat presisi dalam menangani struktur paragraf dan tabel hukum dibandingkan PDF.

### 2. Menjalankan Skrip
Buka terminal Anda, pastikan berada di dalam folder `backend/`, lalu jalankan perintah berikut:

```bash
npx tsx scripts/ingest-rag.ts
```

> **⚠️ PERHATIAN PENTING:** 
> Pastikan Anda menggunakan perintah `tsx` dan **bukan** `ts-node`. *Runner* `ts-node` memiliki batasan dalam membaca internal library dari Prisma versi terbaru yang dapat memunculkan error `Cannot find module './internal/class.js'`.

### 3. Memantau Proses
Sistem akan mulai menampilkan proses di terminal. Berikut adalah hal-hal yang dilakukan skrip di belakang layar:
1. Menemukan dan membaca seluruh file `.docx` di folder `docs_to_ingest`.
2. Memotong (*chunking*) teks panjang menjadi bagian-bagian dengan maksimal 1500 karakter. Jika ada kalimat terpotong, sistem akan memberikan kompensasi mundur sebanyak 200 karakter (*overlap*) agar tidak ada makna yang hilang.
3. Berkomunikasi dengan API Jina untuk mengubah teks tersebut menjadi deretan angka (Vector Embeddings).
4. Menyimpan data tersebut ke dalam tabel `document_vectors` di database PostgreSQL.

Anda akan melihat tulisan **"Proses Ingestion Selesai!"** sebagai pertanda bahwa seluruh dokumen berhasil dimasukkan ke sistem.

---

## FAQ & Troubleshooting

- **Bagaimana jika saya ingin menambahkan dokumen baru di kemudian hari?**
  Anda cukup memasukkan dokumen `.docx` yang *baru* tersebut ke folder `docs_to_ingest`, lalu hapus dokumen yang lama (agar tidak terduplikasi), dan jalankan ulang perintah `npx tsx scripts/ingest-rag.ts`. Skrip akan membuatkan vektor barunya untuk Anda.

- **Error: "Authentication failed" dari Jina AI?**
  Periksa kembali `JINA_API_KEY` di file `.env` Anda. Pastikan tidak ada spasi yang berlebihan atau kunci sudah kedaluwarsa.

- **Error koneksi Database?**
  Pastikan service PostgreSQL berjalan dan `DATABASE_URL` sudah menunjuk ke database yang tepat.
