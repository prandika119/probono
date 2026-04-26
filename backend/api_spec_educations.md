# API Specification: Artikel Edukasi (Education)

Dokumentasi ini menjelaskan spesifikasi API untuk fitur Artikel Edukasi/Berita Hukum pada platform Probono.

## Base URL
`/api/v1/educations`

---

### 1. Dapatkan Daftar Artikel Edukasi
**Endpoint:** `GET /`  
**Deskripsi:** Mendapatkan daftar artikel edukasi beserta relasi nama penulis dan kategorinya. Mendukung fitur pagination dan filter berdasarkan kategori.  
**Access:** Public (Tidak perlu JWT)  

**Query Parameters:**
- `page` (optional): Nomor halaman (default: 1)
- `limit` (optional): Jumlah item per halaman (default: 10)
- `category_id` (optional): UUID kategori (hanya menampilkan artikel di kategori ini)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "educations": [
      {
        "id": "uuid-1234",
        "category_id": "uuid-cat-1",
        "author_id": "uuid-author-1",
        "title": "Cara Mengajukan Gugatan Perdata",
        "content": "Isi artikel lengkap mengenai hukum perdata...",
        "image_url": "/api/v1/uploads/educations/cover_image-168402...-48291.jpg",
        "created_at": "2026-04-26T10:00:00.000Z",
        "updated_at": "2026-04-26T10:00:00.000Z",
        "category": {
          "name": "Hukum Perdata"
        },
        "author": {
          "name": "Budi Admin"
        }
      }
    ],
    "meta": {
      "total_items": 50,
      "current_page": 1,
      "total_pages": 5,
      "per_page": 10
    }
  }
}
```

---

### 2. Dapatkan Detail Artikel
**Endpoint:** `GET /:id`  
**Deskripsi:** Mendapatkan detail spesifik dari satu artikel edukasi berdasarkan ID.  
**Access:** Public (Tidak perlu JWT)  

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "education": {
      "id": "uuid-1234",
      "category_id": "uuid-cat-1",
      "author_id": "uuid-author-1",
      "title": "Cara Mengajukan Gugatan Perdata",
      "content": "Isi artikel lengkap...",
      "image_url": "/api/v1/uploads/educations/cover_image.jpg",
      "created_at": "2026-04-26T10:00:00.000Z",
      "updated_at": "2026-04-26T10:00:00.000Z",
      "category": {
        "name": "Hukum Perdata"
      },
      "author": {
        "name": "Budi Admin"
      }
    }
  }
}
```

**Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Education article not found",
  "error": "Not Found"
}
```

---

### 3. Buat Artikel Baru
**Endpoint:** `POST /`  
**Deskripsi:** Membuat artikel edukasi baru. Mendukung unggahan gambar cover artikel.  
**Access:** Protected (Role: `ADMIN` / Memerlukan JWT)  

**Request Format:** `multipart/form-data`
- `category_id` (string, required): UUID dari tabel Categories (idealnya CategoryType = NEWS)
- `title` (string, required): Judul artikel
- `content` (string, required): Isi konten artikel
- `cover_image` (file, optional): File gambar untuk dijadikan thumbnail/cover artikel (otomatis akan disimpan dan diakses via public URL)

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Article created successfully",
  "data": {
    "education": {
      "id": "uuid-1234",
      "title": "Cara Mengajukan Gugatan Perdata",
      "image_url": "/api/v1/uploads/educations/cover_image-168...jpg",
      // ... detail lain
    }
  }
}
```

---

### 4. Edit Artikel
**Endpoint:** `PATCH /:id`  
**Deskripsi:** Mengubah judul, kategori, isi konten, atau mengganti gambar cover artikel.  
**Access:** Protected (Role: `ADMIN` / Memerlukan JWT)  

**Request Format:** `multipart/form-data`
Semua field bersifat opsional, hanya kirim yang ingin diubah.
- `category_id` (string, optional)
- `title` (string, optional)
- `content` (string, optional)
- `cover_image` (file, optional)

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Article updated successfully",
  "data": {
    "education": {
       // ... updated fields
    }
  }
}
```

---

### 5. Hapus Artikel
**Endpoint:** `DELETE /:id`  
**Deskripsi:** Menghapus artikel secara permanen dari database.  
**Access:** Protected (Role: `ADMIN` / Memerlukan JWT)  

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Article deleted successfully"
}
```
