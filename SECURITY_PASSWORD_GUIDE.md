# 🔐 Security Password Management Guide

## Tổng quan (Overview)

Security Password là mật khẩu bảo mật đặc biệt được sử dụng khi tạo hoặc chỉnh sửa tài khoản admin. Mật khẩu này đảm bảo chỉ chủ website mới có thể thực hiện các thao tác quan trọng với quyền admin.

---

## 📍 Vị trí trong Admin Panel

Để truy cập Security Settings:

1. Đăng nhập với tài khoản **Admin**
2. Vào **Sidebar** → **Site Settings** → **Security Settings**

---

## 🛠️ Cách thay đổi Security Password

### Phương pháp 1: Qua Admin Panel (UI) ✅ Recommended

1. Vào **Site Settings** → **Security Settings**
2. Điền 3 trường sau:
   - **Account Password**: Mật khẩu tài khoản admin hiện tại của bạn (để xác thực)
   - **Current Security Password**: Security password hiện tại
   - **New Security Password**: Security password mới (tối thiểu 8 ký tự)
   - **Confirm New Security Password**: Nhập lại password mới để xác nhận

3. Click **"Update Security Password"**
4. Thông báo thành công sẽ hiện ra

---

### Phương pháp 2: Qua Laravel Tinker (Nếu quên password)

Nếu bạn **quên Security Password hiện tại**, sử dụng cách này:

```bash
cd backend
php artisan tinker
```

Trong tinker, gõ lệnh sau:

```php
App\Models\SecuritySetting::updateAdminPassword('password_moi_cua_ban');
```

Ví dụ:
```php
App\Models\SecuritySetting::updateAdminPassword('MyNewSecure123!');
```

Sau đó gõ `exit` để thoát tinker.

---

### Phương pháp 3: Qua API

**Endpoint**: `PUT /api/admin/security-password`

**Headers**:
```
Authorization: Bearer YOUR_AUTH_TOKEN
Content-Type: application/json
```

**Body**:
```json
{
  "current_password": "password_hien_tai",
  "new_password": "password_moi",
  "new_password_confirmation": "password_moi"
}
```

**Response thành công**:
```json
{
  "success": true,
  "message": "Security password updated successfully"
}
```

**Response lỗi**:
```json
{
  "success": false,
  "message": "Current security password is incorrect"
}
```

---

## 🔒 Khi nào cần Security Password?

Security Password được yêu cầu khi:

1. ✅ **Tạo user mới với role Admin**
2. ✅ **Chỉnh sửa thông tin của user Admin hiện có**
3. ✅ **Thay đổi role của user bất kỳ thành Admin**

Security Password **KHÔNG** được yêu cầu khi:

- ❌ Tạo hoặc chỉnh sửa user với role Moderator
- ❌ Xem danh sách users
- ❌ Thao tác với content/products

---

## 🎯 Best Practices (Thực hành tốt)

1. **Giữ bí mật**: Không chia sẻ security password với bất kỳ ai
2. **Khác biệt**: Security password nên khác với mật khẩu tài khoản admin
3. **Mạnh mẽ**: Sử dụng ít nhất 8 ký tự, kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
4. **Ghi chú an toàn**: Lưu password ở nơi an toàn (password manager)
5. **Thay đổi định kỳ**: Nên đổi password 3-6 tháng một lần

---

## ⚠️ Lưu ý quan trọng

- **Security Password** được lưu dưới dạng **hash** trong database (bảng `security_settings`)
- Không ai có thể xem được password gốc, kể cả admin
- Nếu quên password, chỉ có thể reset qua Laravel Tinker (Phương pháp 2)
- Chỉ **Admin role** mới có thể truy cập Security Settings

---

## 🐛 Troubleshooting

### Lỗi: "Current security password is incorrect"
**Giải pháp**: Kiểm tra lại security password hiện tại, hoặc reset qua Tinker

### Lỗi: "New security password must be at least 8 characters"
**Giải pháp**: Nhập password mới dài ít nhất 8 ký tự

### Lỗi: "Passwords do not match"
**Giải pháp**: Đảm bảo "New Security Password" và "Confirm" giống nhau

### Không thấy menu Security Settings
**Giải pháp**: Đảm bảo bạn đang đăng nhập với role **Admin** (không phải Moderator)

---

## 📋 Technical Details

### Database Structure

**Table**: `security_settings`

| Column      | Type    | Description                           |
|-------------|---------|---------------------------------------|
| id          | bigint  | Primary key                           |
| key         | varchar | Setting key ('admin_verification_password') |
| value       | text    | Hashed password                       |
| description | text    | Description of the setting            |
| created_at  | timestamp | Creation time                       |
| updated_at  | timestamp | Last update time                    |

### Code Location

- **Frontend UI**: `frontend/src/pages/admin/AdminSecuritySettings.tsx`
- **Backend Model**: `backend/app/Models/SecuritySetting.php`
- **Backend Controller**: `backend/app/Http/Controllers/Api/UserController.php` (method: `updateSecurityPassword`)
- **API Route**: `backend/routes/api.php` (line 126)
- **Sidebar Menu**: `frontend/src/components/admin/AdminSidebar.tsx` (line 125)

---

## 🎉 Hoàn thành!

Security Settings đã được tích hợp hoàn toàn vào hệ thống. Bạn có thể quản lý security password dễ dàng qua giao diện admin panel.

Nếu có vấn đề hoặc câu hỏi, hãy liên hệ với developer! 🚀




