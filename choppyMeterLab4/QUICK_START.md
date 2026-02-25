# 🚀 Quick Start Guide - Secure Authentication

## ⚡ เริ่มต้นใช้งาน 5 นาที

### สำหรับ Development (Local)

#### 1. อัปโหลด PHP Files
อัปโหลดไฟล์เหล่านี้ไปยัง `https://thepapers.in/loginsha3/`:
- ✅ `checkusersha3.php`
- ✅ `checkuserstep2.php`
- ✅ `test_cors.php` (สำหรับทดสอบ)

#### 2. ทดสอบ CORS
เปิดไฟล์:
```
file:///d:/Rust/choppyMeterLab4/test_cors.html
```

กดปุ่ม **"Run All Tests"**

**ผลลัพธ์ที่ต้องการ:**
```
✅ Test 1: Simple CORS Test - SUCCESS
✅ Test 2: POST with Credentials - SUCCESS
✅ Test 3: Full Login Flow - SUCCESS
```

#### 3. ลอง Login
เปิดไฟล์:
```
file:///d:/Rust/choppyMeterLab4/login.html
```

**ข้อมูลทดสอบ:**
- Username: `demo`
- Password: `demo123`
- PIN: `123456`

#### 4. เข้าสู่ Dashboard
หลัง Login สำเร็จ จะ redirect ไปยัง:
```
file:///d:/Rust/choppyMeterLab4/indexV3.html
```

---

## 📋 File Checklist

### ไฟล์ที่ต้อง Upload ไป Server:
- [x] `checkusersha3.php` → Step 1 verification
- [x] `checkuserstep2.php` → Step 2 verification
- [ ] `test_cors.php` → CORS testing (optional)

### ไฟล์ Local:
- [x] `login.html` → Login page
- [x] `login2.html` → PIN entry
- [x] `indexV3.html` → Dashboard
- [x] `js/jsB.js` → Security module
- [x] `test_cors.html` → CORS tester

---

## 🔑 Default Accounts

### Demo Account
```
Username: demo
Password: demo123
PIN: 123456
```

### Admin Account
```
Username: admin
Password: admin123
PIN: ABC123
```

---

## ❓ FAQ

### Q: CORS Error หมายความว่าอะไร?
**A:** ไฟล์ PHP ยังไม่ถูก upload หรือ upload ผิด location

### Q: "Invalid username or password"?
**A:** ตรวจสอบว่า username/password ถูกต้อง หรือ user ยังไม่ถูก setup ใน PHP

### Q: "Invalid PIN"?
**A:** PIN ต้องเป็น 6 หลัก และตรงกับที่ตั้งไว้ใน PHP

### Q: ต้องการเพิ่ม User ใหม่?
**A:** แก้ไข `$validUsers` array ใน `checkusersha3.php`

---

## 🆘 เจอปัญหา?

### 1. CORS Error
👉 ดูที่: `CORS_TROUBLESHOOTING.md`

### 2. Setup คำถาม
👉 ดูที่: `SECURE_AUTH_SETUP.md`

### 3. สรุปทั้งหมด
👉 ดูที่: `IMPLEMENTATION_SUMMARY.md`

---

## 🎯 Next Steps

หลังจากทดสอบสำเร็จแล้ว:

1. **เปลี่ยน JWT Secret** ใน PHP files
2. **เพิ่ม Users** ตาม requirement
3. **ตั้งค่า Database** (แทน hardcoded users)
4. **ตั้งค่า Production Domain** ใน CORS
5. **Deploy to Production** 🚀

---

**ใช้เวลาทั้งหมด:** ~5 นาที  
**Difficulty:** ⭐⭐ (Easy)  
**Status:** Ready to use!
