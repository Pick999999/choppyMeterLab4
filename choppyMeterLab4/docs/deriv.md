# 🌐 deriv.md - ระบบเชื่อมต่อ API (Deriv API Connector)

### 1. รายการฟังก์ชันทั้งหมด (Function Summary)
สรุปการทำงานของฟังก์ชันภายใน Object `DerivAPI`:

* **connect()**: สร้างการเชื่อมต่อ WebSocket ไปยัง Server ของ Deriv โดยใช้ `appId` ที่กำหนด และจัดการ Event พื้นฐาน (onopen, onerror, onmessage)
* **getHistory(symbol, granularity, count)**: ส่งคำขอเพื่อดึงข้อมูลกราฟย้อนหลัง (Candlesticks) ตามสัญลักษณ์, ความละเอียดของเวลา (เช่น 60 = 1 นาที), และจำนวนแท่งที่ต้องการ
* **subscribeData(symbol)**: ส่งคำขอเพื่อติดตามข้อมูลราคาล่าสุดแบบ Real-time สำหรับสัญลักษณ์ที่เลือก

---

### 2. การเรียกใช้ฟังก์ชันและตัวแปรภายนอก (External Dependencies)
ไฟล์นี้ทำหน้าที่เป็นตัวกลาง (Middleware) จึงมีการเชื่อมโยงดังนี้:

* **Native WebSocket**: ใช้คลาส `WebSocket` ของ Browser เพื่อสร้างการเชื่อมต่อ `wss://ws.binaryws.com/websockets/v3`
* **JSON**: ใช้ `JSON.parse` เพื่อแปลงข้อมูลที่ตอบกลับจาก Server และ `JSON.stringify` เพื่อส่งคำขอ (Request)
* **External Callbacks**: มีการเรียกใช้ `DerivAPI.onOpen` และ `DerivAPI.onMessage` ซึ่งเป็นฟังก์ชันที่ต้องถูกกำหนดจากไฟล์หลัก (เช่น `trader.js`) เพื่อประมวลผลข้อมูลต่อ

---

### 3. คุณสมบัติหลัก (Key Features)
* **Promise-based Connection**: ฟังก์ชัน `connect` คืนค่าเป็น Promise ทำให้จัดการลำดับการทำงานได้ง่าย (รอจนกว่าจะเชื่อมต่อสำเร็จค่อยเริ่มงานอื่น)
* **Flexible Granularity**: รองรับการดึงข้อมูลย้อนหลังในหลายไทม์เฟรม (60, 180, 300 เป็นต้น)
* **Real-time Ready**: ออกแบบมาเพื่อรองรับทั้งการดึงข้อมูลประวัติ (History) และการรับข้อมูลสด (Subscription) พร้อมกัน
* **Centralized Configuration**: รวม `appId` และ Logic การเชื่อมต่อไว้ที่เดียว ง่ายต่อการแก้ไขหรือเปลี่ยนบัญชีเทรด