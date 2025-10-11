# 🔍 DEBUGGING WORKFLOW - QUY TRÌNH KIỂM TRA HỆ THỐNG

## 📋 MỤC ĐÍCH
Tài liệu này định nghĩa quy trình kiểm tra có hệ thống để tránh bỏ sót lỗi cơ bản. Áp dụng cho mọi tình huống debugging, đặc biệt khi user báo lỗi liên quan đến API/Network.

---

## ⚠️ NGUYÊN TẮC VÀNG

### 1. **KHÔNG BAO GIỜ GIẢ ĐỊNH - LUÔN KIỂM TRA**
- ❌ KHÔNG nghĩ "route chắc đúng rồi"
- ❌ KHÔNG nghĩ "API client chắc có method rồi"
- ✅ PHẢI kiểm tra từng file, từng method, từng export

### 2. **KIỂM TRA THEO THỨ TỰ ƯU TIÊN**
- **Infrastructure trước** (API client, routes, middleware)
- **Business logic sau** (controller, service)
- **UI cuối cùng** (component, rendering)

### 3. **ĐỌC KỸ THÔNG BÁO CỦA USER**
- User nói "không có network" → Lỗi **TRƯỚC KHI** gửi request
- User nói "kiểm tra route/API" → Kiểm tra **cấu trúc cơ bản**
- User nói "xem kĩ từ đầu đến cuối" → Làm **systematic check**

### 4. **TRÁNH DEBUG LOG VÔ ÍCH**
- ❌ KHÔNG thêm console.log/alert trừ khi đã kiểm tra hết infrastructure
- ✅ Debug log chỉ hữu ích KHI đã chắc code CÓ CHẠY

---

## 🔄 QUY TRÌNH KIỂM TRA CHI TIẾT

### BƯỚC 1: PHÂN TÍCH TRIỆU CHỨNG (2 phút)

#### 1.1. Đọc kỹ thông báo lỗi
```
Câu hỏi cần trả lời:
- Lỗi xảy ra ở đâu? (Browser console, Network tab, Backend log)
- Lỗi xảy ra khi nào? (Component mount, button click, API call)
- Có error message cụ thể không?
- Có network request được gửi không?
```

#### 1.2. Phân loại lỗi
| Triệu chứng | Loại lỗi | Bắt đầu từ |
|-------------|----------|------------|
| "Network không có request" | Infrastructure | BƯỚC 2 |
| "API trả về 404/500" | Backend routing/logic | BƯỚC 3 |
| "Data không đúng format" | Data transformation | BƯỚC 4 |
| "UI không render" | Frontend rendering | BƯỚC 5 |
| "Function is not defined" | Import/Export | BƯỚC 2.2 |

---

### BƯỚC 2: KIỂM TRA INFRASTRUCTURE (10 phút)

#### 2.1. Kiểm tra API Client
```typescript
// File cần kiểm tra: frontend/src/services/api.ts

Checklist:
□ ApiClient class có được define không?
□ ApiClient có được export không?
  - export const apiClient = new ApiClient(...)
□ ApiClient có đầy đủ HTTP methods không?
  - async get(endpoint: string): Promise<T>
  - async post(endpoint: string, data?: unknown): Promise<T>
  - async put(endpoint: string, data?: unknown): Promise<T>
  - async delete(endpoint: string): Promise<T>
□ Các methods có gọi đúng this.request() không?
□ Có middleware nào block request không? (auth check, user_logged_out flag)
```

**LỖI THƯỜNG GẶP:**
```typescript
// ❌ SAI: Thiếu method get
class ApiClient {
  private async request() { ... }
}

// ✅ ĐÚNG: Có đầy đủ methods
class ApiClient {
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) });
  }
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  }
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
  private async request() { ... }
}
```

