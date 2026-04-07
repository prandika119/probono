**Entity Relationship Diagram (ERD)** platform Probono. Dokumentasi ini dirancang agar siap diimplementasikan ke dalam database relasional (seperti PostgreSQL atau MySQL) dengan mempertimbangkan integritas data dan skalabilitas.

---

## 1. Arsitektur Tabel & Kamus Data

### A. Core User Management

Grup tabel ini menangani autentikasi dan otorisasi.

| Tabel       | Field               | Tipe Data | Constraint      | Deskripsi                         |
| :---------- | :------------------ | :-------- | :-------------- | :-------------------------------- |
| **users**   | id                  | UUID      | PK              | Unique ID                         |
|             | email               | string    | Unique, Indexed | Email login                       |
|             | phone_number        | string    | Unique          | Nomor telepon                     |
|             | password            | string    | -               | Hashed password                   |
|             | name                | string    | -               | Nama lengkap user                 |
|             | nik                 | string    | Unique          | Nomor Induk Kependudukan (KTP)    |
|             | address             | text      | -               | Alamat domisili                   |
|             | province            | string    | -               | Provinsi tempat tinggal           |
|             | city                | string    | -               | Kota tempat tinggal               |
|             | role                | enum      | -               | `admin`, `lawyer`, `client`       |
|             | ktp_upload          | string    | -               | URL/Path foto KTP                 |
|             | verification_status | enum      | -               | `pending`, `verified`, `rejected` |
|             | is_active           | boolean   | Default: false  | Status akun aktif                 |
|             | profile_image       | string    | -               | URL/Path foto profil              |
|             | created_at          | timestamp | -               | Waktu pembuatan akun              |
| **lawyers** | id                  | UUID      | PK              | Unique ID Lawyer                  |
|             | user_id             | UUID      | FK (users.id)   | Relasi One-to-One ke Users        |
|             | license_number      | string    | Unique          | NIP/No. Kartu Advokat             |
|             | license_upload      | string    | -               | URL/Path foto lisensi             |
|             | organization_name   | string    | -               | Nama organisasi tempat bekerja    |
|             | office_address      | text      | -               | Alamat kantor                     |
|             | experience          | text      | -               | Deskripsi singkat dan keahlian    |
|             | speciality          | enum      | -               | Keahlian khusus                   |
| **clients** | id                  | UUID      | PK              | Unique ID Client                  |
|             | user_id             | UUID      | FK (users.id)   | Relasi One-to-One ke Users        |
|             | sktm_upload         | string    | -               | URL/Path SKTM                     |
|             | province            | string    | -               | Provinsi tempat tinggal           |
|             | city                | string    | -               | Kota tempat tinggal               |

---

### B. Case Management (Core Business)

Ini adalah jantung dari platform kamu, menghubungkan pencari bantuan dengan advokat.

| Tabel              | Field           | Tipe Data | Constraint         | Deskripsi                                        |
| :----------------- | :-------------- | :-------- | :----------------- | :----------------------------------------------- |
| **categories**     | id              | UUID      | PK                 | Master data kategori                             |
|                    | name            | string    | -                  | Contoh: Pidana, Perdata, Ketenagakerjaan, dsb    |
|                    | type            | enum      | -                  | `case` atau `news`                               |
| **cases**          | id              | UUID      | PK                 | -                                                |
|                    | client_id       | UUID      | FK (clients.id)    | Pelapor                                          |
|                    | lawyer_id       | UUID      | FK (lawyers.id)    | **Nullable** (sebelum di-accept)                 |
|                    | category_id     | UUID      | FK (categories.id) | Jenis kasus                                      |
|                    | title           | string    | -                  | Judul masalah hukum                              |
|                    | description     | text      | -                  | Kronologi                                        |
|                    | location        | string    | -                  | Lokasi kejadian                                  |
|                    | date            | date      | -                  | Tanggal kejadian                                 |
|                    | opponent        | string    | -                  | Pihak lawan (jika ada)                           |
|                    | estimated_loss  | decimal   | -                  | Estimasi kerugian (jika ada)                     |
|                    | legal_goal      | text      | -                  | Tujuan hukum yang ingin dicapai                  |
|                    | urgency         | enum      | -                  | `low`, `medium`, `high`                          |
|                    | created_at      | timestamp | -                  | Waktu pengajuan kasus                            |
|                    | updated_at      | timestamp | -                  | Waktu update terakhir kasus                      |
| **case_documents** | id              | UUID      | PK                 | -                                                |
|                    | case_id         | UUID      | FK (cases.id)      | File lampiran kasus                              |
|                    | filename        | string    | -                  | Nama file asli                                   |
|                    | file_url        | string    | -                  | Path ke storage/S3                               |
| **case_progress**  | id              | UUID      | PK                 | -                                                |
|                    | case_id         | UUID      | FK (cases.id)      | Timeline perjalan kasus                          |
|                    | status          | enum      | -                  | `submitted`, `accepted`, `in_progress`, `closed` |
|                    | note            | text      | -                  | Update status/catatan                            |
| **consultations**  | id              | UUID      | PK                 | -                                                |
|                    | case_id         | UUID      | FK (cases.id)      | Kasus yang dikonsultasikan                       |
|                    | lawyer_id       | UUID      | FK (lawyers.id)    | Advokat yang memberikan konsultasi               |
|                    | title           | string    | -                  | Judul konsultasi                                 |
|                    | consultation_at | timestamp | -                  | Waktu konsultasi dilakukan                       |
|                    | is_online       | boolean   | -                  | Apakah konsultasi dilakukan secara online        |
|                    | notes           | text      | -                  | Catatan hasil konsultasi                         |
| **reviews**        | id              | UUID      | PK                 | -                                                |
|                    | case_id         | UUID      | FK (cases.id)      | Kasus yang dinilai (Unique)                      |
|                    | client_id       | UUID      | FK (clients.id)    | Klien yang memberikan review                     |
|                    | lawyer_id       | UUID      | FK (lawyers.id)    | Advokat yang direview                            |
|                    | rating          | integer   | 1-5                | Nilai bintang                                    |
|                    | comment         | text      | -                  | Ulasan/Komentar klien                            |
|                    | created_at      | timestamp | -                  | Waktu review dibuat                              |

