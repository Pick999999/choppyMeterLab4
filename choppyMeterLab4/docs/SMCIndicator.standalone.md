# 🏛️ SMCIndicator.standalone.md - ระบบวิเคราะห์โครงสร้างตลาด (Standalone Version)

### 1. รายการฟังก์ชันทั้งหมด (Function Summary)
สรุปการทำงานของฟังก์ชันและเมธอดภายในคลาส `SMCIndicator` เวอร์ชัน Standalone:

* **constructor(config)**: รับค่าการตั้งค่าเพื่อกำหนดความละเอียดในการตรวจจับ เช่น `swingLength` (ความยาวรอบคลื่น) และ `internalLength` (โครงสร้างภายใน)
* **calculate(data)**: รับข้อมูลแท่งเทียน (OHLC) และรันกระบวนการวิเคราะห์ SMC ทั้งหมดตั้งแต่หาจุด Swing ไปจนถึงระบุโซน Order Block
* **_reset()**: (Internal) ล้างค่า State และตัวแปรสะสมทั้งหมดก่อนเริ่มการคำนวณใหม่ เพื่อป้องกันข้อมูลปนกัน
* **_detectSwingPoints(data)**: ค้นหาจุดสูงสุด (Highs) และต่ำสุด (Lows) ทั้งในระดับระยะสั้น (Internal) และระยะยาว (Swing)
* **_detectStructure(data)**: วิเคราะห์การทะลุผ่านของราคาเพื่อระบุสัญญาณ BOS (Break of Structure) และ CHoCH (Change of Character)
* **_detectOrderBlocks(data)**: คำนวณหาโซนต้นทุนที่มีนัยสำคัญ (Order Blocks) พร้อมระบบกรองด้วยค่า ATR เพื่อหาโซนที่มีคุณภาพ
* **_detectFairValueGaps(data)**: ระบุช่องว่างราคา (FVG) ที่เกิดจากความไม่สมดุลของตลาด (Market Imbalance)
* **_detectEqualHighsLows(data)**: ค้นหาแนวรับแนวต้านที่เท่ากัน (Double Top/Bottom) เพื่อระบุจุดสะสม Liquidity
* **getStructures(filter)** / **getSwingPoints(filter)**: เมธอดสำหรับดึงข้อมูลโครงสร้างที่ระบุแล้วออกมาใช้งานตามเงื่อนไข (เช่น เฉพาะ CHoCH ระดับ Swing)
* **getOrderBlocks(filter)** / **getFairValueGaps(filter)**: ดึงข้อมูลโซนราคาที่ยังไม่ถูกทดสอบ (Unmitigated / Unfilled) ออกมาใช้งาน

---

### 2. การเรียกใช้ฟังก์ชันและตัวแปรภายนอก (External Dependencies)
ไฟล์นี้ถูกออกแบบมาให้เป็น **Self-contained** เพื่อความสะดวกในการใช้งาน:

* **Global Constants**: ใช้ค่าคงที่อย่าง `BULLISH`, `BEARISH`, `BULLISH_LEG` ที่ประกาศไว้ที่ต้นไฟล์
* **No ES6 Modules**: ไม่มีการเรียกใช้ `import` หรือ `export` ทำให้สามารถโหลดผ่านแท็ก `<script>` ใน HTML ได้โดยตรง
* **JavaScript Math**: ใช้ `Math.abs`, `Math.max`, `Math.min` และการจัดการ Array พื้นฐาน (filter, map, push)

---

### 3. คุณสมบัติหลัก (Key Features)
* **Standalone Portability**: สามารถใช้งานร่วมกับ Vanilla JavaScript หรือโปรเจกต์เก่าได้ทันทีโดยไม่ต้องตั้งค่า Build Tools
* **Advanced Structure Mapping**: แยกแยะระหว่าง Internal Structure (เพื่อเทรด Scalping) และ Swing Structure (เพื่อดูเทรนด์หลัก) ชัดเจน
* **Liquidity & Imbalance Detection**: มีระบบหาจุด Liquidity (EQH/EQL) และ FVG ซึ่งเป็นหัวใจของกลยุทธ์ Smart Money Concepts
* **Premium & Discount Pricing**: ช่วยคำนวณว่าราคาปัจจุบันอยู่ในจุดที่ควรซื้อ (Discount) หรือควรขาย (Premium) ตามกรอบราคาของสถาบัน
* **Optimized for Speed**: ออกแบบ Logic ให้ทำงานได้เร็ว แม้จะประมวลผลข้อมูลแท่งเทียนจำนวนมากในครั้งเดียว