#### 2.2. Kiểm tra Service Layer
```typescript
// File cần kiểm tra: frontend/src/services/[feature]Service.ts

Checklist:
□ Service có import apiClient đúng không?
  - import { apiClient } from './api'
□ Các methods có gọi đúng apiClient.get/post/put/delete không?
□ Endpoint paths có đúng format không? (bắt đầu bằng /)
□ Response types có match với backend không?
□ Có export đúng các interfaces/types không?
```

**LỖI THƯỜNG GẶP:**
```typescript
// ❌ SAI: Import sai
import apiClient from './api'; // default import
apiClient.get('/endpoint'); // ERROR: apiClient.get is not a function

// ✅ ĐÚNG: Named import
import { apiClient } from './api';
apiClient.get('/endpoint'); // OK

// ❌ SAI: Endpoint thiếu /
apiClient.get('admin/settings'); // Sẽ thành: http://domain/apiadmin/settings

// ✅ ĐÚNG: Endpoint có /
apiClient.get('/admin/settings'); // Đúng: http://domain/api/admin/settings
```

#### 2.3. Kiểm tra Component Import
```typescript
// File cần kiểm tra: frontend/src/pages/[feature]/Component.tsx

Checklist:
□ Component có được import đúng không?
  - import ComponentName from './path'
□ Component có được export đúng không?
  - export default ComponentName
□ Component có được render trong parent không?
  - {activeTab === 'tab-name' && <ComponentName />}
□ Tất cả dependencies (MUI, icons, hooks) có được import không?
```

**LỖI THƯỜNG GẶP:**
```typescript
// ❌ SAI: Import component nhưng không dùng
import AdminCampaignSettings from './admin/AdminCampaignSettings';
// ... nhưng không render ở đâu cả

// ❌ SAI: Dùng component nhưng không import
{activeTab === 'settings' && <AdminSettings />} // ERROR: AdminSettings is not defined

// ✅ ĐÚNG: Import và render
import AdminCampaignSettings from './admin/AdminCampaignSettings';
{activeTab === 'campaign-settings' && <AdminCampaignSettings />}

// ❌ SAI: Thiếu import dependency
<Grow in={true}> // ERROR: Grow is not defined

// ✅ ĐÚNG: Import đầy đủ
import { Grow } from '@mui/material';
<Grow in={true}>
```

---

### BƯỚC 3: KIỂM TRA BACKEND ROUTING (5 phút)

#### 3.1. Kiểm tra Routes
```php
// File cần kiểm tra: backend/routes/api.php

Checklist:
□ Route có được define không?
  - Route::get('/admin/campaign-settings', [Controller::class, 'method']);
□ Route có đúng middleware không?
  - Route::middleware(['auth:sanctum', 'check.role:admin'])
□ Route path có đúng với frontend call không?
  - Frontend: apiClient.get('/admin/campaign-settings')
  - Backend: Route::get('/admin/campaign-settings', ...)
□ HTTP method có đúng không? (GET/POST/PUT/DELETE)
□ Controller và method có tồn tại không?
```

**LỖI THƯỜNG GẶP:**
```php
// ❌ SAI: Route path không khớp
Route::get('/campaign-settings', [Controller::class, 'index']); // Thiếu /admin
// Frontend gọi: /admin/campaign-settings → 404

// ❌ SAI: HTTP method không khớp
Route::get('/admin/campaign-settings/{id}', [Controller::class, 'update']); // Dùng GET cho update
// Frontend gọi: PUT /admin/campaign-settings/1 → 405 Method Not Allowed

// ✅ ĐÚNG: Path và method đúng
Route::get('/admin/campaign-settings', [Controller::class, 'index']);
Route::put('/admin/campaign-settings/{metric}', [Controller::class, 'update']);
```

#### 3.2. Kiểm tra Controller
```php
// File cần kiểm tra: backend/app/Http/Controllers/Api/[Feature]Controller.php

Checklist:
□ Controller class có tồn tại không?
□ Namespace có đúng không?
  - namespace App\Http\Controllers\Api;
□ Method có đúng visibility (public) không?
□ Method có return JsonResponse không?
□ Method có handle exceptions không?
```

