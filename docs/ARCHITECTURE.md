# Architecture Overview

## 1. Tổng quan kiến trúc

Document Manager gồm hai phần chính:
- Frontend: React + Vite.
- Backend: FastAPI + SQLAlchemy.

Frontend gọi API backend qua Axios. Backend xử lý xác thực, truy vấn database và upload file lên Cloudinary.

## 2. Sơ đồ luồng dữ liệu

1. Người dùng запрос vào frontend.
2. Frontend gọi API đăng nhập `/auth/login`.
3. Backend xác thực, trả JWT token.
4. Frontend lưu token và gọi các endpoint bảo mật.
5. Backend dùng token để xác thực yêu cầu.
6. Tài liệu được lưu metadata vào database.
7. File tài liệu được upload lên Cloudinary.

## 3. Cấu trúc dữ liệu

### 3.1 User
- `id`: UUID
- `username`: String
- `email`: String
- `password_hash`: hashed password
- `is_active`: Boolean
- `created_at`, `updated_at`

### 3.2 Folder
- `id`: UUID
- `name`: String
- `parent_id`: UUID hoặc null
- `created_at`, `updated_at`

### 3.3 Document
- `id`: UUID
- `title`: String
- `description`: Text
- `file_type`: Enum
- `cloudinary_url`: String
- `cloudinary_public_id`: String
- `drive_url`: String
- `folder_id`: UUID
- `created_at`, `updated_at`

## 4. Kiến trúc API

### 4.1 Auth
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/logout`

### 4.2 Documents
- `GET /documents`
- `GET /documents/{id}`
- `POST /documents`
- `PUT /documents/{id}`
- `DELETE /documents/{id}`

### 4.3 Folders
- `GET /folders`
- `GET /folders/{id}`
- `POST /folders`
- `PUT /folders/{id}`
- `DELETE /folders/{id}`

### 4.4 Drive
- `POST /documents/drive/import`
- `POST /documents/drive/import-folder`

## 5. Mô hình code backend

- `main.py`: khởi tạo app, load .env, tạo bảng và đăng ký router.
- `database.py`: tạo engine SQLAlchemy, session và kiểm tra database.
- `models.py`: định nghĩa bảng ORM.
- `schemas.py`: Pydantic request/response schema.
- `routes/*.py`: định nghĩa các route.
- `crud.py`: logic truy vấn DB.
- `auth.py`: xác thực JWT và hash mật khẩu.
- `utils/cloudinary_utils.py`: upload và xóa file Cloudinary.

## 6. Mô hình code frontend

- `App.jsx`: điều hướng giữa đăng nhập và trang quản lý.
- `LoginPage.jsx`: đăng nhập/đăng ký.
- `HomePage.jsx`: hiển thị tài liệu, thư mục, search, filter và modal.
- `api/api.js`: gọi API tới backend.
- `components/*`: modal, thẻ tài liệu, preview.
- `hooks/useToast.js`: hiển thị toast notification.

## 7. Các điểm mở rộng tương lai

- Thêm phân quyền user.
- Thêm upload trực tiếp vào Google Drive.
- Thêm tính năng chia sẻ thư mục/tài liệu.
- Thêm audit log và lịch sử.
- Thêm pagination cho API tài liệu.
