# 🔧 CORS Troubleshooting Guide

## ปัญหา CORS Error ที่พบ

```
Access to fetch at 'https://thepapers.in/loginsha3/checkusersha3.php' 
from origin 'null' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
The value of the 'Access-Control-Allow-Origin' header in the response 
must not be the wildcard '*' when the request's credentials mode is 'include'.
```

---

## 🎯 สาเหตุ

เมื่อใช้ `credentials: 'include'` ใน fetch request:
- ❌ **ห้ามใช้** `Access-Control-Allow-Origin: *` (wildcard)
- ✅ **ต้องระบุ origin ชัดเจน** เช่น `Access-Control-Allow-Origin: null`

---

## ✅ วิธีแก้ไข (แก้ไขแล้ว)

### 1. อัปเดต checkusersha3.php และ checkuserstep2.php

เปลี่ยนจาก:
```php
header('Access-Control-Allow-Origin: *');
```

เป็น:
```php
// CORS Configuration - Allow specific origins with credentials
$allowedOrigins = [
    'null', // For local file:// protocol (development)
    'http://localhost',
    'http://127.0.0.1',
    'https://yourdomain.com' // Replace with your production domain
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: null');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
```

---

## 📋 ขั้นตอนการ Deploy

### Step 1: อัปโหลดไฟล์ PHP ไปยัง Server

อัปโหลดไฟล์ทั้ง 3 ไปยัง `https://thepapers.in/loginsha3/`:

```
✅ checkusersha3.php      (Step 1 verification)
✅ checkuserstep2.php     (Step 2 verification)
✅ test_cors.php          (CORS testing)
```

### Step 2: ทดสอบ CORS ก่อน

เปิดไฟล์:
```
file:///d:/Rust/choppyMeterLab4/test_cors.html
```

หรือเข้า URL:
```
https://thepapers.in/loginsha3/test_cors.html
```

กดปุ่ม **"Run All Tests"** เพื่อทดสอบ:
1. ✅ Simple CORS Test
2. ✅ POST with Credentials
3. ✅ Full Login Flow

### Step 3: ตรวจสอบผลลัพธ์

#### ✅ Success - CORS ทำงานถูกต้อง:
```
✅ SUCCESS!
Login successful!
Username: demo
JWT received: Yes
Hash verified: Yes
```

#### ❌ Error - CORS ยังไม่ถูกต้อง:
```
❌ ERROR!
Error: Failed to fetch
CORS is NOT working correctly.
```

---

## 🔍 การตรวจสอบ CORS Headers

### วิธีที่ 1: ใช้ Browser DevTools

1. เปิด Chrome DevTools (F12)
2. ไปที่แท็บ **Network**
3. กด **Refresh** หน้าเว็บ
4. คลิกที่ request ไปยัง PHP file
5. ดูที่ **Headers** tab

**ควรเห็น Headers เหล่านี้:**
```
Access-Control-Allow-Origin: null (สำหรับ local file://)
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### วิธีที่ 2: ใช้ curl command

```bash
curl -I -X OPTIONS \
  -H "Origin: null" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  https://thepapers.in/loginsha3/checkusersha3.php
