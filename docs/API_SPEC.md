# API Specification - Document Manager

## Authentication

### POST /auth/login
- Request body:
```json
{
  "username": "string",
  "password": "string"
}
```
- Response body:
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "username": "string"
}
```
- Errors:
  - 401: Invalid username or password

### POST /auth/register
- Request body:
```json
{
  "username": "string",
  "password": "string",
  "email": "string?"
}
```
- Response body: same as login.
- Errors:
  - 400: validation errors
  - 409: username or email already exists

### POST /auth/logout
- Requires Authorization: Bearer token
- Response body:
```json
{ "message": "Logged out" }
```

## Documents
All endpoints dưới `/documents` yêu cầu header `Authorization: Bearer <token>`.

### GET /documents
- Query params: `folder_id`, `skip`, `limit`
- Response: danh sách `DocumentResponse`

### GET /documents/{document_id}
- Response: một document chi tiết

### POST /documents
- Form data:
  - `title` (string)
  - `description` (string, optional)
  - `file_type` (pdf|video|mp3|image|website)
  - `file` (UploadFile, optional)
  - `website_url` (string, optional)
  - `folder_id` (UUID, optional)
- Notes:
  - Với `file_type=website`, `website_url` bắt buộc.
  - Với các loại file khác, `file` bắt buộc.

### PUT /documents/{document_id}
- Request body:
```json
{
  "title": "string?",
  "description": "string?",
  "folder_id": "uuid?"
}
```
- Response: document đã cập nhật.

### DELETE /documents/{document_id}
- Response: `{ "message": "Document deleted successfully" }`

## Folders
Tất cả endpoint `/folders` cũng yêu cầu bearer token.

### GET /folders
- Query params: `parent_id`
- Response: danh sách `FolderResponse`

### GET /folders/{folder_id}
- Response: `FolderResponse`

### POST /folders
- Request body:
```json
{
  "name": "string",
  "parent_id": "uuid?"
}
```

### PUT /folders/{folder_id}
- Request body:
```json
{
  "name": "string?"
}
```

### DELETE /folders/{folder_id}
- Response: `{ "message": "Folder deleted successfully" }`
- Error: 400 nếu thư mục không trống.

## Drive Import

### POST /documents/drive/import
- Request body:
```json
{
  "url": "string",
  "title": "string",
  "description": "string?"
}
```
- Notes: nhập một tệp Drive từ URL public.

### POST /documents/drive/import-folder
- Request body: same as import.
- Requires `GOOGLE_DRIVE_API_KEY` in backend env.
- Response: số lượng file được import.

## Error response format
- Backend trả lỗi bằng định dạng FastAPI tiêu chuẩn, ví dụ:
```json
{
  "detail": "Error message"
}
```
