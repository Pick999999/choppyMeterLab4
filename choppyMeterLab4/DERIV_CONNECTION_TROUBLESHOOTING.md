# 🔧 Deriv Connection Troubleshooting Guide

**Date:** 2026-01-23  
**Issue:** Authentication ผ่านแล้ว แต่ Connect Deriv Failed

---

## ✅ การแก้ไขที่ทำแล้ว

### 1. แก้ไข WebSocket URL (❗ สำคัญมาก)
```javascript
// ❌ WRONG (เก่า):
derivWS = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');

// ✅ CORRECT (ใหม่):
derivWS = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=1089');
```

### 2. เพิ่ม Error Handling + Logging
- เพิ่ม console.log ทุกขั้นตอน
- แสดง token length หลัง decode
- แสดง error message ละเอียด
- ตรวจสอบ token format

---

## 🔍 วิธีตรวจสอบปัญหา

### เปิด Browser Console (F12)

หลัง Login สำเร็จ ควรเห็น log ตามลำดับนี้:

```
✅ ถูกต้อง:
🔐 Initializing secure connection...
📦 Encrypted token received: YWJjZDEyMzR5b3VydG9r...
🔓 Token decoded successfully, length: 40
🔌 Connecting to Deriv WebSocket...
🔑 Using API token (first 10 chars): abcd123456...
✅ WebSocket connected successfully!
🔐 Sending authorization request...
📤 Authorization request sent, waiting for response...
📨 Received message: authorize
✅ Authorized as: CR1234567
🎉 Authorization complete!
```

---

## ❌ Error Messages & Solutions

### Error 1: "Token decoding failed"
```
❌ Token decode error: InvalidCharacterError
```

**สาเหตุ:**  
API Token ใน PHP ไม่ถูกต้องหรือมี special characters

**วิธีแก้:**
```php
// ตรวจสอบใน checkusersha3.php
'deriv_token' => 'abcd1234...'  // ต้องเป็น alphanumeric only
```

---

### Error 2: "Invalid token format after decoding"
```
❌ Token decoded successfully, length: 5
❌ Invalid token format after decoding
```

**สาเหตุ:**  
Token สั้นเกินไป (น้อยกว่า 10 ตัวอักษร)

**วิธีแก้:**  
ใส่ **Deriv API Token จริง** ใน PHP (ต้องยาวประมาณ 40+ characters)

---

### Error 3: "Authorization failed: InvalidToken"
```
✅ WebSocket connected successfully!
🔐 Sending authorization request...
📨 Received message: authorize
❌ Authorization failed: InvalidToken
```

**สาเหตุ:**  
Token ไม่ valid หรือ expired

**วิธีแก้:**
1. ไปที่ Deriv Dashboard
2. สร้าง API Token ใหม่
3. Copy token และใส่ใน `checkusersha3.php`

---

### Error 4: "Authorization timeout"
```
🔐 Sending authorization request...
📤 Authorization request sent, waiting for response...
⏱️ Authorization timeout - no response from server
```

**สาเหตุ:**  
- Internet ช้า
- Server ไม่ตอบกลับ
- Token ผิด

**วิธีแก้:**
1. ตรวจสอบ Internet connection
2. ลอง refresh หน้าใหม่
3. ตรวจสอบ token ใน PHP

---

### Error 5: WebSocket not connecting
```
🔌 Connecting to Deriv WebSocket...
❌ WebSocket error: ...
```

**สาเหตุ:**  
URL ยังเป็น `ws.derivws.com` (ผิด)

**วิธีแก้:**  
ตรวจสอบว่าแก้เป็น `ws.binaryws.com` แล้ว (บรรทัด 71 ใน jsB.js)

---

## 🎯 Checklist การตรวจสอบ

### ใน PHP (checkusersha3.php):
- [ ] API Token ใส่ถูกต้อง (40+ characters)
- [ ] Token เป็น Read + Trade scope
- [ ] ไม่มี space หรือ special characters
- [ ] User ที่ login ตรงกับ token

