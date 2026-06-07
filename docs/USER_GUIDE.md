# User Guide - Document Manager

## 1. Giới thiệu
Tài liệu này hướng dẫn người dùng cuối cách sử dụng các chức năng chính của ứng dụng Document Manager.

## 2. Đăng nhập và đăng ký

### 2.1 Đăng nhập
1. Mở `http://localhost:5173`.
2. Nhập `Tài khoản` và `Mật khẩu`.
3. Nhấn `Đăng nhập`.
4. Nếu thành công, bạn sẽ vào trang quản lý tài liệu.

### 2.2 Đăng ký
1. Chọn nút `Chưa có tài khoản? Đăng ký`.
2. Nhập `Tài khoản`, `Email` và `Mật khẩu`.
3. Nhấn `Đăng ký`.
4. Sau khi đăng ký thành công, hệ thống sẽ tự động đăng nhập.

## 3. Trang chính

### 3.1 Header
- Hiển thị tên người dùng.
- Nút `Folder+`: tạo thư mục mới.
- Nút `Import Drive`: nhập tài liệu từ Google Drive.
- Nút `Upload`: mở modal upload tài liệu.
- Nút `Đăng xuất`.

### 3.2 Tìm kiếm và lọc
- Nhập từ khóa vào ô tìm kiếm để lọc tiêu đề hoặc mô tả.
- Chọn tab loại tài liệu để lọc theo PDF, Video, MP3, Ảnh, Website.

### 3.3 Breadcrumb và điều hướng thư mục
- Nhấn vào `Trang Chủ` để về root.
- Nhấn vào tên thư mục trong breadcrumb để quay lại thư mục đó.
- Nếu đang trong thư mục con, nút `Quay lại` sẽ đưa bạn lên cấp trên.

## 4. Quản lý thư mục

### 4.1 Tạo thư mục
1. Nhấn `Folder+`.
2. Nhập tên thư mục.
3. Nhấn `Lưu`.
4. Thư mục mới xuất hiện trong danh sách.

### 4.2 Chỉnh sửa thư mục
1. Chọn nút chỉnh sửa trên mỗi thư mục.
2. Nhập tên mới.
3. Lưu lại.

### 4.3 Xóa thư mục
- Chỉ xóa khi thư mục trống.
- Nếu thư mục chứa tài liệu hoặc thư mục con, hệ thống sẽ báo lỗi.

## 5. Quản lý tài liệu

### 5.1 Upload tài liệu
1. Nhấn `Upload`.
2. Chọn loại tài liệu.
3. Với file upload, chọn tệp từ máy.
4. Với website, nhập URL.
5. Nhập tiêu đề và mô tả.
6. Nhấn `Upload`.

### 5.2 Xem tài liệu
- Nhấn nút xem để mở modal xem trước.
- Với PDF/video/MP3, modal hiển thị preview nếu Cloudinary hỗ trợ.
- Với Website, hệ thống mở link hoặc hiển thị thông tin.

### 5.3 Chỉnh sửa tài liệu
1. Nhấn nút `Edit` trên thẻ tài liệu.
2. Cập nhật tiêu đề hoặc mô tả.
3. Lưu lại.

### 5.4 Xóa tài liệu
- Nhấn `Delete` để xóa tài liệu.
- Hệ thống cũng xóa file khỏi Cloudinary nếu có.

### 5.5 Di chuyển tài liệu
- Sử dụng tính năng thay đổi `folder_id` khi chỉnh sửa để chuyển tài liệu sang thư mục khác.

## 6. Nhập từ Google Drive

### 6.1 Import một file
1. Nhấn `Import Drive`.
2. Nhập link chia sẻ Google Drive, tiêu đề và mô tả.
3. Nhấn `Import`.
4. Hệ thống sẽ upload file về Cloudinary.

### 6.2 Import folder
- Muốn dùng tính năng này, backend cần biến môi trường `GOOGLE_DRIVE_API_KEY`.
- Chỉ hoạt động với URL thư mục Drive.

## 7. Sự cố thường gặp

### 7.1 Không đăng nhập được
- Kiểm tra username và password.
- Kiểm tra backend đang chạy và API trả về.

### 7.2 Không thấy tài liệu mới
- Tải lại trang sau khi upload.
- Kiểm tra xem tài liệu có lưu vào thư mục đúng không.

### 7.3 Import Drive lỗi
- Kiểm tra link chia sẻ đúng định dạng.
- Kiểm tra backend có cấu hình `GOOGLE_DRIVE_API_KEY` nếu import folder.

## 8. Ghi chú

- Ứng dụng hiện tại phù hợp cho nội bộ.
- Một số tính năng nâng cao như phân quyền, chia sẻ, pagination chưa triển khai.
