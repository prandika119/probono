# API Specification: Case Management

Berdasarkan struktur ERD yang ada di `erd_documentation.md`, berikut adalah rancangan spesifikasi API untuk fitur Manajemen Kasus (Case Management), termasuk upload kasus, pencarian oleh pengacara, melihat detail progress, dan fitur terkait lainnya.

## Base URL
`/api/v1`

## Autentikasi
Semua endpoint di bawah ini memerlukan header autentikasi:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Master Data Kategori

### Dapatkan Daftar Kategori Kasus
**Endpoint:** `GET /categories`  
**Deskripsi:** Mendapatkan daftar kategori kasus hukum untuk ditampilkan pada dropdown saat pembuatan/pencarian kasus.  
**Access:** Protected (Semua Role)  
**Query Parameters:**
- `type`: `case` (untuk mengambil kategori khusus kasus, bukan modul news/artikel)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": "uuid-category-1",
        "name": "Pidana Umum"
      },
      {
        "id": "uuid-category-2",
        "name": "Perdata"
      }
    ]
  }
}
```

### Tambah Kategori Baru
**Endpoint:** `POST /categories`  
**Deskripsi:** Menambahkan kategori hukum baru.  
**Access:** Protected (Disarankan Admin)  

**Request Body:**
```json
{
  "name": "Hukum Perlindungan Konsumen",
  "type": "CASE" // CASE | NEWS
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Category created successfully",
  "data": {
    "category": {
      "id": "uuid-new-category",
      "name": "Hukum Perlindungan Konsumen",
      "type": "CASE"
    }
  }
}
```

### Hapus Kategori
**Endpoint:** `DELETE /categories/:id`  
**Deskripsi:** Menghapus kategori berdasarkan ID. Akan gagal jika kategori ini masih digunakan pada kasus yang sudah ada.  
**Access:** Protected (Disarankan Admin)  

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Category deleted successfully"
}
```

---

## 2. Manajemen Kasus (Client)

### A. Upload / Ajukan Kasus Baru
**Endpoint:** `POST /cases`  
**Deskripsi:** Client membuat laporan/pengajuan kasus baru. Default status di backend saat pembuatan adalah `submitted` dan `lawyer_id` masih kosong.  
**Access:** Protected (Client)  

**Request Body:**
```json
{
  "category_id": "uuid-category-2",
  "title": "Sengketa Lahan Warisan Keluarga",
  "description": "Kronologi kejadian bermula dari klaim pihak luar terhadap ahli waris...",
  "location": "Jakarta Selatan",
  "date": "2023-11-20",
  "opponent": "PT Maju Mundur",
  "estimated_loss": 50000000.00,
  "legal_goal": "Mendapatkan hak tanah kembali sepenuhnya",
  "urgency": "high" // low | medium | high
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Case submitted successfully",
  "data": {
    "case": {
      "id": "uuid-case-1234",
      "status": "submitted",
      "created_at": "2023-11-20T10:00:00Z"
    }
  }
}
```

### B. Upload Dokumen Pendukung Kasus
**Endpoint:** `POST /cases/:caseId/documents`  
**Deskripsi:** Mengunggah lampiran dokumen bukti pendukung kasus spesifik. Format menggunakan _multipart/form-data_.  
**Access:** Protected (Client - Pemilik Kasus)  

**Request Format:** `multipart/form-data`
- `document_file`: File unggah dokumen (pdf, img, dll)

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "id": "doc-uuid-1",
      "filename": "Sertifikat_Tanah.pdf",
      "file_url": "s3_url_or_path"
    }
  }
}
```

### C. Dapatkan Kasus Milik Sendiri
**Endpoint:** `GET /cases/me`  
**Deskripsi:** Menampilkan daftar kasus yang telah diajukan oleh klien tersebut.  
**Access:** Protected (Client)  

**Query Parameters (Opsional):**
- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah data per halaman (default: 10)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "cases": [
      {
        "id": "uuid-case-1234",
        "title": "Sengketa Lahan Warisan Keluarga",
        "category_name": "Perdata",
        "status": "in_progress",
        "created_at": "2023-11-20T10:00:00Z"
      }
    ],
    "meta": {
      "total_items": 15,
      "current_page": 1,
      "total_pages": 2,
      "per_page": 10
    }
  }
}
```

---

## 3. Manajemen Kasus (Lawyer)

### A. Cari Daftar Kasus Tersedia
**Endpoint:** `GET /cases/available`  
**Deskripsi:** Lawyer mencari daftar kasus terbuka yang belum ditangani oleh advokat lain (dimana `lawyer_id` masih NULL dan status ada di `submitted`).  
**Access:** Protected (Lawyer)  

