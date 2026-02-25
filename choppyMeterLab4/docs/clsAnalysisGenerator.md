# 📉 clsAnalysisGenerator.md - คลาสวิเคราะห์และสรุปผลข้อมูลทางเทคนิค

### 1. รายการฟังก์ชันทั้งหมด (Function Summary)
สรุปการทำงานของฟังก์ชันภายในคลาส `AnalysisGenerator`:

* **constructor(candleData, options)**: รับข้อมูลแท่งเทียนและตั้งค่าคอนฟิก เช่น ช่วงเวลาของ EMA (Short, Medium, Long) และเกณฑ์การวัดค่าต่าง ๆ
* **generate()**: ฟังก์ชันหลักที่สั่งเริ่มการคำนวณอินดิเคเตอร์ทุกตัว และสร้าง Object ข้อมูลวิเคราะห์ (Analysis Data) ของแท่งเทียนแต่ละแท่ง
* **getSummary()**: สรุปสถิติภาพรวม เช่น จำนวนแท่งเขียว/แดง, จำนวนการตัดกันของ EMA, และค่าล่าสุดของ ADX หรือ CI
* **calculateMA(data, period, type)**: ฟังก์ชันครอบจักรวาลสำหรับคำนวณ Moving Average ตามประเภทที่ระบุ (EMA, HMA, EHMA)
* **calculateRSI / calculateATR / calculateBB / calculateCI / calculateADX**: กลุ่มฟังก์ชันคำนวณค่าทางเทคนิคพื้นฐาน โดยคืนค่าเป็น Array ที่มีโครงสร้างเวลากำกับ
* **_analyzeTrend(current, previous)**: (Internal) วิเคราะห์ทิศทางและแรงส่งของเทรนด์จากการเรียงตัวของเส้น EMA
* **_checkCrossover(short, long, pShort, pLong)**: (Internal) ตรวจสอบการตัดกันของเส้นค่าเฉลี่ยเพื่อระบุจุดกลับตัว (Golden Cross / Death Cross)
* **toJSON()**: แปลงผลการวิเคราะห์ทั้งหมดเป็นรูปแบบ JSON String เพื่อใช้ในการ Export ข้อมูล

---

### 2. การเรียกใช้ฟังก์ชันและตัวแปรภายนอก (External Dependencies)
ไฟล์นี้ถูกออกแบบมาให้เป็น **Standalone Module** (ไม่พึ่งพา DOM) แต่มีการเชื่อมโยงดังนี้:

* **CandleData Input**: ต้องการ Array ของ Object ที่มี `time, open, high, low, close` ตามมาตรฐานของ LightweightCharts
* **Math Objects**: ใช้ `Math` library ของ JavaScript อย่างหนักในการหาค่า Standard Deviation (สำหรับ Bollinger Bands) และการคำนวณ Log (สำหรับ CI)
* **Logic Flow**: ทำงานเป็นเบื้องหลังให้แอปพลิเคชันเวอร์ชันต่าง ๆ (V2, V3, V4) เพื่อส่งข้อมูลที่วิเคราะห์แล้วไปให้ `trader.js` ตัดสินใจ

---

### 3. คุณสมบัติหลัก (Key Features)
* **Comprehensive Analysis**: ไม่ใช่แค่คำนวณอินดิเคเตอร์ แต่มีการวิเคราะห์ "สถานะ" ของตลาด เช่น Trend Direction และ EMA Crossover Type ให้เสร็จสรรพ
* **Abnormal Detection**: มีระบบตรวจจับความผิดปกติของราคา (Abnormal Candle) และความผันผวน (Abnormal ATR) เพื่อเตือนสภาวะตลาดอันตราย
* **Indicator Consistency**: รองรับการคำนวณ Moving Average หลายรูปแบบ (EMA, HMA, EHMA) ช่วยให้ผู้ใช้ปรับเปลี่ยนกลยุทธ์ได้ยืดหยุ่น
* **Statistical Insight**: ฟังก์ชัน `getSummary` ช่วยให้มองเห็นภาพรวมของข้อมูลย้อนหลัง (Backtest เบื้องต้น) ได้ทันทีผ่าน Dashboard
* **Scalable Code**: แยกส่วนการคำนวณออกจาก UI ชัดเจน ทำให้สามารถนำไปรันบน Node.js หรือ Environment อื่น ๆ ที่ไม่มีหน้าจอได้