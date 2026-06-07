# Document Manager - Project Documentation

> Xem thêm tài liệu chi tiết trong thư mục `docs/`.

## 1. Giới thiệu

Document Manager là một ứng dụng web quản lý tài liệu học tập nội bộ cho phép người dùng:
- Đăng nhập và đăng ký tài khoản.
- Tạo, sửa, xóa thư mục và tài liệu.
- Tải lên tài liệu PDF, video, MP3, hình ảnh.
- Nhập tài liệu từ Google Drive bằng link chia sẻ.
- Tìm kiếm và lọc tài liệu theo loại, tên và mô tả.

Ứng dụng được xây dựng dưới dạng kiến trúc frontend/backend tách biệt:
- Frontend: React + Vite
- Backend: FastAPI + SQLAlchemy
- Lưu trữ tệp: Cloudinary
- Cơ sở dữ liệu: SQL Server (cấu hình trong `.env`)

## 2. Thành phần chính

### 2.1 Frontend
- `frontend/src/App.jsx`: điều hướng giữa màn hình đăng nhập và trang chính.
- `frontend/src/pages/LoginPage.jsx`: form đăng nhập / đăng ký.
- `frontend/src/pages/HomePage.jsx`: giao diện chính hiển thị thư mục và tài liệu.
- `frontend/src/api/api.js`: tập hợp các API call tới backend.
- `frontend/src/components`: các modal và hiển thị tài liệu.
- `frontend/src/hooks/useToast.js`: thông báo toast.

### 2.2 Backend
- `backend/main.py`: khởi tạo FastAPI, cấu hình CORS và đăng ký router.
- `backend/auth.py`: xác thực JWT, hash mật khẩu và middleware bảo mật.
- `backend/database.py`: cấu hình SQLAlchemy và tạo database nếu chưa tồn tại.
- `backend/models.py`: định nghĩa mô hình `User`, `Folder`, `Document`.
- `backend/schemas.py`: định nghĩa Pydantic schema cho request/response.
- `backend/routes`: các route API cho auth, documents, drive, folders.
- `backend/crud.py`: logic CRUD cho documents và folders.
- `backend/utils/cloudinary_utils.py`: upload/xóa file lên Cloudinary.

## 3. Cài đặt môi trường

### 3.1 Yêu cầu
- Python 3.13
- Node.js + npm
- SQL Server với driver ODBC phù hợp
- Cloudinary account

### 3.2 Cài đặt backend
1. Di chuyển vào thư mục backend:
```bash
cd c:/Project/Mywork/backend
```
2. Cài dependencies:
```bash
"C:/Users/Nguyen Ngoc Y/.local/bin/python3.13.exe" -m pip install --break-system-packages -r requirements.txt
```
3. Tạo file `backend/.env` với nội dung:
```dotenv
DATABASE_URL=mssql+pyodbc://sa:YourPassword@./DocumentManager?driver=ODBC+Driver+17+for+SQL+Server&Encrypt=no&TrustServerCertificate=yes
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,https://your-app.vercel.app
AUTH_SECRET_KEY=your_secret_key
```
4. Chạy backend:
```bash
"C:/Users/Nguyen Ngoc Y/.local/bin/python3.13.exe" main.py
```
Hoặc dùng Uvicorn:
```bash
"C:/Users/Nguyen Ngoc Y/.local/bin/python3.13.exe" -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

### 3.3 Cài đặt frontend
1. Di chuyển vào thư mục frontend:
```bash
cd c:/Project/Mywork/frontend
```
2. Cài dependencies:
```bash
npm install
```
3. Chạy frontend:
```bash
npm run dev
```
4. Mở trình duyệt:
`http://localhost:5173`

## 4. Cấu hình và biến môi trường

### Backend
File: `backend/.env`

- `DATABASE_URL`: chuỗi kết nối database.
- `CLOUDINARY_CLOUD_NAME`: tên Cloudinary cloud.
- `CLOUDINARY_API_KEY`: API key Cloudinary.
- `CLOUDINARY_API_SECRET`: Secret Cloudinary.
- `ALLOWED_ORIGINS`: danh sách domain được phép truy cập backend.
- `AUTH_SECRET_KEY`: khóa bí mật dùng để tạo và kiểm tra JWT.

### Frontend
File: `frontend/.env` (nếu cần)
- `VITE_API_URL`: URL backend, ví dụ `http://localhost:8001`

## 5. Chức năng chính

### 5.1 Đăng nhập và đăng ký
- Đăng nhập bằng username và password.
- Đăng ký tài khoản mới với username, email và password.
- Lưu token vào `localStorage`.
- Nếu token hết hạn hoặc không hợp lệ, người dùng bị logout tự động.