---

### BƯỚC 4: KIỂM TRA DATA FLOW (5 phút)

#### 4.1. Kiểm tra Backend Response
```php
Checklist:
□ Response có đúng format không?
  - return response()->json(['success' => true, 'data' => ...]);
□ Data types có đúng không? (string, number, array, object)
□ Có missing fields không?
□ Timestamps có format đúng không? (ISO 8601)
```

**LỖI THƯỜNG GẶP:**
```php
// ❌ SAI: Return array thay vì object
return response()->json([
    'visitors' => [...],
    'views' => [...],
]); // Frontend expect: data.visitors, data.views

// ✅ ĐÚNG: Wrap trong data
return response()->json([
    'success' => true,
    'data' => [
        'visitors' => [...],
        'views' => [...],
    ]
]);

// ❌ SAI: String thay vì number
'current_value' => "100", // "100" is string

// ✅ ĐÚNG: Cast to number
'current_value' => (float) $currentValue,
```

#### 4.2. Kiểm tra Frontend Data Transformation
```typescript
Checklist:
□ Response có được unwrap đúng không?
  - const data = response.data; (nếu backend wrap trong 'data')
□ Types có match với backend không?
□ Có null/undefined checks không?
□ Date strings có được parse đúng không?
```

---

### BƯỚC 5: KIỂM TRA UI/RENDERING (5 phút)

#### 5.1. Kiểm tra Component Rendering
```typescript
Checklist:
□ Component có return JSX không?
□ Conditional rendering có đúng syntax không?
  - {condition && <Component />} // ĐÚNG
  - {(() => <Component />)()} // SAI - IIFE không cần thiết
□ Props có được pass đúng không?
□ Event handlers có được bind đúng không?
```

**LỖI THƯỜNG GẶP:**
```typescript
// ❌ SAI: IIFE trong JSX
{activeTab === 'settings' && (() => {
  return <AdminSettings />;
})()}

// ✅ ĐÚNG: Conditional rendering thông thường
{activeTab === 'settings' && <AdminSettings />}

// ❌ SAI: Sai props cho Lucide icons
<Users className="h-8 w-8 text-white" /> // Lucide không dùng className

// ✅ ĐÚNG: Dùng size và color
<Users size={32} color="white" />

// ❌ SAI: Absolute position without relative parent
<Card>
  <Box sx={{ position: 'absolute' }}> // Không có parent relative
</Card>

// ✅ ĐÚNG: Parent có position relative
<Card sx={{ position: 'relative' }}>
  <Box sx={{ position: 'absolute' }}>
</Card>
```

#### 5.2. Kiểm tra State Management
```typescript
Checklist:
□ useState có được initialize đúng không?
□ useEffect dependencies có đầy đủ không?
□ State updates có trigger re-render không?
□ Có race conditions không? (multiple async calls)
```

---

## 📊 DEBUGGING DECISION TREE

```
Lỗi báo: "No network request"
│
├─→ Kiểm tra Console có lỗi JS không?
│   ├─→ CÓ: "X is not defined"
│   │   └─→ Check imports/exports (BƯỚC 2.2, 2.3)
│   ├─→ CÓ: "X is not a function"
│   │   └─→ Check API Client methods (BƯỚC 2.1)
│   └─→ KHÔNG: Lỗi silent
│       └─→ Check middleware blocking (BƯỚC 2.1)
│
├─→ Kiểm tra Component có render không?
│   ├─→ KHÔNG: Check component import/render (BƯỚC 2.3)
│   └─→ CÓ: Check API call logic (BƯỚC 2.2)
│
└─→ Kiểm tra useEffect có trigger không?
    ├─→ KHÔNG: Check dependencies array
    └─→ CÓ: Check API client methods (BƯỚC 2.1)
```

