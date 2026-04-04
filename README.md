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

| Komponen      | Teknologi                     | Alasan Pemilihan                                                                                                    |
| :------------ | :---------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Frontend**  | **Next.js**                   | Dukungan SSR/ISR untuk SEO portal edukasi dan performa aplikasi yang responsif.                                     |
| **Backend**   | **Express.js**                | Ringan, cepat, dan memiliki ekosistem library yang luas untuk integrasi AI dan pengolahan data.                     |
| **Database**  | **PostgreSQL**                | Handal dalam menangani data relasional yang kompleks dan mendukung pencarian vektor (via pgvector) untuk fitur RAG. |
| **Real-time** | **Socket.io**                 | Memungkinkan komunikasi dua arah yang instan pada fitur chat tanpa _overhead_ besar.                                |
| **AI Engine** | **LangChain/OpenAI**          | Digunakan untuk pemrosesan dokumen hukum (_chunking_, _embedding_) pada fitur Knowledge Base.                       |
| **Storage**   | **AWS S3 / Supabase Storage** | Penyimpanan aman untuk dokumen sensitif seperti foto KTP dan berkas bukti kasus.                                    |

## 5. Cara Menjalankan Proyek

### Prasyarat

- Node.js (v18 atau lebih baru)
- Docker (opsional, untuk database)
- PostgreSQL

### Langkah-langkah

1. **Clone Repository**

    ```bash
    git clone <repository-url>
    cd probono
    ```

2. **Setup Backend**

    ```bash
    cd backend
    npm install
    # Buat file .env dan sesuaikan konfigurasi database
    cp .env.example .env
    npm run dev
    ```

3. **Setup Frontend**

    ```bash
    cd ../frontend
    npm install
    # Buat file .env.local untuk konfigurasi API URL
    cp .env.example .env.local
    npm run dev
    ```

4. **Akses Aplikasi**
   Buka browser dan akses `http://localhost:3000` untuk Frontend, dan API akan berjalan di `http://localhost:5000` (atau port yang dikonfigurasi).

---

_Dibuat untuk mendukung keadilan bagi semua._
