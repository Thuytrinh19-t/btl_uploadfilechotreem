# Deployment Guide

## Backend

### 1. Chuẩn bị môi trường
- Cài Python 3.13.
- Kiểm tra `pip` hoạt động.
- Cài driver SQL Server ODBC nếu đang dùng SQL Server.

### 2. Cài dependencies
```bash
cd c:/Project/Mywork/backend
"C:/Users/Nguyen Ngoc Y/.local/bin/python3.13.exe" -m pip install --break-system-packages -r requirements.txt
```

### 3. Cấu hình backend
Tạo file `backend/.env` với các biến sau:
```env
DATABASE_URL=mssql+pyodbc://sa:YourPassword@./DocumentManager?driver=ODBC+Driver+17+for+SQL+Server&Encrypt=no&TrustServerCertificate=yes
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,https://your-app.vercel.app
AUTH_SECRET_KEY=your_secret_key
```
Nếu muốn import folder Drive, thêm:
```env
GOOGLE_DRIVE_API_KEY=your_google_drive_api_key
```

### 4. Khởi động backend
```bash
cd c:/Project/Mywork/backend
"C:/Users/Nguyen Ngoc Y/.local/bin/python3.13.exe" main.py
```

Hoặc dùng uvicorn:
```bash
"C:/Users/Nguyen Ngoc Y/.local/bin/python3.13.exe" -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

### 5. Kiểm tra backend
Mở trình duyệt truy cập:
`http://localhost:8001/health`

Expected response:
```json
{ "status": "ok" }
```

## Frontend

### 1. Cài dependencies
```bash
cd c:/Project/Mywork/frontend
npm install
```

### 2. Khởi động frontend
```bash
npm run dev
```

### 3. Kiểm tra frontend
Mở trình duyệt truy cập:
`http://localhost:5173`

## Môi trường phát triển khác
- Nếu cần đổi cổng backend, sửa `VITE_API_URL` trong `frontend/.env`.
- Nếu backend chạy SSL hoặc deploy, cấu hình `ALLOWED_ORIGINS` cho phù hợp.

## Lưu ý khi chạy trên Windows
- Với PowerShell: dùng `& "path/to/python.exe" main.py`.
- Với Bash: chạy trực tiếp `"path/to/python.exe" main.py`.

## Triển khai sản xuất
- Nên dùng Uvicorn/Gunicorn với reverse proxy Nginx.
- Lưu trữ biến môi trường an toàn.
- Bảo mật kết nối DB và Cloudinary.