```
Lỗi báo: "API returns 404/500"
│
├─→ Check Network tab: Request được gửi không?
│   ├─→ CÓ: Check request URL
│   │   ├─→ URL đúng: Check backend route (BƯỚC 3.1)
│   │   └─→ URL sai: Check service endpoint (BƯỚC 2.2)
│   └─→ KHÔNG: Quay lại "No network request" flow
│
├─→ Check Backend Log
│   ├─→ 404: Route not found → Check routes (BƯỚC 3.1)
│   ├─→ 500: Server error → Check controller (BƯỚC 3.2)
│   └─→ 401/403: Auth error → Check middleware
│
└─→ Check Request Method
    └─→ Method đúng với route không? (BƯỚC 3.1)
```

```
Lỗi báo: "Data shows 0 or wrong values"
│
├─→ Check Network tab: Response có data không?
│   ├─→ KHÔNG: Check backend query (BƯỚC 3.2)
│   └─→ CÓ: Check data structure (BƯỚC 4.1)
│
├─→ Check Response format
│   ├─→ { success, data: {...} } → Check unwrap (BƯỚC 4.2)
│   └─→ { visitors, views, ... } → Check direct access
│
└─→ Check Data types
    ├─→ String vs Number → Cast in backend (BƯỚC 4.1)
    └─→ Null vs Undefined → Add null checks (BƯỚC 4.2)
```

---

## 🛠️ TOOLS & COMMANDS

### Frontend Debugging

#### 1. Kiểm tra file có được build không
```bash
# Trong frontend folder
npm run build

# Kiểm tra file output
ls dist/assets/*.js
```

#### 2. Kiểm tra imports/exports
```bash
# Tìm export của apiClient
grep -n "export.*apiClient" frontend/src/services/api.ts

# Tìm import của apiClient
grep -rn "import.*apiClient" frontend/src/services/

# Tìm method get/post/put/delete
grep -n "async get\|async post\|async put\|async delete" frontend/src/services/api.ts
```

#### 3. Kiểm tra component imports
```bash
# Tìm component được import
grep -n "import.*AdminCampaignSettings" frontend/src/pages/AdminDashboard.tsx

# Tìm component được render
grep -n "AdminCampaignSettings" frontend/src/pages/AdminDashboard.tsx

# Tìm tất cả MUI imports
grep -n "from '@mui/material'" frontend/src/pages/admin/AdminCampaignSettings.tsx
```

### Backend Debugging

#### 1. Kiểm tra routes
```bash
# Tìm route definition
grep -n "campaign-settings" backend/routes/api.php

# Kiểm tra middleware
grep -n "auth:sanctum" backend/routes/api.php
```

#### 2. Kiểm tra controller
```bash
# Tìm controller method
grep -n "public function index\|public function update" backend/app/Http/Controllers/Api/CampaignSettingController.php

# Kiểm tra return type
grep -n "JsonResponse" backend/app/Http/Controllers/Api/CampaignSettingController.php
```

#### 3. Kiểm tra model
```bash
# Tìm model methods
grep -n "public static function\|public function" backend/app/Models/CampaignSetting.php

# Kiểm tra casts
grep -n "protected \$casts" backend/app/Models/CampaignSetting.php
```

---

## ✅ SYSTEMATIC CHECK TEMPLATE

Khi user nói "kiểm tra kĩ từ đầu đến cuối", làm theo template này:

### Template: API Feature Debugging

