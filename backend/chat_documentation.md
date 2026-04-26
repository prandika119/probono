# Dokumentasi API Chat & WebSocket

Dokumentasi ini menjelaskan endpoint REST API dan koneksi WebSocket yang digunakan untuk fitur chat antar klien dan pengacara (lawyer) dalam suatu kasus (case).

## 1. REST API Endpoints

### 1.1 Mendapatkan Riwayat Chat
Digunakan untuk mengambil riwayat pesan pada kasus tertentu menggunakan sistem cursor-based pagination. Cursor-based sangat cocok untuk chat karena data tidak akan bergeser saat ada pesan baru.

**Endpoint:**
`GET /chats/:caseId/history`

**Headers:**
- `Authorization`: `Bearer <token>`

**Query Parameters:**
- `cursor` (opsional): ID chat terakhir yang dimuat (untuk load more). Kosongkan untuk memuat pesan terbaru.
- `limit` (opsional): Jumlah pesan per halaman, default `20`.

**Response (Success - 200 OK):**
```json
{
  "status": "success",
  "data": {
    "chats": [
      {
        "id": "uuid",
        "case_id": "uuid",
        "sender_id": "uuid",
        "message": "Pesan dari user...",
        "status": "READ",
        "created_at": "2026-04-24T00:00:00.000Z",
        "sender": {
          "id": "uuid",
          "name": "John Doe",
          "role": "CLIENT" // atau "LAWYER"
        },
        "files": []
      }
    ],
    "meta": {
      "next_cursor": "uuid-chat-terlama-di-batch-ini",
      "per_page": 20,
      "has_more": true
    }
  }
}
```

### 1.2 Upload File Attachment (Chat)
Digunakan untuk mengunggah file yang akan dilampirkan dalam pesan chat (misal: dokumen atau gambar).

**Endpoint:**
`POST /chats/:caseId/upload`

**Headers:**
- `Authorization`: `Bearer <token>`
- `Content-Type`: `multipart/form-data`

**Body (Form-Data):**
- `file`: File yang diunggah (Maks 10MB, format yang diizinkan: jpeg, jpg, png, pdf, doc, docx, xls, xlsx).

**Response (Success - 201 Created):**
```json
{
  "status": "success",
  "message": "File uploaded successfully",
  "data": {
    "filename": "nama-file-asli.pdf",
    "file_url": "/uploads/chats/123456789-12345.pdf",
    "mime_type": "application/pdf",
    "size": 102400
  }
}
```

---

## 2. WebSocket (Real-Time Chat)

WebSocket digunakan untuk pengiriman pesan secara real-time dan status indikator "typing".

**Namespace:** `/chats`

### 2.1 Autentikasi dan Koneksi

Koneksi membutuhkan JWT token. Token dapat dikirim melalui dua cara:
1. **Header:** `Authorization: Bearer <token>`
2. **Auth Socket:** `socket.auth = { token: "<token>" }`

**Rooms (Otomatis):**
- Setelah terhubung, user secara otomatis akan dimasukkan ke dalam *personal room*: `user_<userId>`. Room ini bisa digunakan untuk notifikasi sistem secara global.

### 2.2 Event Emit (Klien ke Server)

#### a. `joinCaseRoom`
Klien memanggil event ini saat masuk ke halaman chat suatu kasus untuk menerima pesan terkait kasus tersebut.
**Payload:**
```json
{
  "caseId": "uuid-kasus"
}
```

#### b. `leaveCaseRoom`
Klien memanggil event ini saat keluar dari halaman chat suatu kasus (khususnya pada SPA) agar berhenti menerima notifikasi/pesan dari kasus tersebut dan mencegah kebocoran pesan antar kasus.
**Payload:**
```json
{
  "caseId": "uuid-kasus"
}
```

#### c. `sendMessage`
Mengirim pesan teks beserta lampiran file (jika ada). Lampiran `file_url` didapatkan dari respons REST API upload file sebelumnya.
**Payload:**
```json
{
  "caseId": "uuid-kasus",
  "message": "Isi pesan teks (maksimal 2000 karakter)",
  "attachments": [
    {
      "filename": "nama-file.pdf",
      "file_url": "/uploads/chats/123456789-12345.pdf"
    }
  ] // attachments opsional
}
```

#### d. `typing`
Memberi tahu pengguna lain di dalam room bahwa klien sedang mengetik.
**Payload:**
```json
{
  "caseId": "uuid-kasus",
  "isTyping": true // set false jika berhenti mengetik
}
```

### 2.3 Event Listener (Server ke Klien)

#### a. `joinedCaseRoom`
Diterima sebagai konfirmasi setelah klien berhasil melakukan emit `joinCaseRoom`.
**Payload:**
```json
{
  "success": true,
  "caseId": "uuid-kasus"
}
```

#### b. `leftCaseRoom`
Diterima sebagai konfirmasi setelah klien berhasil melakukan emit `leaveCaseRoom`.
**Payload:**
```json
{
  "success": true,
  "caseId": "uuid-kasus"
}
```

#### c. `newMessage`
Diterima ketika ada pesan baru di room kasus.
**Payload:**
```json
{
  "id": "uuid",
  "case_id": "uuid",
  "sender_id": "uuid",
  "message": "Isi pesan",
  "status": "SENT",
  "created_at": "2026-04-24T00:00:00.000Z",
  "sender": {
    "id": "uuid",
    "name": "Nama Pengirim",
    "role": "LAWYER"
  },
  "files": [
    {
      "id": "uuid",
      "chat_id": "uuid",
      "filename": "nama-file.pdf",
      "file_url": "/uploads/chats/123456789-12345.pdf"
    }
  ]
}
```

#### d. `userTyping`
Diterima ketika seseorang di dalam room mulai atau berhenti mengetik.
**Payload:**
```json
{
  "userId": "uuid-pengirim",
  "name": "Nama Pengirim",
  "isTyping": true // atau false
}
```

#### e. `error`
Diterima jika terjadi kesalahan pada saat autentikasi koneksi awal (misal token hilang/tidak valid) atau kesalahan pada WebSocket payload (misalnya gagal menyimpan pesan).
**Payload:**
```json
{
  "message": "Error message description"
}
```

---

## Alur Kerja (Workflow) Chat dengan File:
1. Klien/Lawyer memilih file yang ingin diupload menggunakan REST API endpoint `/chats/:caseId/upload`.
2. Server merespon dengan `file_url` dan `filename`.
3. Aplikasi melakukan emit event WebSocket `sendMessage` dengan `message` (opsional teks) dan mengirim payload di array `attachments`.