### 5.2 Quản lý tài liệu
- Hiển thị tài liệu trong thư mục hiện tại.
- Tải lên tài liệu từ máy tính.
- Tạo tài liệu loại `website` bằng URL.
- Chỉnh sửa tiêu đề và mô tả tài liệu.
- Xóa tài liệu.
- Di chuyển tài liệu giữa thư mục.

### 5.3 Quản lý thư mục
- Tạo thư mục mới.
- Đổi tên thư mục.
- Xóa thư mục nếu trống.
- Điều hướng thư mục bằng breadcrumb.

### 5.4 Tìm kiếm và lọc
- Tìm kiếm theo tên hoặc mô tả.
- Lọc theo loại: tất cả, PDF, video, MP3, image, website.

### 5.5 Nhập Google Drive
- Nhập tài liệu Drive từ URL chia sẻ.
- Nếu cấu hình `GOOGLE_DRIVE_API_KEY`, hỗ trợ import folder Drive.
- Tự động xác định loại tệp và upload lên Cloudinary.

## 6. Kiến trúc dữ liệu

### 6.1 Bảng `users`
- `id` (UUID)
- `username` (String, unique)
- `email` (String, unique, nullable)
- `password_hash` (String)
- `is_active` (Boolean)
- `created_at`, `updated_at`

### 6.2 Bảng `folders`
- `id` (UUID)
- `name` (String)
- `parent_id` (UUID nullable)
- `created_at`, `updated_at`

### 6.3 Bảng `documents`
- `id` (UUID)
- `title` (String)
- `description` (Text nullable)
- `file_type` (Enum)
- `cloudinary_url` (String nullable)
- `cloudinary_public_id` (String nullable)
- `drive_url` (String nullable)
- `folder_id` (UUID nullable)
- `created_at`, `updated_at`

## 7. API endpoints

### 7.1 Authentication
- `POST /auth/login`
  - Request: `{ username, password }`
  - Response: `{ access_token, token_type, username }`
- `POST /auth/register`
  - Request: `{ username, password, email? }`
  - Response: `{ access_token, token_type, username }`

### 7.2 Documents
- `GET /documents?folder_id={id}`
- `GET /documents/{document_id}`
- `POST /documents`
  - Form data: `title`, `description`, `file_type`, `file`, `website_url`, `folder_id`
- `PUT /documents/{document_id}`
  - Body: `{ title?, description?, folder_id? }`
- `DELETE /documents/{document_id}`

### 7.3 Folders
- `GET /folders?parent_id={id}`
- `GET /folders/{folder_id}`
- `POST /folders`
  - Body: `{ name, parent_id? }`
- `PUT /folders/{folder_id}`
  - Body: `{ name? }`
- `DELETE /folders/{folder_id}`

### 7.4 Google Drive
- `POST /documents/drive/import`
  - Body: `{ url, title, description? }`
- `POST /documents/drive/import-folder`
  - Body: `{ url, title, description? }`

## 8. Luồng hoạt động chính

### 8.1 Đăng nhập
1. Người dùng nhập username và password.
2. Frontend gọi `POST /auth/login`.
3. Backend kiểm tra user và password hash.
4. Backend trả token và username.
5. Frontend lưu `access_token` vào `localStorage`.

### 8.2 Upload tài liệu
1. Người dùng mở modal upload.
2. Chọn file hoặc nhập link website.
3. Frontend gửi form tới `POST /documents`.
4. Backend upload file lên Cloudinary.
5. Backend lưu metadata vào database.

### 8.3 Duyệt thư mục
1. Frontend gọi `GET /folders` và `GET /documents`.
2. Backend trả dữ liệu thư mục và tài liệu.
3. Người dùng click thư mục để chuyển vào trong.

## 9. Kiểm tra và debug

### 9.1 Backend
- Kiểm tra log bằng Uvicorn.
- Kiểm tra response status code và message.
- Kiểm tra kết nối database và Cloudinary.

### 9.2 Frontend
- Kiểm tra network tab trong trình duyệt.
- Kiểm tra token `access_token` trên `localStorage`.
- Kiểm tra lỗi trong console.

## 10. Gợi ý nâng cấp

- Thêm phân quyền user (admin, user).
- Thêm đăng nhập OAuth hoặc SSO.
- Thêm chức năng chia sẻ folder/tài liệu.
- Thêm pagination và load more.
- Thêm audit log actions.

## 11. Tài liệu thêm
- `docs/SRS.md`: tài liệu yêu cầu phần mềm chi tiết.
- `backend/.env`: cấu hình backend.
- `frontend/.env`: cấu hình frontend.

---

### Chú ý
Nếu bạn chạy trên Windows Bash, dùng `cd /c/Project/Mywork/backend` rồi chạy Python đúng lệnh.

