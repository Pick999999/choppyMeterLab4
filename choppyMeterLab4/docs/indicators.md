# 📊 indicators.md - คลังสูตรคำนวณอินดิเคเตอร์ (Indicator Math Library)

### 1. รายการฟังก์ชันทั้งหมด (Function Summary)
สรุปการทำงานของฟังก์ชันทางคณิตศาสตร์ในไฟล์ `indicators.js`:

* **sma(data, period)**: คำนวณค่าเฉลี่ยเคลื่อนที่แบบง่าย (Simple Moving Average) โดยการหาค่าเฉลี่ยย้อนหลังตามระยะที่กำหนด
* **rma(data, period)**: คำนวณค่าเฉลี่ยแบบ Wilder's Smoothing (Relative Moving Average) ซึ่งเป็นหัวใจหลักของ RSI และ ATR
* **ema(data, period)**: คำนวณค่าเฉลี่ยเคลื่อนที่แบบถ่วงน้ำหนัก (Exponential Moving Average) ที่ตอบสนองต่อราคาล่าสุดได้รวดเร็ว
* **wma(data, period)**: คำนวณค่าเฉลี่ยเคลื่อนที่แบบถ่วงน้ำหนักตามลำดับความสำคัญ (Weighted Moving Average)
* **hma(data, period)**: คำนวณ Hull Moving Average ที่ออกแบบมาเพื่อลดการหน่วง (Lag) และให้ความสมูทสูง
* **ehma(data, period)**: Exponential Hull Moving Average รุ่นอัปเกรดที่ใช้ EMA แทน WMA เพื่อความรวดเร็วในการติดตามราคา
* **tr(high, low, close)**: คำนวณหา True Range หรือระยะการวิ่งของราคาที่กว้างที่สุดในแต่ละแท่งเทียน
* **atr(high, low, close, period)**: คำนวณ Average True Range เพื่อวัดความผันผวนเฉลี่ยของตลาดในช่วงเวลาที่กำหนด
* **adx(high, low, close, period)**: คำนวณ Average Directional Index เพื่อวัดความแข็งแกร่งของเทรนด์
* **rsi(data, period)**: คำนวณ Relative Strength Index เพื่อระบุสภาวะการซื้อมากเกินไป (Overbought) หรือขายมากเกินไป (Oversold)
* **bollingerBands(data, period, stdDev)**: คำนวณแถบ Bollinger (บน, กลาง, ล่าง) โดยใช้ค่าเบี่ยงเบนมาตรฐานเพื่อหาขอบเขตราคา
* **ci(high, low, close, period)**: คำนวณ Choppiness Index เพื่อจำแนกว่าตลาดเป็นเทรนด์หรือไซด์เวย์

---

### 2. การเรียกใช้ฟังก์ชันภายในระบบ (Internal Dependencies)
ไฟล์นี้ถูกออกแบบมาในรูปแบบ **Modular Object** ที่ฟังก์ชันซับซ้อนจะเรียกใช้ฟังก์ชันพื้นฐานภายในตัวเอง:

* **Helpers**: ฟังก์ชัน `adx`, `atr`, และ `rsi` มีการเรียกใช้ `rma` ภายในเพื่อกรองสัญญาณ
* **Core Logic**: ฟังก์ชัน `hma` และ `ehma` พึ่งพาการคำนวณจาก `wma` และ `ema` ตามลำดับ
* **Math Objects**: ใช้ `Math.abs`, `Math.max`, `Math.log10`, และ `Math.sqrt` ของ JavaScript ในการคำนวณขั้นสูง

---

### 3. คุณสมบัติหลัก (Key Features)
* **High Responsiveness**: รวบรวม Moving Average สาย "ลดการหน่วง" (Lag-Reduced) อย่าง HMA และ EHMA ไว้ครบถ้วน
* **Error Resilience**: มีระบบตรวจสอบค่า `null`, `NaN` หรือข้อมูลที่ไม่ครบตามรอบ (Period) เพื่อป้องกันไม่ให้ระบบล่ม
* **Standard Compliant**: ใช้สูตรมาตรฐานเดียวกับ TradingView และ J. Welles Wilder (โดยเฉพาะการใช้ RMA ใน RSI/ADX)
* **Multi-Output Support**: รองรับการส่งค่ากลับทั้งแบบ Array เดี่ยว และแบบ Object (สำหรับ Bollinger Bands)