### ใน JavaScript (jsB.js):
- [ ] WebSocket URL = `wss://ws.binaryws.com/...`
- [ ] ไม่ใช่ `ws.derivws.com`
- [ ] Upload jsB.js ใหม่ไปยัง server

### ใน Browser Console:
- [ ] เห็น "WebSocket connected successfully"
- [ ] เห็น "Authorization request sent"
- [ ] เห็น "Authorized as: CRxxxxxx"
- [ ] ไม่มี error สีแดง

---

## 📝 วิธีสร้าง Deriv API Token

1. Login ที่ https://app.deriv.com
2. ไปที่ **Settings → API Token**
3. กด **Create new token**
4. ตั้งชื่อ: `Trading Bot`
5. เลือก Scopes:
   - ✅ **Read**
   - ✅ **Trade**
   - ✅ **Payments** (optional)
6. กด **Create**
7. Copy token (จะแสดงครั้งเดียว!)
8. Paste ใน `checkusersha3.php`

---

## 🔑 ตัวอย่าง Token Format

```php
// ✅ ถูกต้อง:
'deriv_token' => 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'

// ❌ ผิด (สั้นเกินไป):
'deriv_token' => 'test123'

// ❌ ผิด (มี space):
'deriv_token' => 'abcd 1234 efgh'

// ❌ ผิด (ยังไม่แก้):
'deriv_token' => 'YOUR_DERIV_API_TOKEN_HERE'
```

---

## 🧪 วิธีทดสอบ

### Test 1: ตรวจสอบ Token Decode
เปิด Console แล้วรันคำสั่ง:
```javascript
// Test decode token
const testToken = 'YWJjZDEyMzR5b3VydG9rZW4=';  // ตัวอย่าง encoded
const decoded = atob(testToken);
console.log('Decoded:', decoded);
console.log('Length:', decoded.length);
```

### Test 2: ตรวจสอบ WebSocket URL
```javascript
console.log('WS URL:', window.jsB.getWebSocket()?.url);
// ควรแสดง: wss://ws.binaryws.com/websockets/v3?app_id=1089
```

### Test 3: ตรวจสอบ Authentication
```javascript
console.log('Authenticated:', window.jsB.isAuthenticated());
console.log('Login ID:', window.jsB.getLoginId());
```

---

## 🚨 Common Mistakes

### ❌ Mistake 1: ใช้ Demo Account Token กับ Real Account
**Problem:** Token และ Account type ไม่ตรงกัน

**Solution:** ใช้ token จาก account ประเภทเดียวกัน

### ❌ Mistake 2: Copy Token ผิด
**Problem:** Copy ไม่ครบหรือมี space

**Solution:** Copy ทั้งหมด ไม่มีช่องว่าง

### ❌ Mistake 3: Token หมดอายุ
**Problem:** Token ถูก revoke หรือลบไปแล้ว

**Solution:** สร้าง token ใหม่

---

## ✅ Expected Console Output

เมื่อทุกอย่างถูกต้อง ควรเห็น:

```
🔐 jsB Security Module Loaded
🔐 Initializing secure connection...
📦 Encrypted token received: YWJjZDEyMzR...
🔓 Token decoded successfully, length: 40
🔌 Connecting to Deriv WebSocket...
🔑 Using API token (first 10 chars): a1b2c3d4e5...
✅ WebSocket connected successfully!
🔐 Sending authorization request...
📤 Authorization request sent, waiting for response...
📨 Received message: authorize
✅ Authorized as: CR1234567
🎉 Authorization complete!
👤 demo (CR1234567)  ← User info displayed
```

---

## 📞 Still Having Issues?

1. **Check Console Errors** - อ่าน error message แบบละเอียด
2. **Check Network Tab** - ดู WebSocket connection status
3. **Verify Token** - Login Deriv.com → Settings → API Token → Check if exists
4. **Try New Token** - สร้าง token ใหม่และลองอีกครั้ง

---

**Last Updated:** 2026-01-23  
**Status:** ✅ Fixed - WebSocket URL corrected + Better error handling
