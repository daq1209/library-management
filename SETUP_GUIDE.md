# 🚀 Hướng Dẫn Khởi Chạy Dự Án NovaLibrary

Tài liệu này hướng dẫn chi tiết cách cài đặt, cấu hình và chạy hệ thống NovaLibrary (Frontend + Backend).

---

## 📋 Mục Lục

1. [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
2. [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
3. [Cài Đặt](#cài-đặt)
4. [Khởi Chạy Ứng Dụng](#khởi-chạy-ứng-dụng)
5. [Nơi Lưu Trữ Dữ Liệu](#nơi-lưu-trữ-dữ-liệu)
6. [Tài Khoản Demo](#tài-khoản-demo)
7. [API Endpoints](#api-endpoints)
8. [Xử Lý Lỗi Thường Gặp](#xử-lý-lỗi-thường-gặp)

---

## ⚙️ Yêu Cầu Hệ Thống

### Phần Mềm Cần Thiết:

- ✅ **Node.js** (phiên bản 20 trở lên)
- ✅ **npm** (đi kèm Node.js)
- ✅ **Git** (để clone dự án)
- ✅ **VS Code** (khuyên dùng) hoặc editor khác

### Kiểm Tra Phiên Bản:

```bash
node --version   # Phải >= v20.0.0
npm --version    # Phải >= 10.0.0
```

---

## 📂 Cấu Trúc Dự Án

```
library-management/
│
├── 📁 frontend/              # Ứng dụng React (Giao diện người dùng)
│   ├── src/
│   │   ├── components/      # Các component UI
│   │   ├── pages/           # Các trang chính
│   │   ├── context/         # Context API (AuthContext)
│   │   ├── utils/           # HTTP client, helpers
│   │   └── ...
│   ├── public/              # Tài nguyên tĩnh
│   ├── package.json
│   └── vite.config.js
│
├── 📁 backend/               # API Server (Node.js + Express)
│   ├── src/
│   │   ├── config/          # Cấu hình database
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # Định nghĩa API routes
│   │   ├── middlewares/     # Auth, error handling
│   │   ├── utils/           # JWT, password hashing
│   │   ├── schemas/         # Validation schemas
│   │   ├── app.js           # Entry point
│   │   └── seed.js          # Tạo dữ liệu demo
│   ├── db/
│   │   └── db.json          # 🔥 DỮ LIỆU ĐƯỢC LƯU Ở ĐÂY
│   ├── .env                 # Cấu hình môi trường
│   ├── package.json
│   └── README.md
│
└── 📄 SETUP_GUIDE.md         # Tài liệu này
```

---

## 🛠️ Cài Đặt

### Bước 1: Clone Dự Án

```bash
git clone <repository-url>
cd library-management
```

### Bước 2: Cài Đặt Backend

```bash
cd backend
npm install
```

**Tạo file cấu hình:**

```bash
cp .env.example .env
```

**Tạo dữ liệu demo (quan trọng!):**

```bash
npm run seed
```

Lệnh này sẽ tạo 3 tài khoản demo:
- Admin: `admin@lib.com` / `123456`
- Librarian: `staff@lib.com` / `123456`
- Reader: `reader@lib.com` / `123456`

### Bước 3: Cài Đặt Frontend

Mở terminal mới:

```bash
cd frontend
npm install
```

---

## 🚀 Khởi Chạy Ứng Dụng

### ⚠️ QUAN TRỌNG: Phải chạy CẢ HAI ứng dụng cùng lúc!

#### **Terminal 1 - Backend (API Server):**

```bash
cd backend
npm run dev
```

**Kết quả mong đợi:**

```
==================================================
🚀 NovaLibrary Backend Server
==================================================
📡 Server running on: http://localhost:4001
🌍 Environment: development
📊 Health check: http://localhost:4001/health
🔐 Auth API: http://localhost:4001/api/v1/auth
==================================================
```

✅ Backend đang chạy tại: **http://localhost:4001**

---

#### **Terminal 2 - Frontend (React App):**

Mở terminal **MỚI**, giữ terminal backend chạy:

```bash
cd frontend
npm run dev
```

**Kết quả mong đợi:**

```
  VITE v7.1.12  ready in 1019 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ Frontend đang chạy tại: **http://localhost:5173**

---

### 🌐 Truy Cập Ứng Dụng

Mở trình duyệt và vào:

```
http://localhost:5173
```

**Luồng test:**
1. Click **"Register"** → Đăng ký tài khoản mới
2. Hoặc click **"Login"** → Dùng tài khoản demo (xem mục [Tài Khoản Demo](#tài-khoản-demo))

---

## 💾 Nơi Lưu Trữ Dữ Liệu

### 📍 Vị Trí File Database:

```
backend/db/db.json
```

**Đường dẫn đầy đủ:**

```
G:\LBsystem\library-management\backend\db\db.json
```

### 📊 Cấu Trúc Dữ Liệu:

```json
{
  "users": [
    {
      "id": "uuid-unique-id",
      "name": "Tên người dùng",
      "email": "email@example.com",
      "passwordHash": "$2a$10$hashed...",
      "role": "reader",
      "createdAt": "2025-11-12T15:32:41.436Z"
    }
  ],
  "tokens": [
    {
      "userId": "uuid-unique-id",
      "refreshToken": "jwt-token...",
      "createdAt": "2025-11-12T15:32:41.436Z"
    }
  ]
}
```

### 🔍 Các Trường Dữ Liệu:

| Trường | Mô Tả | Ví Dụ |
|--------|-------|-------|
| `id` | ID duy nhất (UUID) | `"8d56264b-4f84..."` |
| `name` | Họ tên người dùng | `"Nguyễn Văn A"` |
| `email` | Email (unique) | `"user@example.com"` |
| `passwordHash` | Mật khẩu đã hash (bcrypt) | `"$2a$10$..."` |
| `role` | Vai trò (admin/librarian/reader) | `"reader"` |
| `createdAt` | Thời gian tạo (ISO 8601) | `"2025-11-12T15:32:41.436Z"` |

### 🔒 Bảo Mật:

- ✅ Mật khẩu **KHÔNG** lưu dạng plain text
- ✅ Sử dụng **bcrypt** với 10 salt rounds
- ✅ Refresh tokens được lưu để quản lý session
- ✅ Có thể mở file để kiểm tra dữ liệu

### 📝 Xem Dữ Liệu:

**Cách 1: Dùng Text Editor**

```bash
code backend/db/db.json
```

**Cách 2: Dùng Terminal**

```bash
cat backend/db/db.json
```

**Cách 3: API Endpoint**

```bash
# Kiểm tra health
curl http://localhost:4001/health

# Lấy profile (cần access token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4001/api/v1/auth/me
```

---

## 👥 Tài Khoản Demo

Sau khi chạy `npm run seed`, các tài khoản sau được tạo sẵn:

### 🔑 Tài Khoản 1 - Admin (Quản Trị Viên)

- **Email:** `admin@lib.com`
- **Password:** `123456`
- **Quyền:** Toàn quyền hệ thống

### 🔑 Tài Khoản 2 - Librarian (Thủ Thư)

- **Email:** `staff@lib.com`
- **Password:** `123456`
- **Quyền:** Quản lý sách, mượn trả

### 🔑 Tài Khoản 3 - Reader (Độc Giả)

- **Email:** `reader@lib.com`
- **Password:** `123456`
- **Quyền:** Mượn sách, xem thông tin

### ➕ Tạo Tài Khoản Mới:

Dùng tính năng **Register** trên giao diện hoặc gọi API:

```bash
curl -X POST http://localhost:4001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "password": "123456"
  }'
```

---

## 🔌 API Endpoints

### Base URL: `http://localhost:4001/api/v1`

| Method | Endpoint | Mô Tả | Auth |
|--------|----------|-------|------|
| POST | `/auth/register` | Đăng ký tài khoản mới | ❌ |
| POST | `/auth/login` | Đăng nhập | ❌ |
| GET | `/auth/me` | Lấy thông tin user hiện tại | ✅ |
| POST | `/auth/refresh` | Làm mới access token | ❌ |
| POST | `/auth/logout` | Đăng xuất | ❌ |

### Ví Dụ Request/Response:

#### 1. Đăng Ký

**Request:**

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "reader",
    "createdAt": "2025-11-12T..."
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### 2. Đăng Nhập

**Request:**

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@lib.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@lib.com",
    "role": "admin"
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### 3. Lấy Profile

**Request:**

```http
GET /api/v1/auth/me
Authorization: Bearer eyJhbGc...
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@lib.com",
    "role": "admin"
  }
}
```

---

## ⚠️ Xử Lý Lỗi Thường Gặp

### 1. Port đã được sử dụng

**Lỗi:**

```
Error: listen EADDRINUSE: address already in use :::4001
```

**Giải pháp:**

Tìm và kill process đang dùng port:

**Windows:**

```powershell
# Tìm PID
netstat -ano | findstr :4001

# Kill process (thay PID)
taskkill /PID <PID> /F
```

**Linux/Mac:**

```bash
# Tìm và kill
lsof -ti:4001 | xargs kill -9
```

**Hoặc đổi port trong `.env`:**

```env
PORT=4002
```

---

### 2. Module not found

**Lỗi:**

```
Cannot find module 'axios'
```

**Giải pháp:**

```bash
cd frontend
npm install
```

---

### 3. Database không tạo được

**Lỗi:**

```
ENOENT: no such file or directory 'db/db.json'
```

**Giải pháp:**

```bash
cd backend
npm run seed
```

---

### 4. CORS Error

**Lỗi:**

```
Access to fetch blocked by CORS policy
```

**Giải pháp:**

Kiểm tra file `backend/.env`:

```env
CORS_ORIGIN=http://localhost:5173
```

Và file `frontend/src/utils/http.js`:

```js
baseURL: "http://localhost:4001/api"
```

---

### 5. Token expired

**Lỗi:**

```
Access token has expired
```

**Giải pháp:**

- Frontend tự động làm mới token với refresh token
- Hoặc đăng nhập lại

---

## 📚 Tài Liệu Bổ Sung

### Backend:

Chi tiết về API backend: [`backend/README.md`](backend/README.md)

### Frontend:

Chi tiết về giao diện: [`frontend/README.md`](frontend/README.md)

---

## 🎯 Checklist Trước Khi Demo

- [ ] Backend đang chạy ở port 4001
- [ ] Frontend đang chạy ở port 5173
- [ ] Đã chạy `npm run seed` để có dữ liệu demo
- [ ] File `backend/db/db.json` tồn tại và có dữ liệu
- [ ] Test đăng ký tài khoản mới
- [ ] Test đăng nhập với tài khoản demo
- [ ] Kiểm tra console logs không có lỗi

---

## 🆘 Liên Hệ Hỗ Trợ

Nếu gặp vấn đề, hãy:

1. Kiểm tra [Xử Lý Lỗi Thường Gặp](#xử-lý-lỗi-thường-gặp)
2. Xem logs trong terminal
3. Kiểm tra browser console (F12)
4. Liên hệ team leader

---

## 📝 Ghi Chú

- 🔐 **Mật khẩu demo:** Tất cả đều là `123456`
- 💾 **Database:** LowDB (file JSON, không cần cài DB server)
- 🔄 **Auto-refresh:** Token tự động làm mới
- 🎨 **UI:** Modern, responsive, smooth animations

---

**Chúc bạn code vui vẻ! 🚀**

*Tài liệu được tạo bởi NovaLibrary Team - © 2025*
