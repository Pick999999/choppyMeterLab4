# 📄 trader.md - ระบบวิเคราะห์และเทรดอัตโนมัติ (DerivTrader)

### 1. รายการฟังก์ชันทั้งหมด (Function Summary)
สรุปการทำงานของฟังก์ชันภายในไฟล์ `trader.js`:

* **getWebSocket()**: ดึงอินสแตนซ์ของ WebSocket จากแหล่งต่างๆ ใน Global Scope เพื่อใช้สื่อสารกับ Server
* **init()**: เริ่มต้นตั้งค่า UI, โหลดข้อมูลจากเครื่อง และเชื่อมต่อ Event Listeners สำหรับปุ่มกดต่างๆ
* **updateTradingClock()**: แสดงเวลาปัจจุบันของประเทศไทย (UTC+7) บนหน้าจอเทรด
* **authorize()**: ส่ง API Token ไปยัง Deriv เพื่อยืนยันสิทธิ์ในการเข้าถึงบัญชี
* **handleAuthorize(data)**: จัดการผลการล็อกอินและเริ่มดึงข้อมูลยอดเงินคงเหลือ (Balance)
* **loadSettings()**: ดึงค่าที่ผู้ใช้กรอก (Stake, Duration, Target) มาเก็บไว้ในตัวแปรระบบ
* **getCurrentStake()**: คำนวณจำนวนเงินที่จะเทรดในไม้ปัจจุบัน (รองรับทั้งเงินคงที่และระบบ Martingale)
* **getAction(analysisData)**: ตัดสินใจทิศทาง 'CALL' หรือ 'PUT' โดยวิเคราะห์จากค่า EMA ใน Store
* **startTrading() / stopTrading()**: ควบคุมสถานะการทำงานของระบบเทรดอัตโนมัติ
* **checkEntry()**: ตรวจสอบเงื่อนไขวินาทีที่ 0 และสัญญาณอินดิเคเตอร์เพื่อเข้าออเดอร์
* **executeTrade(action)**: ส่งคำสั่งซื้อสัญญา (Proposal) ไปยังระบบของ Deriv
* **handleProposal(data) / handleBuy(data)**: จัดการขั้นตอนการรับราคาเสนอและยืนยันการซื้อสัญญา
* **handleContractUpdate(data)**: ติดตามสถานะของสัญญาที่กำลังถืออยู่ (Profit/Loss แบบ Real-time)
* **processTradeResult(contract)**: สรุปผลการเทรด, บันทึกสถิติ Win/Loss และขยับไม้ Martingale
* **renderTrackOrderTable()**: วาดตารางแสดงรายการออเดอร์ปัจจุบันและประวัติย้อนหลังลงบนหน้าเว็บ
* **updateUI()**: อัปเดตตัวเลขสถิติ ผลกำไรรวม และสถานะการเชื่อมต่อบนหน้าจอ
* **playSoldSound()**: เล่นเสียงแจ้งเตือนเมื่อระบบปิดการขายสัญญาเรียบร้อย

---

### 2. การเรียกใช้ฟังก์ชันและตัวแปรภายนอก (External Dependencies)
ไฟล์นี้ทำงานร่วมกับองค์ประกอบนอกไฟล์ดังนี้:

* **window.jsB**: ใช้ตรวจสอบการล็อกอิน (`isAuthenticated`) และดึงเลขบัญชีผู้ใช้
* **window.derivWS**: ช่องทาง WebSocket หลักสำหรับการรับ-ส่งข้อมูลกับ API
* **app.state**: เข้าไปดึงข้อมูล `analysisDataStore` เพื่อใช้ค่า EMA และเช็ค `serverTimeOffset`
* **lucide**: เรียกใช้งาน `lucide.createIcons()` เพื่อแสดงไอคอนบนหน้า UI
* **localStorage**: ใช้สำหรับเก็บและโหลด API Token เพื่อความสะดวกของผู้ใช้

---

### 3. คุณสมบัติหลัก (Key Features)
* **Money Management**: มีระบบ Martingale ที่ตั้งค่าลำดับเงินได้เอง (1, 2, 6, 18, 54, 162, 324)
* **Precision Entry**: เข้าออเดอร์เฉพาะจุดเริ่มต้นของแท่งเทียนใหม่ (วินาทีที่ 0) เพื่อลดความคลาดเคลื่อน
* **Safety Mechanism**: ระบบหยุดเทรดอัตโนมัติเมื่อทำกำไรถึงเป้า (Target) หรือแพ้จนหมดไม้ทบ
* **Real-time Dashboard**: แสดงตาราง Order Tracking พร้อมสถานะสัญญาแบบสดๆ จาก Server
* **Hybrid Support**: รองรับการทำงานร่วมกับแพลตฟอร์มทั้งรุ่น V2, V3 และ V4 อย่างยืดหยุ่น