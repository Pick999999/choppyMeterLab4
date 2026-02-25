# ⚠️ Authorization Timeout - Quick Fix Guide

**Error:** `Authorization timeout - no response from server`

---

## 🔍 สาเหตุหลัก: API Token ไม่ถูกต้อง

### ❌ ปัญหาที่พบบ่อย:

```php
// ใน checkusersha3.php
'deriv_token' => 'YOUR_DERIV_API_TOKEN_HERE'  // ❌ ยังไม่แก้!
```

**ผลลัพธ์:** Deriv API ไม่ตอบกลับเพราะ Token ไม่ valid!

---

## ✅ วิธีแก้ไข (เร็วสุด):

### Step 1: ตรวจสอบ Token ใน PHP

เปิดไฟล์: `checkusersha3.php`

ดูบรรทัด 64-75:

```php
$validUsers = [
    'demo' => [
        'password_sha3' => hash('sha3-512', 'demo123'),
        'pin' => '123456',
        'deriv_token' => 'YOUR_DERIV_API_TOKEN_HERE'  // 👈 แก้ตรงนี้!
    ],
];
```

### Step 2: ใส่ Token จริง

```php
$validUsers = [
    'demo' => [
        'password_sha3' => hash('sha3-512', 'demo123'),
        'pin' => '123456',
        'deriv_token' => 'a1B2c3D4e5F6g7H8i9...'  // ✅ ใส่ Deriv API Token จริง
    ],
];
```

---

## 🔑 วิธีสร้าง Deriv API Token:

### 1. Login ที่ Deriv
```
https://app.deriv.com
```

### 2. ไปที่ Settings → API Token
```
Settings → Account Security → API Token
```

### 3. Create New Token
- **Token name:** `Trading Bot`
- **Scopes:** 
  - ✅ Read
  - ✅ Trade
  - ✅ Payments (optional)
- กด **Create**

### 4. Copy Token
```
⚠️ Token จะแสดงครั้งเดียว!
📋 Copy ทันที: a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0
```

### 5. Paste ใน PHP
```php
'deriv_token' => 'a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0'
```

---

## 🧪 วิธีทดสอบว่า Token ถูกต้อง:

### Test 1: ใน Browser Console

```javascript
// Test WebSocket + Token manually
const ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');

ws.onopen = () => {
    console.log('Connected');
    ws.send(JSON.stringify({
        authorize: 'YOUR_TOKEN_HERE'  // ใส่ token ที่คัดลอกมา
    }));
};

ws.onmessage = (msg) => {
    console.log('Response:', JSON.parse(msg.data));
};
```

**ถ้าถูกต้อง ควรเห็น:**
```json
{
  "msg_type": "authorize",
  "authorize": {
    "loginid": "CR1234567",
    "balance": 10000,
    "currency": "USD"
  }
}
```

**ถ้าผิด ควรเห็น:**
```json
{
  "msg_type": "authorize",
  "error": {
    "code": "InvalidToken",
    "message": "Invalid token"
  }
}
```

---

## 📊 Checklist การแก้ปัญหา:

- [ ] เปิด `checkusersha3.php`
- [ ] หาบรรทัด `'deriv_token' => '...'`
- [ ] แทนที่ด้วย **Deriv API Token จริง**
- [ ] **Upload PHP file ใหม่** ไปยัง server
- [ ] **Clear Browser Cache**
- [ ] Login ใหม่

---

## 🔍 ตรวจสอบใน Console:

หลังแก้ไขแล้ว **ควรเห็น log เหล่านี้:**

```
✅ ถูกต้อง:
🔌 Connecting to Deriv WebSocket...
✅ WebSocket connected successfully!
🔐 Sending authorization request...
📤 Authorization request sent, waiting for response...
📨 Received message type: authorize
📦 Full response: {msg_type: "authorize", authorize: {...}}
🔐 Processing authorize response...
✅ Authorized as: CR1234567
💰 Balance: 10000 USD
🔓 Resolving 1 pending auth requests
🎉 Authorization complete and event dispatched!
```

```
❌ ผิด (Token ไม่ valid):
🔌 Connecting to Deriv WebSocket...
✅ WebSocket connected successfully!
🔐 Sending authorization request...
📤 Authorization request sent, waiting for response...
📨 Received message type: authorize
📦 Full response: {msg_type: "authorize", error: {...}}
❌ Authorization ERROR: {code: "InvalidToken", message: "..."}
```

---

## ⚡ Token ที่ใช้ได้:

### ✅ Valid Token Examples:
```
a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0  (40 chars)
AbCdEfGhIjKlMnOpQrStUvWxYz1234567890XyZ  (40+ chars)
```

### ❌ Invalid Token Examples:
```
YOUR_DERIV_API_TOKEN_HERE  ← Placeholder ยังไม่แก้
test123  ← สั้นเกินไป
abcd 1234  ← มี space
```

---

## 🆘 ยังแก้ไม่ได้?

### เช็คเพิ่มเติม:

1. **Token expires?**
   - ไปที่ Deriv → API Token
   - ตรวจสอบว่า token ยัง active อยู่หรือไม่
   - ถ้า revoked แล้ว สร้างใหม่

2. **Token scope ถูกต้อง?**
   - ต้องมี **Read** + **Trade** scopes
   - ถ้าไม่มี สร้างใหม่

3. **Copy ผิด?**
   - Token ต้อง copy ครบทุกตัวอักษร
   - ไม่มีช่องว่างข้างหน้าหรือข้างหลัง

4. **Upload ยัง?**
   - ตรวจสอบว่า upload `checkusersha3.php` ใหม่แล้ว
   - Refresh browser cache

---

## 🎯 Quick Summary:

1. ✅ เปิด `checkusersha3.php`
2. ✅ สร้าง Deriv API Token ที่ https://app.deriv.com
3. ✅ Copy token
4. ✅ Paste แทน `'YOUR_DERIV_API_TOKEN_HERE'`
5. ✅ Upload PHP file ใหม่
6. ✅ Login ใหม่
7. ✅ Done!

---

**ใช้เวลา:** ~3 นาที  
**ความยาก:** ⭐ (ง่ายมาก)  
**จำเป็น:** ⭐⭐⭐⭐⭐ (สำคัญมาก!)
