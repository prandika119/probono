# API Specification: Authentication & User Management

Berdasarkan struktur ERD yang ada di `erd_documentation.md`, berikut adalah rancangan spesifikasi API untuk fitur Autentikasi dan Manajemen User menggunakan JWT (JSON Web Token).

## Base URL
`/api/v1`

## Autentikasi (Authentication)

Autentikasi menggunakan standard **Bearer Token** di dalam HTTP Header.
`Authorization: Bearer <JWT_TOKEN>`

### 1. Register User Baru
**Endpoint:** `POST /auth/register`  
**Deskripsi:** Mendaftarkan user baru. Sistem mendukung 3 tipe role: `client`, `lawyer`, dan `admin`. Payload akan menyesuaikan tipe `role` yang dipilih.  
**Access:** Public  

**Request Body:**
```json
{
  "email": "user@example.com",
  "phone_number": "081234567890",
  "password": "securepassword123",
  "name": "Budi Santoso",
  "nik": "3201234567890001",
  "address": "Jl. Keadilan Raya No.1",
  "province": "Jawa Barat",
  "city": "Depok",
  "role": "client", 
  // Role 'client' specific
  "sktm_upload": "url_to_sktm_image", 
  // Role 'lawyer' specific
  "license_number": "PERADI-12345",
  "license_upload": "url_to_license_image",
  "organization_name": "LBH Jakarta",
  "office_address": "Jl. MH Thamrin No.2",
  "experience": "5 tahun menangani kasus perdata dan pidana",
  "speciality": "perdata"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "User registered successfully. Pending verification.",
  "data": {
    "user": {
      "id": "uuid-1234",
      "email": "user@example.com",
      "name": "Budi Santoso",
      "role": "client",
      "verification_status": "pending",
      "is_active": false
    }
  }
}
```

### 2. Login User
**Endpoint:** `POST /auth/login`  
**Deskripsi:** Proses login untuk mendapatkan JWT Token.  
**Access:** Public  

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": "uuid-1234",
      "email": "user@example.com",
      "name": "Budi Santoso",
      "role": "client",
      "verification_status": "verified"
    }
  }
}
```

### 3. Get Current User (Profile)
**Endpoint:** `GET /auth/me`  
**Deskripsi:** Mengambil detail informasi profil user yang sedang login.  
**Access:** Protected (Semua Role)  

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid-1234",
      "email": "user@example.com",
      "name": "Budi Santoso",
      "nik": "3201234567890001",
      "role": "client",
      "ktp_upload": "url_to_ktp",
      "verification_status": "verified",
      "profile_image": "url_to_profile_pic",
      // Detail tambahan direlasikan berdasarkan role
      "client_detail": {
        "id": "client-uuid",
        "sktm_upload": "url_to_sktm_image"
      }
    }
  }
}
```

---

## Manajemen User (User Management)

### 1. Dapatkan Daftar User
**Endpoint:** `GET /users`  
**Deskripsi:** Mendapatkan daftar user dengan opsi filter (pagination).  
**Access:** Protected (Admin)  
**Query Parameters:**
- `role`: (string) Filter berdasarkan role
- `verification_status`: (string) Filter status verifikasi
- `is_active`: (boolean) Filter status aktif
- `page` & `limit`: Untuk pagination

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
         "id": "uuid-1234",
         "name": "Budi Santoso",
         "email": "user@example.com",
         "role": "client",
         "verification_status": "pending",
         "is_active": false
      }
    ]
  },
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 50
  }
}
```

### 2. Update Informasi Profile
**Endpoint:** `PUT /users/:userId`  
**Deskripsi:** Mengedit detail profil user. User biasa hanya dapat mengedit miliknya sendiri, Admin dapat mengedit milik siapa pun.  
**Access:** Protected (Client, Lawyer, Admin)  

**Request Body:**
```json
{
  "name": "Budi Santoso Baru",
  "address": "Jl. Melati No. 5",
  "phone_number": "08122334455"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "User profile updated successfully"
}
```

### 3. Upload/Update KTP
**Endpoint:** `POST /users/:userId/upload-ktp`  
**Deskripsi:** Upload dokumen KTP user. Format _multipart/form-data_.  
**Access:** Protected (Semua Role)  

**Request Format:** `multipart/form-data`
- `ktp_image`: File gambar KTP (jpg/png)

### 4. Upload/Update SKTM (Khusus Client)
**Endpoint:** `POST /users/:userId/upload-sktm`  
**Deskripsi:** Upload Surat Keterangan Tidak Mampu (SKTM). Endpoint ini khusus untuk user dengan role _client_. Format _multipart/form-data_.  
**Access:** Protected (Client)  

**Request Format:** `multipart/form-data`
- `sktm_file`: File gambar/dokumen SKTM (jpg/png/pdf)

### 5. Upload/Update Lisensi Advokat (Khusus Lawyer)
**Endpoint:** `POST /users/:userId/upload-license`  
**Deskripsi:** Upload lisensi atau Kartu Tanda Pengenal Advokat (PERADI/lainnya). Endpoint ini khusus untuk user dengan role _lawyer_. Format _multipart/form-data_.  
**Access:** Protected (Lawyer)  

**Request Format:** `multipart/form-data`
- `license_file`: File gambar/dokumen lisensi advokat (jpg/png/pdf)

### 6. Upload/Update Profile Image
**Endpoint:** `POST /users/:userId/upload-profile`  
**Deskripsi:** Upload gambar profil user. Format _multipart/form-data_.  
**Access:** Protected (Semua Role)  

**Request Format:** `multipart/form-data`
- `profile_image`: File gambar profil (jpg/png)

### 7. Verifikasi User (Admin Only)
**Endpoint:** `PATCH /users/:userId/verify`  
**Deskripsi:** Menerima atau menolak registrasi user setelah meninjau dokumen (KTP, SKTM, atau Lisensi Hukum).  
**Access:** Protected (Admin)  

**Request Body:**
```json
{
  "status": "verified", // verified | rejected
  "is_active": true,
  "rejection_reason": "" // Optional, jika status rejected
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "User verification status updated successfully"
}
```

### 8. Soft Delete / Non-aktifkan User
**Endpoint:** `DELETE /users/:userId`  
**Deskripsi:** Menghapus atau menutup akun user. Sesuai rekomendasi ERD, ini akan melakukan **Soft Delete** (atau men-set `is_active = false` & menambahkan `deleted_at`).  
**Access:** Protected (Admin, atau User yang ingin menghapus akun sendiri)  

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "User account deactivated/deleted successfully"
}
```