```

**Expected Response:**
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: null
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## 🌐 Production Configuration

### เมื่อ Deploy ไป Production Domain

แก้ไข `$allowedOrigins` ใน **ทั้งสองไฟล์ PHP**:

```php
$allowedOrigins = [
    'https://yourdomain.com',           // Production domain
    'https://www.yourdomain.com',       // www variant
    'https://app.yourdomain.com',       // subdomain (ถ้ามี)
    'http://localhost',                  // Local development
    'null'                               // File protocol (optional)
];
```

**หมายเหตุ:**
- ❌ ลบ `'null'` ออกใน Production เพื่อความปลอดภัย
- ✅ ใช้เฉพาะ HTTPS domains
- ✅ ระบุทุก domain/subdomain ที่จะเชื่อมต่อ

---

## 🚨 Common Issues & Solutions

### Issue 1: "net::ERR_FAILED"

**สาเหตุ:**
- Server ไม่ตอบกลับ
- PHP ไฟล์ยังไม่ถูก upload
- URL ผิด

**วิธีแก้:**
1. ตรวจสอบว่าไฟล์อยู่บน server จริง
2. ลองเข้า URL โดยตรงใน browser
3. ตรวจสอบ PHP error logs

### Issue 2: "CORS policy blocked"

**สาเหตุ:**
- CORS headers ไม่ถูกต้อง
- ใช้ wildcard `*` แทนที่จะระบุ origin

**วิธีแก้:**
1. ตรวจสอบว่าแก้ไขทั้ง 2 ไฟล์ PHP แล้ว
2. ตรวจสอบว่า `Access-Control-Allow-Credentials: true` มีอยู่
3. ลอง run test_cors.html

### Issue 3: "Preflight request doesn't pass"

**สาเหตุ:**
- Server ไม่ handle OPTIONS request

**วิธีแก้:**
```php
// เพิ่มใน PHP file
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
```

### Issue 4: Cookies ไม่ถูกส่ง

**สาเหตุ:**
- ขาด `credentials: 'include'`
- Cookie settings ไม่ถูกต้อง

**วิธีแก้:**
```php
// ตรวจสอบ cookie settings
setcookie(
    'auth_session',
    session_id(),
    [
        'expires' => time() + 3600,
        'path' => '/',
        'domain' => '',
        'secure' => true,      // HTTPS only
        'httponly' => true,
        'samesite' => 'None'   // เปลี่ยนจาก 'Strict' เป็น 'None' สำหรับ cross-origin
    ]
);
```

---

## 🔐 Security Considerations

### Development vs Production

**Development (Local file://):**
```php
$allowedOrigins = [
    'null',
    'http://localhost',
    'http://127.0.0.1'
];
```

**Production (HTTPS):**
```php
$allowedOrigins = [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
];
// ⚠️ ลบ 'null' ออก!
```

### Cookie SameSite Settings

**Local Development:**
```php
'samesite' => 'None'  // Allow cross-site (for testing)
```

**Production:**
```php
'samesite' => 'Strict'  // Prevent CSRF
```

---

## 📊 Testing Workflow

```
1. Update PHP files
   └─> Add CORS configuration
       └─> Upload to server
           
2. Test with test_cors.html
   └─> Run Test 1: Simple CORS
       └─> ✅ Pass → Continue
           ❌ Fail → Check headers
           
3. Run Test 2: POST with Credentials
   └─> ✅ Pass → Continue
       ❌ Fail → Check credentials setup
       
4. Run Test 3: Full Login Flow
   └─> ✅ Pass → Ready for production!
       ❌ Fail → Check JWT/PIN logic
       
5. Test actual login.html
   └─> Try real login
       └─> ✅ Pass → Deploy!
           ❌ Fail → Debug logs
```

---

## 🛠️ Debug Tools

### 1. Browser Console
```javascript
// Check CORS manually
fetch('https://thepapers.in/loginsha3/test_cors.php', {
    method: 'POST',
    credentials: 'include'
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

### 2. Network Tab Analysis
ดูที่:
- Request Headers → Origin
- Response Headers → Access-Control-*
- Status Code → 200 หรือ 401/403?

### 3. PHP Error Logs
```php
// เพิ่มใน PHP file เพื่อ debug
error_log("Origin: " . ($_SERVER['HTTP_ORIGIN'] ?? 'none'));
error_log("Method: " . $_SERVER['REQUEST_METHOD']);
```

---

## ✅ Deployment Checklist

Before going to production:

- [ ] PHP files อัปโหลดครบทั้ง 3 ไฟล์
- [ ] CORS headers ตั้งค่าถูกต้อง
- [ ] test_cors.html ทดสอบผ่านทั้ง 3 tests
- [ ] $allowedOrigins ระบุ production domain
- [ ] ลบ 'null' origin ออกจาก production
- [ ] JWT Secret Key เปลี่ยนเป็นค่าที่ปลอดภัย
- [ ] Database connection แทน hardcoded users
- [ ] HTTPS enabled ทั้งหมด
- [ ] Cookie secure flag = true
- [ ] Error logging enabled
- [ ] Rate limiting implemented (optional)

---

## 📞 Need Help?

หากยังมีปัญหา:

1. **ดู Browser Console** - อ่าน error message
2. **ดู Network Tab** - ตรวจสอบ request/response
3. **รัน test_cors.html** - ทดสอบ CORS อัตโนมัติ
4. **ตรวจสอบ PHP error logs** - ดู server-side errors

---

**Updated:** 2026-01-23  
**Status:** ✅ CORS Configuration Fixed  
**Next Step:** Upload PHP files และทดสอบด้วย test_cors.html
