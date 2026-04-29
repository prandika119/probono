# Dokumentasi API Chatbot RAG

Chatbot ini menggunakan arsitektur **Retrieval-Augmented Generation (RAG)** yang memungkinkan AI menjawab pertanyaan hukum berdasarkan dokumen pengetahuan yang telah di-ingest ke dalam sistem. Seluruh endpoint **wajib menggunakan autentikasi JWT**.

## Konfigurasi `.env`

Sebelum menggunakan chatbot, pastikan variabel lingkungan berikut sudah diisi di file `.env`:

```env
# API Key dari Google AI Studio (https://aistudio.google.com/apikey)
GOOGLE_API_KEY=AIzaXXXXXXXXXXXX

# API Key dari Jina AI (https://jina.ai) - untuk embedding dokumen
JINA_API_KEY=jina_XXXXXXXXXX
```

---

## Endpoint API

Base URL: `/api/v1/chatbot`

Semua endpoint memerlukan header:
```
Authorization: Bearer <jwt_token>
```

---

### 1. Membuat Sesi Percakapan Baru

Setiap percakapan dikelompokkan dalam sebuah "sesi". Buat sesi baru sebelum mulai bertanya.

**Request:**
```http
POST /api/v1/chatbot/sessions
```

**Body (opsional):**
```json
{
  "title": "Pertanyaan Hukum Perdata"
}
```
> Jika `title` tidak dikirim, sesi akan diberi judul default **"Chat Baru"**.

**Response (201):**
```json
{
  "status": "success",
  "message": "Sesi percakapan berhasil dibuat.",
  "data": {
    "session": {
      "id": "uuid-sesi",
      "user_id": "uuid-user",
      "title": "Pertanyaan Hukum Perdata",
      "created_at": "2026-04-30T00:00:00.000Z",
      "updated_at": "2026-04-30T00:00:00.000Z"
    }
  }
}
```

---

### 2. Mengirim Pertanyaan (Inti Chatbot)

Ini adalah endpoint utama untuk berinteraksi dengan AI. Kirimkan pertanyaan hukum Anda.

**Request:**
```http
POST /api/v1/chatbot/sessions/:session_id/ask
```

**Body:**
```json
{
  "question": "Apa syarat untuk mengajukan gugatan perdata?"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Pertanyaan berhasil dijawab.",
  "data": {
    "question": "Apa syarat untuk mengajukan gugatan perdata?",
    "answer": "Berdasarkan dokumen referensi, untuk mengajukan gugatan perdata Anda perlu memenuhi beberapa syarat: ...",
    "session_id": "uuid-sesi"
  }
}
```

**Catatan Penting:**
- AI secara otomatis mengingat riwayat 10 pesan terakhir dalam sesi yang sama (Conversational Memory). Anda bisa mengajukan pertanyaan lanjutan tanpa perlu mengulang konteks.
- AI **hanya** menjawab berdasarkan dokumen hukum yang tersedia. Jika pertanyaan di luar basis pengetahuan, AI akan menjawab: *"Maaf, saya tidak menemukan informasi yang relevan..."*

---

### 3. Melihat Daftar Sesi

Mengambil semua sesi percakapan milik user yang sedang login, diurutkan dari yang terbaru.

**Request:**
```http
GET /api/v1/chatbot/sessions
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Sesi percakapan berhasil dibuat.",
  "data": {
    "sessions": [
      {
        "id": "uuid-sesi",
        "title": "Pertanyaan Hukum Perdata",
        "created_at": "2026-04-30T00:00:00.000Z",
        "updated_at": "2026-04-30T00:00:00.000Z",
        "_count": {
          "messages": 4
        }
      }
    ]
  }
}
```

---

### 4. Melihat Riwayat Pesan Satu Sesi

Mengambil seluruh riwayat percakapan dalam satu sesi tertentu. Berguna untuk menampilkan ulang history chat di UI.

**Request:**
```http
GET /api/v1/chatbot/sessions/:session_id/messages
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Riwayat percakapan berhasil dibuat.",
  "data": {
    "messages": [
      {
        "id": "uuid-pesan-1",
        "session_id": "uuid-sesi",
        "role": "user",
        "content": "Apa syarat untuk mengajukan gugatan perdata?",
        "created_at": "2026-04-30T00:00:00.000Z"
      },
      {
        "id": "uuid-pesan-2",
        "session_id": "uuid-sesi",
        "role": "ai",
        "content": "Berdasarkan dokumen referensi...",
        "created_at": "2026-04-30T00:00:00.000Z"
      }
    ]
  }
}
```

---

## Alur Penggunaan Lengkap

```
1. Login → Dapatkan JWT Token
2. POST /chatbot/sessions → Dapatkan session_id
3. POST /chatbot/sessions/:session_id/ask → Tanya pertanyaan pertama
4. POST /chatbot/sessions/:session_id/ask → Tanya lagi (AI mengingat konteks)
5. GET  /chatbot/sessions/:session_id/messages → Lihat seluruh riwayat
```

---

## Kode Error

| Status Code | Arti |
|---|---|
| `401 Unauthorized` | Token JWT tidak valid atau tidak dikirim |
| `403 Forbidden` | Anda mencoba mengakses sesi milik user lain |
| `404 Not Found` | `session_id` tidak ditemukan di database |
| `400 Bad Request` | Field `question` kosong atau terlalu panjang (>2000 karakter) |

---

## Cara Memperbarui Basis Pengetahuan (Knowledge Base)

Jika Anda ingin menambahkan dokumen hukum baru ke dalam sistem, ikuti panduan di file [`RAG_INGESTION_GUIDE.md`](./RAG_INGESTION_GUIDE.md). Setelah dokumen baru di-ingest, Chatbot secara otomatis dapat menjawab berdasarkan dokumen tersebut tanpa perlu restart server.