**Query Parameters:**
- `category_id`: (opsional) Filter berdasarkan id kategori
- `urgency`: (opsional) Filter berdasarkan level urgensi
- `location`: (opsional) Pencarian berdasarkan kota/lokasi
- `page` & `limit`: Pagination

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "cases": [
      {
        "id": "uuid-case-1234",
        "title": "Sengketa Lahan Warisan Keluarga",
        "category_name": "Perdata",
        "location": "Jakarta Selatan",
        "urgency": "high",
        "created_at": "2023-11-20T10:00:00Z"
      }
    ]
  },
  "meta": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 25
  }
}
```

### B. Terima / Ambil Kasus
**Endpoint:** `PATCH /cases/:caseId/accept`  
**Deskripsi:** Lawyer menyetujui untuk menangani kasus tertentu. Operasi ini akan mengubah status kasus (di tabel `case_progress`) menjadi `accepted` dan menetapkan `lawyer_id` ke akun Advokat tersebut di tabel `cases`.  
**Access:** Protected (Lawyer)  

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Case accepted successfully. You are now assigned to this case."
}
```

### C. Dapatkan Kasus yang Sedang Ditangani
**Endpoint:** `GET /cases/handled`  
**Deskripsi:** Menampilkan daftar kasus yang sedang atau telah selesai ditangani oleh advokat tersebut.  
**Access:** Protected (Lawyer)

**Query Parameters (Opsional):**
- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah data per halaman (default: 10)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "cases": [
      {
        "id": "uuid-case-1234",
        "title": "Sengketa Lahan Warisan Keluarga",
        "client_name": "Budi Santoso",
        "status": "in_progress",
        "last_update": "2023-11-21T10:00:00Z"
      }
    ],
    "meta": {
      "total_items": 5,
      "current_page": 1,
      "total_pages": 1,
      "per_page": 10
    }
  }
}
```

---

## 4. Tracking & Detail Progress Kasus

### A. Lihat Detail Kasus Secara Penuh
**Endpoint:** `GET /cases/:caseId`  
**Deskripsi:** Menampilkan detail menyeluruh atas sebuah kasus. Termasuk relasi ke klien, lawyer, array dokumen lampiran, dan array riwayat progress kasus.  
**Access:** Protected (Client Pemilik Kasus, Lawyer yang Ditugaskan, Admin)  

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "case": {
      "id": "uuid-case-1234",
      "title": "Sengketa Lahan Warisan Keluarga",
      "description": "Kronologi...",
      "client": { "id": "client-1", "name": "Budi Santoso", "phone_number": "0812xx" },
      "lawyer": { "id": "lawyer-1", "name": "Hotman", "organization_name": "LBH Jaya" },
      "category": { "name": "Perdata" },
      "urgency": "high",
      "status": "in_progress",
      "documents": [
        { "id": "doc-1", "filename": "Sertifikat.pdf", "file_url": "..." }
      ],
      "progress": [
        {
          "id": "prog-1",
          "status": "submitted",
          "note": "Kasus diajukan oleh klien",
          "created_at": "2023-11-20T10:00:00Z"
        },
        {
          "id": "prog-2",
          "status": "accepted",
          "note": "Kasus diterima oleh advokat dan tim LBH",
          "created_at": "2023-11-21T10:00:00Z"
        }
      ]
    }
  }
}
```

### B. Perbarui Progress Kasus
**Endpoint:** `POST /cases/:caseId/progress`  
**Deskripsi:** Advokat menambah catatan perjalanan perkara/timeline kasus. Entry ini masuk ke tabel `case_progress`.  
**Access:** Protected (Lawyer yang ditugaskan pada kasus ini)  

**Request Body:**
```json
{
  "status": "in_progress", // submitted | accepted | in_progress | closed
  "note": "Telah dilakukan mediasi tahap pertama di Pengadilan Negeri dan para pihak hadir."
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Case progress updated successfully."
}
```

---

## 5. Fitur Terkait Lainnya (Konsultasi & Review)

### A. Tambah Catatan Konsultasi
**Endpoint:** `POST /cases/:caseId/consultations`  
**Deskripsi:** Advokat membuat catatan dan jadwal untuk konsultasi klien yang berkenaan dengan kasus tersebut.  
**Access:** Protected (Lawyer yang Ditugaskan)  

**Request Body:**
```json
{
  "title": "Konsultasi Persiapan Penyerahan Bukti",
  "consultation_at": "2023-11-25T14:00:00Z",
  "is_online": true,
  "link_meet": "https://zoom.us/j/123456789", // Opsional
  "location": "Kantor LBH Jakarta Pusat", // Opsional
  "notes": "Pertemuan akan dilakukan via Zoom atau tatap muka di lokasi."
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Consultation schedule created successfully",
  "data": {
    "consultation": {
      "id": "consult-uuid-99",
      "title": "Konsultasi Persiapan Penyerahan Bukti",
      "consultation_at": "2023-11-25T14:00:00Z"
    }
  }
}
```

### B. Beri Ulasan/Review (Khusus Client)
**Endpoint:** `POST /cases/:caseId/reviews`  
**Deskripsi:** Klien memberikan penilaian/rating kepada lawyer atas kinerjanya dalam sebuah kasus. Operasi ini **hanya dizinkan** kalau status terakhir dari kasus adalah `closed`.  
**Access:** Protected (Client Pemilik Kasus)  

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Pelayanan sangat profesional. Terima kasih telah mendampingi berjalannya alur perkara saya."
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Review submitted successfully"
}
```