---

### C. Communication & Education

Tabel untuk fitur interaksi (chat) dan konten artikel edukasi.

| Tabel          | Field       | Tipe Data | Constraint         | Deskripsi                    |
| :------------- | :---------- | :-------- | :----------------- | :--------------------------- |
| **chats**      | id          | UUID      | PK                 | -                            |
|                | case_id     | UUID      | FK (cases.id)      | Konteks chat                 |
|                | sender_id   | UUID      | FK (users.id)      | Pengirim                     |
|                | message     | text      | -                  | Konten pesan                 |
|                | status      | enum      | -                  | `sent`, `delivered`, `read`  |
| **files**      | id          | UUID      | PK                 | -                            |
|                | chat_id     | UUID      | FK (chats.id)      | File yang dikirim dalam chat |
|                | filename    | string    | -                  | Nama file asli               |
|                | file_url    | string    | -                  | Path ke storage/S3           |
| **educations** | id          | UUID      | PK                 | -                            |
|                | category_id | UUID      | FK (categories.id) | Kategori artikel             |
|                | author_id   | UUID      | FK (users.id)      | Admin yang menulis           |
|                | title       | string    | -                  | Judul artikel                |
|                | content     | text      | -                  | Isi berita (Markdown/HTML)   |

---

### D. Notifications

Tabel untuk log aktivitas user dan pergerakan status kasus.

| Tabel             | Field      | Tipe Data | Constraint     | Deskripsi                |
| :---------------- | :--------- | :-------- | :------------- | :----------------------- |
| **notifications** | id         | UUID      | PK             | -                        |
|                   | user_id    | UUID      | FK (users.id)  | Penerima notifikasi      |
|                   | title      | string    | -              | Judul notifikasi         |
|                   | message    | text      | -              | Deskripsi/Isi notifikasi |
|                   | is_read    | boolean   | Default: false | Status dibaca            |
|                   | created_at | timestamp | -              | Waktu notifikasi muncul  |

---

### E. RAG Knowledge System (AI Engine)

Notes: Jika tidak ada fitur upload dokumen, maka tabel ini bisa diabaikan untuk tahap awal. Namun, jika kamu ingin menambahkan fitur upload dokumen untuk melatih chatbot AI, maka tabel ini sangat penting untuk menyimpan data dokumen dan potongan teks yang akan digunakan dalam proses RAG (Retrieval-Augmented Generation).

Grup tabel ini mendukung fitur AI Chatbot berbasis _Retrieval-Augmented Generation_ (RAG) untuk dokumen hukum.

| Tabel               | Field        | Tipe Data | Constraint | Deskripsi                     |
| :------------------ | :----------- | :-------- | :--------- | :---------------------------- |
| **knowledge_base**  | id           | UUID      | PK         | -                             |
|                     | title        | string    | -          | Judul UU/Dokumen hukum        |
|                     | document_url | string    | -          | Link file asli (PDF, dll)     |
|                     | category     | string    | -          | Kategori/Jenis peraturan      |
|                     | created_at   | timestamp | -          | Waktu upload dokumen          |
| **document_chunks** | id           | UUID      | PK         | -                             |
|                     | kb_id        | UUID      | FK (kb.id) | Relasi ke dokumen utama       |
|                     | content_text | text      | -          | Potongan teks (chunk)         |
|                     | embedding    | vector    | -          | Vektor AI untuk chunk ini     |
|                     | chunk_index  | integer   | -          | Urutan potongan dalam dokumen |

---

## 2. Hubungan Antar Entitas (Cardinality)

1.  **Users ↔ Lawyers/Clients (1:1):** Setiap user hanya bisa memiliki satu profil spesifik sebagai Advokat atau Client.
2.  **Categories ↔ Cases/Educations (1:N):** Satu kategori (misal: Perdata) bisa menaungi banyak kasus maupun banyak artikel edukasi.
3.  **Clients ↔ Cases (1:N):** Satu klien bisa mengajukan lebih dari satu kasus (misal: kasus berbeda di waktu berbeda).
4.  **Lawyers ↔ Cases (1:N):** Satu advokat bisa menangani banyak kasus secara bersamaan.
5.  **Cases ↔ Case Documents/Progress (1:N):** Satu kasus memiliki banyak dokumen pendukung dan catatan perkembangan (log).
6.  **Cases ↔ Chats (1:N):** Satu kasus memiliki satu _thread_ percakapan panjang yang berisi banyak pesan.

---

## 3. Catatan Teknis untuk Backend (Pro Tip)

- **Indexing:** Jangan lupa berikan index pada field yang sering dicari seperti `cases.status`, `users.email`, dan `lawyers.status`.
- **Soft Deletes:** Gunakan field `deleted_at` di hampir semua tabel utama. Dalam sistem legal, menghapus data secara permanen sangat berisiko jika terjadi audit di masa depan.
- **Security:** Mengingat ada data sensitif seperti NIK dan dokumen kasus, pastikan file di `case_documents` tidak bisa diakses via URL publik secara langsung. Gunakan **Private S3 Buckets** dengan **Pre-signed URLs**.
- **OCR Integration:** Saat proses registrasi Client, data dari tabel `client_verifications` (sementara) dipindahkan ke tabel `clients` hanya jika status verifikasi sudah valid.
