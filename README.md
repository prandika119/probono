# ProBono Web System: Platform Bantuan Hukum Gratis

## 1. Pendahuluan

**ProBono** adalah platform digital yang menjembatani masyarakat kurang mampu yang membutuhkan bantuan hukum (Pro Bono) dengan para advokat/pengacara yang bersedia memberikan jasa hukum secara sukarela. Platform ini bertujuan untuk mendemokratisasi akses keadilan hukum di Indonesia dengan mempermudah proses verifikasi, konsultasi, dan manajemen kasus hukum secara transparan dan efisien.

## 2. Tujuan Proyek

- **Aksesibilitas:** Memberikan kemudahan bagi masyarakat untuk mencari bantuan hukum tanpa hambatan biaya.
- **Validasi Data:** Memastikan bantuan tepat sasaran melalui sistem verifikasi NIK dan status ekonomi yang terintegrasi (OCR & AI).
- **Manajemen Kasus:** Memfasilitasi advokat dalam mengelola dokumen dan progres kasus secara terorganisir.
- **Edukasi Hukum:** Menyediakan sumber daya informasi hukum yang mudah dipahami melalui _Knowledge Base_ berbasis AI.

## 3. Fitur Utama

- **Sistem Autentikasi & Verifikasi:** Registrasi berbasis peranan (Admin, Advokat, Klien) dengan verifikasi KTP menggunakan OCR.
- **Case Management:** Pengajuan kasus oleh klien, sistem _pairing_ dengan advokat, dan pelacakan progres kasus (_Log Progress_).
- **Real-time Chat:** Fitur komunikasi langsung antara klien dan advokat yang menangani kasus.
- **AI-Powered Knowledge Base:** Chatbot asisten hukum berbasis RAG (Retrieval-Augmented Generation) yang mereferensikan dokumen undang-undang resmi.
- **Legal Education:** Portal artikel dan berita hukum terbaru untuk meningkatkan literasi hukum masyarakat.
- **Sistem Notifikasi:** Pengingat untuk update status kasus atau pesan baru.

## 4. Pemilihan Tech Stack

Sistem ini dibangun menggunakan arsitektur modern untuk menjamin performa dan skalabilitas:

| Komponen      | Teknologi                     | Alasan Pemilihan                                                                                                           |
| :------------ | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**  | **Next.js**                   | Dukungan SSR/ISR untuk SEO portal edukasi dan performa aplikasi yang responsif.                                            |
| **Backend**   | **NestJS (Node.js)**          | Arsitektur modular yang modular dan terstruktur (TypeScript), memudahkan skalabilitas dan maintenance kode jangka panjang. |
| **Database**  | **PostgreSQL**                | Handal dalam menangani data relasional yang kompleks dan mendukung pencarian vektor (via pgvector) untuk fitur RAG.        |
| **Real-time** | **Socket.io**                 | Terintegrasi dengan baik dalam ekosistem NestJS melalui @nestjs/websockets untuk fitur chat.                               |
| **AI Engine** | **LangChain/OpenAI**          | Digunakan untuk pemrosesan dokumen hukum (_chunking_, _embedding_) pada fitur Knowledge Base.                              |
| **Storage**   | **AWS S3 / Supabase Storage** | Penyimpanan aman untuk dokumen sensitif seperti foto KTP dan berkas bukti kasus.                                           |

## 5. Cara Menjalankan Proyek

### Prasyarat

- Node.js (v20 atau lebih baru direkomendasikan)
- NestJS CLI (`npm install -g @nestjs/cli`)
- Docker (opsional, jika ingin menjalankan PostgreSQL dari container)
- PostgreSQL (Jalankan service database / buat database baru)

### Langkah-langkah Detail

1. **Clone Repository**

    ```bash
    git clone <repository-url>
    cd probono
    ```

2. **Inisialisasi Environment Variables**

    Karena backend bergantung pada database, pastikan Anda membuat file konfigurasinya.
    ```bash
    # Buat (atau duplikat) file environment di root folder proyek
    cp .env.example .env
    ```
    Buka file `.env` tersebut dan isi string koneksi `DATABASE_URL` ke PostgreSQL Anda. Secara contoh:
    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/probono?schema=public"
    JWT_SECRET="secret_token_anda_disini"
    ```

3. **Setup Backend (NestJS & Prisma)**

    Kini saatnya menginstal library dan menyiapkan database menggunakan Prisma (sebagai ORM).
    ```bash
    cd backend
    npm install
    
    # Generate Prisma Client (untuk Type-safety ORM TypeScript terhadap Database)
    npx prisma generate
    
    # Jalankan Migrasi Database untuk membuat arsitektur tabel yang diminta
    npx prisma migrate dev --name init_auth
    ```

4. **Jalankan Aplikasi Backend**

    Ketika migrasi berhasil, semua entitas telah aman.
    ```bash
    # Mode Pengembangan (Hot Reloading/Watch mode)
    npm run start:dev
    
    # Mode Produksi
    npm run build
    npm run start:prod
    ```

5. **Setup Frontend (Next.js)** (Catatan tambahan)

    ```bash
    cd ../frontend
    npm install
    # Buat file .env.local untuk konfigurasi API URL
    cp .env.example .env.local
    npm run dev
    ```

6. **Akses Test Aplikasi**

   - **Frontend:** Buka browser dan akses `http://localhost:3000`
   - **Backend API:** Secara default berjalan di `http://localhost:3009/api/v1` (sesuai port NestJS)

---

_Dibuat untuk mendukung keadilan bagi semua._
