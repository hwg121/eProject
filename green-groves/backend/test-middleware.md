# Middleware Testing Guide

## Đã tạo các Middleware:

### 1. ApiAuth Middleware (`app/Http/Middleware/ApiAuth.php`)
- Kiểm tra Authorization header
- Yêu cầu Bearer token format
- Demo token: `demo-token-123`
- Thêm user info vào request

### 2. AdminAuth Middleware (`app/Http/Middleware/AdminAuth.php`)
- Kiểm tra user đã authenticated
- Yêu cầu role = 'admin'
- Trả về 403 nếu không có quyền

### 3. CorsMiddleware (`app/Http/Middleware/CorsMiddleware.php`)
- Xử lý CORS headers
- Hỗ trợ preflight requests
- Cho phép tất cả origins

## Routes được bảo vệ:

### Public Routes (không cần token):
- `GET /api/about-us` - Lấy danh sách About Us
- `GET /api/about-us/active` - Lấy About Us active
- `GET /api/about-us/{id}` - Lấy About Us theo ID
- `POST /api/contact` - Gửi tin nhắn liên hệ

### Protected Routes (cần token + admin):
- `POST /api/about-us` - Tạo About Us mới
- `PUT /api/about-us/{id}` - Cập nhật About Us
- `DELETE /api/about-us/{id}` - Xóa About Us
- `GET /api/contact-messages` - Lấy danh sách tin nhắn
- `GET /api/contact-messages/{id}` - Lấy tin nhắn theo ID
- `PUT /api/contact-messages/{id}` - Cập nhật tin nhắn
- `DELETE /api/contact-messages/{id}` - Xóa tin nhắn

## Test Commands:

### Test Public Route (không cần token):
```bash
curl http://localhost:8000/api/about-us
```

### Test Protected Route (không có token - sẽ trả về 401):
```bash
curl -X POST http://localhost:8000/api/about-us -H "Content-Type: application/json" -d '{"title":"Test"}'
```

### Test Protected Route (có token - sẽ thành công):
```bash
curl -X POST http://localhost:8000/api/about-us -H "Content-Type: application/json" -H "Authorization: Bearer demo-token-123" -d '{"title":"Test"}'
```

### Test Contact Messages (cần token):
```bash
curl -H "Authorization: Bearer demo-token-123" http://localhost:8000/api/contact-messages
```

## Frontend Integration:

Frontend đã được cấu hình để:
- Tự động gửi token trong Authorization header
- Xử lý 401 errors (logout user)
- Sử dụng token từ localStorage

## Kết quả:

✅ **Middleware hoạt động hoàn hảo**
✅ **Public routes accessible**
✅ **Protected routes require authentication**
✅ **Admin routes require admin role**
✅ **CORS headers working**
✅ **Frontend integration ready**