```markdown
## FEATURE: [Tên feature, VD: Campaign Settings]

### 1. INFRASTRUCTURE CHECK ✓/✗
- [ ] **API Client** (frontend/src/services/api.ts)
  - [ ] Có export `apiClient`
  - [ ] Có method `get<T>(endpoint: string)`
  - [ ] Có method `post<T>(endpoint: string, data?: unknown)`
  - [ ] Có method `put<T>(endpoint: string, data?: unknown)`
  - [ ] Có method `delete<T>(endpoint: string)`
  - [ ] Không có middleware block (user_logged_out, etc)

- [ ] **Service Layer** (frontend/src/services/[feature]Service.ts)
  - [ ] Import đúng: `import { apiClient } from './api'`
  - [ ] Endpoints có `/` prefix
  - [ ] Methods gọi đúng `apiClient.get/post/put/delete`
  - [ ] Response types có interface definition
  - [ ] Export đúng các interfaces

- [ ] **Component** (frontend/src/pages/[feature]/Component.tsx)
  - [ ] Import service: `import { [feature]Service } from '../../services/...'`
  - [ ] Import tất cả MUI components cần dùng
  - [ ] Import tất cả icons cần dùng
  - [ ] Export component: `export default ComponentName`

- [ ] **Parent Component** (frontend/src/pages/ParentComponent.tsx)
  - [ ] Import component
  - [ ] Render component với đúng condition
  - [ ] Không dùng IIFE vô nghĩa

### 2. BACKEND CHECK ✓/✗
- [ ] **Routes** (backend/routes/api.php)
  - [ ] GET /admin/[feature] → index
  - [ ] GET /admin/[feature]/{id} → show
  - [ ] POST /admin/[feature] → store
  - [ ] PUT /admin/[feature]/{id} → update
  - [ ] DELETE /admin/[feature]/{id} → destroy
  - [ ] Có middleware: auth:sanctum, check.role

- [ ] **Controller** (backend/app/Http/Controllers/Api/[Feature]Controller.php)
  - [ ] Namespace đúng
  - [ ] Methods public
  - [ ] Return JsonResponse
  - [ ] Handle exceptions
  - [ ] Response format: { success, data }

- [ ] **Model** (backend/app/Models/[Feature].php)
  - [ ] Có $fillable hoặc $guarded
  - [ ] Có $casts cho types
  - [ ] Có relationships (nếu cần)
  - [ ] Có helper methods (nếu cần)

### 3. DATA FLOW CHECK ✓/✗
- [ ] **Backend Response**
  - [ ] Format: `{ success: true, data: {...} }`
  - [ ] Data types đúng (number không phải string)
  - [ ] Không có missing fields
  - [ ] Timestamps format ISO 8601

- [ ] **Frontend Processing**
  - [ ] Unwrap response.data (nếu cần)
  - [ ] Cast types đúng
  - [ ] Handle null/undefined
  - [ ] Parse dates (nếu cần)

### 4. UI/RENDERING CHECK ✓/✗
- [ ] **Component Structure**
  - [ ] Return JSX
  - [ ] Conditional rendering đúng syntax
  - [ ] Props đúng type
  - [ ] Event handlers đúng

- [ ] **State Management**
  - [ ] useState initialize đúng
  - [ ] useEffect dependencies đầy đủ
  - [ ] State updates trigger re-render
  - [ ] Không có race conditions

### 5. FINAL VERIFICATION ✓/✗
- [ ] **Build thành công**
  - [ ] `npm run build` không lỗi
  - [ ] `frontend/dist/*` có files mới

- [ ] **Upload files**
  - [ ] Frontend: `.tsx, .ts` files
  - [ ] Backend: `.php` files
  - [ ] Build: `dist/*` → `frontend_public/`

- [ ] **Test trên server**
  - [ ] Hard refresh (Ctrl+Shift+R)
  - [ ] Check Console không có lỗi
  - [ ] Check Network có requests
  - [ ] Check UI hiển thị đúng data
```

---

## 🚨 COMMON MISTAKES & SOLUTIONS

### 1. "X is not a function"
```typescript
// Nguyên nhân thường gặp:
// 1. Thiếu method trong class
// 2. Import sai (default vs named)
// 3. Export sai

// Solution:
1. Check class có method không: grep -n "async get" api.ts
2. Check export: grep -n "export.*apiClient" api.ts
3. Check import: grep -n "import.*apiClient" [service].ts
```

### 2. "X is not defined"
```typescript
// Nguyên nhân thường gặp:
// 1. Thiếu import
// 2. Import sai tên
// 3. Component không được render

// Solution:
1. Check import: grep -n "import.*ComponentName"
2. Check render: grep -n "<ComponentName"
3. Check export: grep -n "export.*ComponentName"
```

### 3. "No network request"
```typescript
// Nguyên nhân thường gặp:
// 1. API call bị block trước khi gửi
// 2. useEffect không trigger
// 3. Lỗi JS khiến code không chạy đến API call

// Solution:
1. Check middleware blocking trong api.ts
2. Check useEffect dependencies
3. Check Console có lỗi JS không
```

### 4. "404 Not Found"
```php
// Nguyên nhân thường gặp:
// 1. Route path không khớp với frontend
// 2. Route không có trong routes/api.php
// 3. Controller/method không tồn tại

// Solution:
1. Check frontend endpoint: grep -n "apiClient.get" service.ts
2. Check backend route: grep -n "Route::get" api.php
3. So sánh: Frontend /admin/settings vs Backend /admin/settings
```

### 5. "500 Internal Server Error"
```php
// Nguyên nhân thường gặp:
// 1. Controller method lỗi
// 2. Query database lỗi
// 3. Missing dependency

// Solution:
1. Check backend log: storage/logs/laravel.log
2. Check controller có try-catch
3. Check model relationships
```

---

## 📝 WORKFLOW SUMMARY

```
User báo lỗi
    ↓
[1] Đọc kỹ triệu chứng (2 min)
    ↓
[2] Kiểm tra API Client (3 min)
    ├─ Có methods get/post/put/delete?
    ├─ Export đúng?
    └─ Không có middleware block?
    ↓
[3] Kiểm tra Service Layer (2 min)
    ├─ Import đúng apiClient?
    ├─ Endpoints đúng format?
    └─ Methods gọi đúng?
    ↓
[4] Kiểm tra Component (2 min)
    ├─ Import đủ dependencies?
    ├─ Export đúng?
    └─ Được render đúng?
    ↓
[5] Kiểm tra Backend Routes (2 min)
    ├─ Route có định nghĩa?
    ├─ Path khớp với frontend?
    └─ Middleware đúng?
    ↓
[6] Kiểm tra Controller (2 min)
    ├─ Method tồn tại?
    ├─ Return JsonResponse?
    └─ Handle exceptions?
    ↓
[7] Kiểm tra Data Flow (2 min)
    ├─ Response format đúng?
    ├─ Data types đúng?
    └─ Frontend transform đúng?
    ↓
[8] Test & Verify (3 min)
    ├─ Build thành công?
    ├─ Upload files?
    └─ Test trên server?
```

**TỔNG THỜI GIAN: ~15-20 phút cho systematic check hoàn chỉnh**

---

## 🎯 KẾT LUẬN

### Khi nào dùng workflow này?
- ✅ User báo "không có network request"
- ✅ User nói "kiểm tra kĩ từ đầu đến cuối"
- ✅ User báo "xem lại route/API/controller"
- ✅ Lỗi liên quan đến "X is not defined/function"
- ✅ Feature mới hoàn toàn không hoạt động

### Khi nào KHÔNG cần workflow đầy đủ?
- ⚠️ Lỗi UI nhỏ (styling, layout)
- ⚠️ Lỗi logic đơn giản (if/else, calculation)
- ⚠️ Lỗi đã có error message rõ ràng

### Nguyên tắc cuối cùng:
> **"Kiểm tra Infrastructure trước, Debug Logic sau"**
> 
> Nếu API client không có method `get()`, thì dù có thêm 1000 dòng console.log cũng vô ích.

---

**Document Version:** 1.0  
**Created:** 2025-10-11  
**Last Updated:** 2025-10-11  
**Author:** AI Assistant based on real debugging experience

