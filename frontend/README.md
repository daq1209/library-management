📘 README.md
# 📚 Library Management Web App (Frontend)

Giao diện người dùng cho hệ thống quản lý thư viện — được phát triển bằng **React + Vite + TailwindCSS + Firebase Auth + Redux Toolkit**.

---

## 🚀 Cài đặt & Chạy dự án

### 1️⃣ Yêu cầu môi trường
Trước khi bắt đầu, đảm bảo bạn đã cài đặt:
- **Node.js** ≥ 18
- **npm** ≥ 9 \
---

### 2️⃣ Clone dự án từ GitHub
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd frontend

3️⃣ Cài đặt dependencies

Chạy lệnh sau để tải tất cả thư viện cần thiết:

npm install

4️⃣ Cấu hình biến môi trường

Tạo file .env trong thư mục frontend/ lên firebase lấy mã điền thông tin Firebase của bạn:

VITE_API_KEY=your_api_key
VITE_Auth_Domain=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDERID=your_sender_id
VITE_APPID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id


⚠️ Không commit file .env lên GitHub — đây là thông tin bảo mật.

5️⃣ Chạy project ở chế độ development
npm run dev


Sau khi chạy, mở trình duyệt và truy cập:
👉 http://localhost:5173