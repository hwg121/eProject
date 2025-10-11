# 🔍 QUY TRÌNH XỬ LÝ LỖI HỆ THỐNG (SYSTEMATIC DEBUGGING WORKFLOW)

## 📋 MỤC LỤC
1. [Nguyên tắc chung](#nguyên-tắc-chung)
2. [Phân loại lỗi](#phân-loại-lỗi)
3. [Quy trình kiểm tra từng bước](#quy-trình-kiểm-tra-từng-bước)
4. [Checklist theo loại lỗi](#checklist-theo-loại-lỗi)
5. [Công cụ debug](#công-cụ-debug)
6. [Best Practices](#best-practices)

---

## 🎯 NGUYÊN TẮC CHUNG

### ❌ KHÔNG BAO GIỜ:
- Không đoán mò hoặc thử may mắn
- Không sửa code mà chưa hiểu rõ nguyên nhân
- Không bỏ qua console errors/warnings
- Không commit code chưa test kỹ
- Không tự ý sửa code mà không hỏi khi không chắc chắn

### ✅ LUÔN LUÔN:
- Đọc kỹ error message đầy đủ
- Kiểm tra toàn bộ data flow từ đầu đến cuối
- Verify ở tất cả các layer: Database → Backend → Frontend
- Test edge cases: null, undefined, empty string, 0
- Document những gì đã thử và kết quả

---

## 🏷️ PHÂN LOẠI LỖI

### 1️⃣ **Lỗi Frontend (Browser Console)**
```
Dấu hiệu:
- Console có error màu đỏ
- Component không render
- Button/Form không hoạt động
- Data không hiển thị đúng
```

### 2️⃣ **Lỗi API (Network Tab)**
```
Dấu hiệu:
- Status 400/401/403/404/500
- Network request failed
- Response data sai format
- CORS errors
```

### 3️⃣ **Lỗi Backend (Laravel)**
```
Dấu hiệu:
- 500 Internal Server Error
- Validation failed
- Database query errors
- Missing route/controller
```

### 4️⃣ **Lỗi Data Flow**
```
Dấu hiệu:
- Data hiển thị sai
- Field bị null/undefined
- Transform function sai
- Type mismatch
```

---

## 🔧 QUY TRÌNH KIỂM TRA TỪNG BƯỚC

### BƯỚC 1: XÁC ĐỊNH VẤN ĐỀ

#### 1.1 Thu thập thông tin
- [ ] Đọc error message đầy đủ (toàn bộ stack trace)
- [ ] Xác định trang/component bị lỗi
- [ ] Xác định hành động nào gây ra lỗi (click button, load page, submit form)
- [ ] Check Browser Console (F12 → Console tab)
- [ ] Check Network Tab (F12 → Network tab)

#### 1.2 Ghi chép chi tiết
```markdown
**Error Message:**
[Copy nguyên văn error từ console]

**Steps to Reproduce:**
1. Vào trang X
2. Click button Y
3. Error xuất hiện

**Expected Behavior:**
[Mô tả hành vi mong muốn]

**Actual Behavior:**
[Mô tả hành vi thực tế]
```

---

### BƯỚC 2: KIỂM TRA FRONTEND

#### 2.1 Console Errors
```typescript
// Check các lỗi thường gặp:

// ❌ TypeError: Cannot read property 'X' of undefined
// ➜ Biến chưa được khởi tạo hoặc null
// ➜ Kiểm tra: optional chaining (?.),  default values (||)

// ❌ X is not a function
// ➜ Biến không phải là function hoặc undefined
// ➜ Kiểm tra: import statement, function definition

// ❌ X.toFixed is not a function
// ➜ Giá trị không phải là number
// ➜ Fix: Number(X) || 0

// ❌ Cannot access 'X' before initialization
// ➜ Biến được dùng trước khi declare
// ➜ Fix: Di chuyển declaration lên trước

// ❌ Grow is not defined
// ➜ Thiếu import
// ➜ Fix: import { Grow } from '@mui/material'
```

#### 2.2 Component Render Issues
```typescript
// Checklist:
- [ ] Component có được import đúng không?
- [ ] Props có được pass đúng type không?
- [ ] State initialization có đúng không?
- [ ] useEffect dependencies có đầy đủ không?
- [ ] Conditional rendering logic có đúng không?
```

#### 2.3 Data Display Issues
```typescript
// Khi data không hiển thị hoặc hiển thị sai:

// 1. Check data structure
console.log('Raw data:', data);

// 2. Check transform function
console.log('Transformed data:', transformedData);

// 3. Check field mapping
// Backend: { is_featured: true }
// Transform: { featured: item.is_featured } ✅
// Display: item.featured ✅ (NOT item.is_featured ❌)
```

---

### BƯỚC 3: KIỂM TRA API & NETWORK

#### 3.1 Network Tab Analysis
```bash
# Mở Network Tab (F12 → Network)
# Filter by: XHR hoặc Fetch

# Check từng request:
1. Request URL - Có đúng endpoint không?
2. Request Method - GET/POST/PUT/DELETE đúng không?
3. Request Headers - Có Authorization token không?
4. Request Payload - Data gửi lên có đúng format không?
5. Response Status - 200/201 OK hay 4xx/5xx error?
6. Response Data - Có đúng format mong đợi không?
```

#### 3.2 API Error Response Analysis
```typescript
// Status 400 - Bad Request
// ➜ Request data sai format hoặc thiếu field required
// ➜ Check: validation rules, request payload

// Status 401 - Unauthorized
// ➜ Chưa login hoặc token hết hạn
// ➜ Check: localStorage auth_token, Sanctum middleware

// Status 403 - Forbidden
// ➜ Không có quyền truy cập
// ➜ Check: user role, permissions

// Status 404 - Not Found
// ➜ Route không tồn tại hoặc resource không tìm thấy
// ➜ Check: API routes, resource ID

// Status 422 - Unprocessable Entity
// ➜ Validation failed
// ➜ Check: validation error message trong response

// Status 500 - Internal Server Error
// ➜ Backend code lỗi
// ➜ Check: Laravel logs, controller code
```

---

### BƯỚC 4: KIỂM TRA BACKEND

#### 4.1 Route Check
```php
// File: backend/routes/api.php

// Checklist:
- [ ] Route có được define không?
- [ ] HTTP method đúng không? (GET/POST/PUT/DELETE)
- [ ] Middleware đúng không? (auth:sanctum, admin)
- [ ] Controller method tồn tại không?

// Example:
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
});
```

#### 4.2 Controller Check
```php
// Checklist:
- [ ] Method tồn tại trong controller không?
- [ ] Validation rules đúng không?
- [ ] Try-catch có bao lỗi không?
- [ ] Response format đúng không?

// Common Issues:

// ❌ Issue: Status validation sai
'status' => 'required|in:draft,published'  // Thiếu 'archived'

// ✅ Fix:
'status' => 'required|in:published,archived'  // Đúng enum

// ❌ Issue: Missing field in validation
'title' => 'required',
'body' => 'required',
// Missing: 'slug', 'status', etc.

// ✅ Fix: Add all required fields
```

#### 4.3 Resource Check
```php
// File: backend/app/Http/Resources/XxxResource.php

// Checklist:
- [ ] Tất cả fields cần thiết có được return không?
- [ ] Field names có match với frontend không?
- [ ] Data types có đúng không? (string/int/bool)
- [ ] Relationships có được load không?

// Example Issues:

// ❌ Missing field
return [
    'id' => $this->id,
    'title' => $this->title,
    // Missing 'slug' ❌
];

// ✅ Complete
return [
    'id' => $this->id,
    'title' => $this->title,
    'slug' => $this->slug, // ✅
    'views' => $this->views ?? 0,
];
```

#### 4.4 Model Check
```php
// File: backend/app/Models/Xxx.php

// Checklist:
- [ ] $fillable có đầy đủ fields không?
- [ ] $casts có đúng data types không?
- [ ] Relationships có được define không?

// Example:
protected $fillable = [
    'title',
    'slug',
    'status',
    'is_featured',
];

protected $casts = [
    'is_featured' => 'boolean',
    'views' => 'integer',
    'rating' => 'decimal:2',
];
```

---

### BƯỚC 5: KIỂM TRA DATA FLOW

#### 5.1 Complete Data Flow Check
```
Database (MySQL)
    ↓
Model ($fillable, $casts)
    ↓
Controller (query, validation)
    ↓
Resource (field mapping, formatting)
    ↓
API Response (JSON)
    ↓
Frontend API Call (axios/fetch)
    ↓
Transform Function (data mapping)
    ↓
Component State (useState)
    ↓
Display (JSX/TSX)
```

#### 5.2 Field Mapping Example
```typescript
// Example: Featured field

// ✅ CORRECT Flow:
Database:           is_featured (tinyint)
Model $casts:       'is_featured' => 'boolean'
Resource:           'is_featured' => (bool) $this->is_featured
API Response:       { "is_featured": true }
Transform:          featured: item.is_featured  // Map to 'featured'
Component:          product.featured  // Use 'featured'
Display:            {product.featured && <Badge />}

// ❌ COMMON MISTAKE:
Transform:          // Missing mapping ❌
Component:          product.is_featured  // Frontend expects 'featured'
Result:             Always undefined/false ❌
```

---

## 📝 CHECKLIST THEO LOẠI LỖI

### 🔴 Khi gặp "X is not defined" hoặc "Cannot read property"

```typescript
STEP 1: Check import statements
- [ ] Component/function có được import không?
- [ ] Import path đúng không?
- [ ] Export/import syntax đúng không?

STEP 2: Check variable initialization
- [ ] Biến có được declare trước khi dùng không?
- [ ] Props có được pass từ parent component không?
- [ ] State có default value không?

STEP 3: Check data availability
- [ ] API call đã hoàn thành chưa? (loading state)
- [ ] Data có null/undefined không? (optional chaining)
- [ ] Array có empty không? (check length)

FIX PATTERNS:
// ❌ item.slug
// ✅ item?.slug || item.id
// ✅ item.slug ?? 'default-slug'

// ❌ items.map(...)
// ✅ (items || []).map(...)
// ✅ Array.isArray(items) ? items.map(...) : []
```

### 🔴 Khi gặp "X.toFixed is not a function"

```typescript
ROOT CAUSE: API trả về string hoặc null thay vì number

STEP 1: Check API response
Response: { "rating": "4.5" }  // String ❌
Response: { "rating": null }   // Null ❌
Response: { "rating": 4.5 }    // Number ✅

STEP 2: Check Resource casting
// Backend Resource
'rating' => $this->rating  // ❌ Might be string
'rating' => (float) $this->rating  // ✅ Cast to float

STEP 3: Check Model $casts
protected $casts = [
    'rating' => 'decimal:2',  // ✅ Ensures float
];

STEP 4: Add Number() wrapper in frontend
// ❌ rating.toFixed(1)
// ✅ (Number(rating) || 0).toFixed(1)

COMPLETE FIX:
const [currentRating, setCurrentRating] = useState(Number(rating) || 0);
setCurrentRating(Number(response.average_rating) || 0);
display: {(Number(currentRating) || 0).toFixed(1)}
```

### 🔴 Khi gặp HTTP 500 Error

```typescript
STEP 1: Check error message
Network Tab → Response Tab → Xem chi tiết error

STEP 2: Common causes of 500:
- [ ] Validation rule sai (missing enum value)
- [ ] Missing required field in request
- [ ] Database constraint violation
- [ ] Code syntax error in controller
- [ ] Missing relationship/method

STEP 3: Check validation rules
// ❌ Status validation thiếu 'archived'
'status' => 'required|in:draft,published'

// ✅ Fix
'status' => 'required|in:published,archived'

STEP 4: Check request payload
// Ensure frontend sends correct data
console.log('Request data:', requestData);

STEP 5: Check try-catch in controller
try {
    // Your code
} catch (\Exception $e) {
    return response()->json([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ], 500);
}
```

### 🔴 Khi data không hiển thị hoặc hiển thị sai

```typescript
STEP 1: Check API response
- [ ] Open Network Tab
- [ ] Find the API call
- [ ] Check Response data structure
- [ ] Verify field names and values

STEP 2: Check transform function
- [ ] Does transform function map all needed fields?
- [ ] Field names match between backend and frontend?
- [ ] Data types handled correctly?

STEP 3: Common field mapping issues

// ❌ WRONG: Backend uses different name
Backend: { is_featured: true }
Frontend: item.featured  // undefined ❌

// ✅ FIX: Add transform mapping
transform: { featured: item.is_featured }
Frontend: item.featured  // true ✅

// ❌ WRONG: Missing field in Resource
Backend Resource: return ['id', 'title'];  // Missing 'slug'
Frontend: item.slug  // undefined ❌

// ✅ FIX: Add field to Resource
Backend Resource: return ['id', 'title', 'slug'];
Frontend: item.slug  // 'article-title' ✅

STEP 4: Check component props/state
- [ ] Data được pass đúng vào component?
- [ ] State được update sau khi API call?
- [ ] useEffect dependencies đầy đủ?
```

### 🔴 Khi URL routing sai (dùng ID thay vì slug)

```typescript
COMPLETE CHECK:

STEP 1: Check database
- [ ] Table có column 'slug' không?
- [ ] Slug có giá trị không? (không null)

STEP 2: Check Model
- [ ] 'slug' trong $fillable?
protected $fillable = ['title', 'slug', ...];

STEP 3: Check Resource
- [ ] Resource return 'slug' field?
return [
    'id' => $this->id,
    'slug' => $this->slug,  // ✅ Must have this
];

STEP 4: Check Transform Function
- [ ] Transform function map 'slug'?
export const transformArticleToContentItem = (article: any) => ({
    id: article.id,
    slug: article.slug,  // ✅ Must have this
});

STEP 5: Check Component
- [ ] Component uses slug for URL?
// ❌ window.open(`/article/${item.id}`)
// ✅ window.open(`/article/${item.slug || item.id}`)

VERIFICATION:
Console.log at each step:
1. console.log('API response:', response);
2. console.log('Transformed:', transformed);
3. console.log('Item slug:', item.slug);
```

---

## 🛠️ CÔNG CỤ DEBUG

### Browser DevTools

```typescript
// 1. Console Logging
console.log('Data:', data);
console.table(arrayData);  // Nice table format
console.dir(objectData);   // Expandable object

// 2. Debugger
debugger;  // Code sẽ pause ở đây

// 3. Network Tab
// → Inspect request/response
// → Copy as cURL
// → Copy response

// 4. React DevTools
// → Check component props
// → Check component state
// → Check component tree

// 5. Sources Tab
// → Set breakpoints
// → Step through code
// → Watch variables
```

### Code Debug Patterns

```typescript
// Pattern 1: Verify data at each step
console.log('1. API Response:', response);
const transformed = transform(response);
console.log('2. Transformed:', transformed);
const filtered = transformed.filter(...);
console.log('3. Filtered:', filtered);

// Pattern 2: Check null/undefined
console.log('Is null?', data === null);
console.log('Is undefined?', data === undefined);
console.log('Is empty?', data === '');
console.log('Type:', typeof data);

// Pattern 3: Verify function calls
const handleClick = (item) => {
    console.log('handleClick called with:', item);
    console.log('Item slug:', item.slug);
    console.log('Item id:', item.id);
    // ... rest of code
};

// Pattern 4: Check state updates
useEffect(() => {
    console.log('State updated:', stateValue);
}, [stateValue]);
```

---

## ✅ BEST PRACTICES

### 1. Error Prevention

```typescript
// ✅ Always use optional chaining
const name = user?.profile?.name;

// ✅ Always provide default values
const items = data?.items || [];
const count = data?.count ?? 0;

// ✅ Always check before operations
if (Array.isArray(items)) {
    items.map(...);
}

// ✅ Always wrap numbers for math operations
const result = (Number(value) || 0).toFixed(2);

// ✅ Always validate before API calls
if (!formData.title.trim()) {
    showToast('Title is required', 'error');
    return;
}
```

### 2. Type Safety

```typescript
// ✅ Define interfaces
interface Product {
    id: string;
    title: string;
    slug?: string;  // Optional fields marked with ?
    price: number | null;  // Union types for nullable
}

// ✅ Use type guards
const isValidProduct = (item: any): item is Product => {
    return item && typeof item.id === 'string' && typeof item.title === 'string';
};

// ✅ Cast when necessary
const numericValue = Number(apiResponse.value) || 0;
const stringValue = String(apiResponse.value || '');
const boolValue = Boolean(apiResponse.value);
```

### 3. Error Handling

```typescript
// ✅ Always use try-catch for async operations
try {
    const response = await api.get('/endpoint');
    // Handle success
} catch (error) {
    console.error('API Error:', error);
    showToast('Failed to load data', 'error');
}

// ✅ Provide meaningful error messages
catch (error) {
    if (error.response?.status === 401) {
        showToast('Please login to continue', 'warning');
    } else if (error.response?.status === 500) {
        showToast('Server error. Please try again later', 'error');
    } else {
        showToast(error.message || 'An error occurred', 'error');
    }
}
```

### 4. Testing Before Commit

```typescript
CHECKLIST BEFORE COMMIT:
- [ ] Code builds successfully (npm run build)
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] Tested main functionality
- [ ] Tested edge cases (null, empty, 0)
- [ ] Tested on different data sets
- [ ] Checked Network tab for API calls
- [ ] Verified data flow end-to-end
- [ ] Checked mobile responsive (if applicable)
```

---

## 📊 DEBUG WORKFLOW DIAGRAM

```
┌─────────────────────────────────────────────┐
│         PHÁT HIỆN LỖI (Error Detected)      │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  THU THẬP THÔNG TIN (Gather Information)    │
│  - Console errors                            │
│  - Network requests                          │
│  - Steps to reproduce                        │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│   PHÂN LOẠI LỗI (Classify Error)            │
│   Frontend? API? Backend? Data Flow?        │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┬──────────────┐
        │                     │              │
        ▼                     ▼              ▼
┌──────────────┐    ┌──────────────┐   ┌─────────────┐
│  FRONTEND    │    │   API/NETWORK │   │  BACKEND    │
│  - Console   │    │   - Status    │   │  - Route    │
│  - Component │    │   - Response  │   │  - Ctrl     │
│  - State     │    │   - Headers   │   │  - Resource │
└──────┬───────┘    └──────┬───────┘   └──────┬──────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                           ▼
           ┌───────────────────────────────┐
           │   TÌM NGUYÊN NHÂN GỐC RỄ      │
           │   (Find Root Cause)            │
           │   - Check data flow            │
           │   - Verify each layer          │
           │   - Test hypotheses            │
           └───────────────┬───────────────┘
                           │
                           ▼
           ┌───────────────────────────────┐
           │   IMPLEMENT FIX                │
           │   - Code changes               │
           │   - Add safety checks          │
           │   - Update types               │
           └───────────────┬───────────────┘
                           │
                           ▼
           ┌───────────────────────────────┐
           │   VERIFY FIX                   │
           │   - Test main scenario         │
           │   - Test edge cases            │
           │   - Check related features     │
           └───────────────┬───────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
            Fixed? ─┤  ✅ Yes     │  ❌ No
                    │             │
                    ▼             └──┐
           ┌─────────────┐           │
           │   COMMIT    │           │
           │   & PUSH    │           │
           └─────────────┘           │
                                     │
                    ┌────────────────┘
                    │
                    ▼
           ┌─────────────────────┐
           │  RE-ANALYZE & TRY   │
           │  DIFFERENT APPROACH │
           └──────────┬──────────┘
                      │
                      └──── Back to "TÌM NGUYÊN NHÂN"
```

---

## 🎓 LESSONS LEARNED (Real Examples)

### Example 1: Featured Count Showing 0

**Problem:**
```typescript
products.filter(p => p.is_featured).length  // Always 0 ❌
```

**Root Cause Analysis:**
```
1. Checked Database: is_featured = 1 ✅
2. Checked Model: $casts['is_featured'] = 'boolean' ✅
3. Checked Resource: 'is_featured' => (bool) $this->is_featured ✅
4. Checked Transform: featured: item.is_featured ✅  // Maps to 'featured'
5. Checked Component: p.is_featured ❌  // Should use 'featured'!
```

**Solution:**
```typescript
// ✅ Use correct field name
products.filter(p => p.featured || p.is_featured).length

// ✅ Or update transform to keep 'is_featured' name
// ✅ Or update component to use 'featured'
```

**Lesson:** Always verify field names through ENTIRE data flow!

---

### Example 2: toFixed Error on Rating

**Problem:**
```typescript
currentRating.toFixed(1)  // Error: toFixed is not a function
```

**Root Cause Analysis:**
```
1. Checked API Response: { "rating": "4.5" }  // String! ❌
2. Checked useState: useState(rating)  // Could be string
3. Checked setState: setRating(response.rating)  // No casting
```

**Solution:**
```typescript
// ✅ Wrap with Number() everywhere
const [currentRating, setCurrentRating] = useState(Number(rating) || 0);
setCurrentRating(Number(response.rating) || 0);
display: {(Number(currentRating) || 0).toFixed(1)}
```

**Lesson:** Always cast to Number() before using math methods!

---

### Example 3: Top Content Using ID Instead of Slug

**Problem:**
```typescript
window.open(`/video/${item.slug || item.id}`)  // Uses ID ❌
```

**Root Cause Analysis:**
```
1. Checked Component: item.slug is undefined ❌
2. Checked Transform: Has slug: article.slug ✅
3. Checked Resource: ArticleResource has 'slug' ✅
4. Checked Resource: VideoResource missing 'slug'! ❌  // FOUND IT!
```

**Solution:**
```php
// ✅ Add slug to VideoResource
return [
    'id' => $this->id,
    'title' => $this->title,
    'slug' => $this->slug,  // Add this
];
```

**Lesson:** Check ALL Resources, not just one! Different content types may have different Resources.

---

### Example 4: 500 Error When Updating Content

**Problem:**
```
PUT /api/articles/1  → 500 Internal Server Error
```

**Root Cause Analysis:**
```
1. Checked Request Payload: { "status": "archived" } ✅
2. Checked Validation Rule: 'status' => 'in:draft,published' ❌
   // Validation fails because 'archived' not in enum!
```

**Solution:**
```php
// ✅ Update validation to include 'archived'
'status' => 'required|in:published,archived'
```

**Lesson:** Validation rules must match actual enum values in database and frontend!

---

## 🚀 QUICK REFERENCE

### When Error Occurs:
1. ✅ **READ** the full error message
2. ✅ **CHECK** Browser Console
3. ✅ **CHECK** Network Tab
4. ✅ **VERIFY** data flow from backend to frontend
5. ✅ **TEST** the fix thoroughly before committing

### Before Committing:
1. ✅ Code builds successfully
2. ✅ No console errors
3. ✅ Tested main functionality
4. ✅ Tested edge cases
5. ✅ Verified related features still work

### Golden Rules:
- 🎯 Always verify the COMPLETE data flow
- 🎯 Never assume - always check
- 🎯 Test edge cases: null, undefined, '', 0
- 🎯 Ask if uncertain
- 🎯 Document what you tried

---

## 📞 NEED HELP?

**If stuck after trying everything:**
1. Document what you've tried
2. List what you've checked
3. Share error messages and logs
4. Ask specific questions

**Remember:**
- ❌ "It doesn't work" - Too vague
- ✅ "Feature X shows error Y when I do Z. I've checked A, B, C. Here's the console log: ..." - Clear and detailed!

---

**Last Updated:** 2025-01-11
**Version:** 2.0
**Status:** ✅ Production Ready
