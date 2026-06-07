# SRS - Document Manager

## 1. Giới thiệu

### 1.1 Mục đích
Tài liệu yêu cầu phần mềm (SRS) này mô tả các yêu cầu chức năng và phi chức năng của hệ thống Document Manager.

### 1.2 Đối tượng người dùng
- Học sinh / sinh viên: dùng để quản lý tài liệu học tập.
- Giáo viên / quản trị viên: có thể quản lý nội dung và kiểm tra hoạt động.

### 1.3 Phạm vi hệ thống
- Hệ thống cho phép người dùng đăng nhập/đăng ký.
- Tải lên và quản lý tài liệu PDF, video, MP3, hình ảnh.
- Tạo và quản lý thư mục.
- Nhập tài liệu từ Google Drive.
- Tìm kiếm, lọc và xem trước tài liệu.

## 2. Mô tả tổng thể

### 2.1 Kiến trúc hệ thống
- Frontend: React + Vite.
- Backend: FastAPI + SQLAlchemy.
- Cơ sở dữ liệu: SQL Server qua `SQLAlchemy`.
- Lưu trữ tệp: Cloudinary.
- Xác thực: JWT token tự tạo bằng HMAC-SHA256.

### 2.2 Môi trường và cấu hình
- Backend dùng `.env` để cấu hình DB và Cloudinary.
- Frontend dùng `VITE_API_URL` để trỏ tới backend.

## 3. Các chức năng chính

### 3.1 Authentication
- Đăng nhập: username + password.
- Đăng ký: username, password, email.
- Lưu trữ token trong `localStorage`.
- Logout khi token hết hạn hoặc 401.

### 3.2 Quản lý tài liệu
- Danh sách tài liệu theo thư mục.
- Upload file từ máy.
- Tạo tài liệu website bằng URL.
- Sửa tiêu đề và mô tả.
- Xóa tài liệu và xóa file Cloudinary.
- Di chuyển tài liệu giữa thư mục.

### 3.3 Quản lý thư mục
- Tạo thư mục mới.
- Đổi tên thư mục.
- Xóa thư mục chỉ khi trống.
- Điều hướng breadcrumb.

### 3.4 Tìm kiếm và lọc
- Tìm theo tên hoặc mô tả.
- Lọc theo loại: all, pdf, video, mp3, image, website.

### 3.5 Import Google Drive
- Nhập file Drive qua link chia sẻ.
- Nhập folder Drive khi `GOOGLE_DRIVE_API_KEY` được cấu hình.

## 4. Các luồng chính

### 4.1 Use case: Đăng nhập
1. Người dùng nhập username và password.
2. Frontend gọi `POST /auth/login`.
3. Backend xác thực và trả về token.
4. Frontend lưu token và chuyển sang trang chính.

### 4.2 Use case: Upload tài liệu
1. Người dùng mở modal upload.
2. Chọn file hoặc nhập link website.
3. Gửi yêu cầu POST `/documents`.
4. Backend upload lên Cloudinary và lưu metadata.

### 4.3 Use case: Tạo thư mục
1. Người dùng mở modal tạo thư mục.
2. Nhập tên và xác nhận.
3. Gọi POST `/folders`.
4. Thư mục mới xuất hiện trong danh sách.

### 4.4 Use case: Di chuyển tài liệu
1. Người dùng chọn tài liệu.
2. Chọn thư mục đích.
3. Gọi PUT `/documents/{id}` với `folder_id` mới.

## 5. Yêu cầu phi chức năng

### 5.1 Bảo mật
- Token bearer bắt buộc cho mọi endpoint tài liệu và thư mục.
- Mật khẩu người dùng hash bằng PBKDF2-SHA256.
- CORS chỉ cho phép origin trong `ALLOWED_ORIGINS`.

### 5.2 Hiệu năng
- Backend giới hạn truy vấn tài liệu.
- Frontend tải dữ liệu đồng thời.

### 5.3 Tính mở rộng
- Kiến trúc tách biệt frontend/backend.
- Dễ thay đổi Cloudinary hoặc DB khác.

## 6. Điều kiện và giả định

- Người dùng phải có tài khoản để truy cập.
- Database và Cloudinary phải cấu hình đúng.
- API Google Drive chỉ hoạt động khi có `GOOGLE_DRIVE_API_KEY` nếu nhập folder.

## 7. Phụ lục
- Tài liệu API: `docs/API_SPEC.md`
- Triển khai: `docs/DEPLOYMENT.md`
- Kiến trúc: `docs/ARCHITECTURE.md`
- Hướng dẫn sử dụng: `docs/USER_GUIDE.md`
