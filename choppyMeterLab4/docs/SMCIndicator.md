# 🏛️ SMCIndicator.md - ระบบวิเคราะห์โครงสร้างตลาด (Smart Money Concepts)

### 1. รายการฟังก์ชันทั้งหมด (Function Summary)
สรุปการทำงานของฟังก์ชันหลักในคลาส `SMCIndicator`:

* **constructor(options)**: กำหนดค่าเริ่มต้นและตั้งค่า Config สำหรับการตรวจจับโครงสร้าง เช่น สี, ระยะความไว (Sensitivity), และสไตล์การแสดงผล
* **calculate(data)**: ฟังก์ชันหลักที่ใช้ประมวลผลข้อมูล OHLC ทั้งหมด เพื่อระบุโครงสร้างตลาด (SMC) ในทุกมิติ
* **_detectSwingPoints(data)**: ค้นหาจุดสูงสุด (HH, LH) และจุดต่ำสุด (HL, LL) ทั้งในระดับ Internal และ Swing
* **_detectStructure(data)**: วิเคราะห์การทะลุโครงสร้างเพื่อระบุจุด **BOS** (Break of Structure) และ **CHoCH** (Change of Character)
* **_detectOrderBlocks(data)**: ระบุโซนราคาที่มีการสะสมคำสั่งซื้อขาย (Order Blocks) ทั้งแบบ Bullish และ Bearish
* **_detectFairValueGaps(data)**: ค้นหาช่องว่างของราคา (FVG) ที่เกิดจากความไม่สมดุลของแรงซื้อแรงขาย (Imbalance)
* **_detectLiquidity(data)**: ตรวจจับพื้นที่สภาพคล่อง เช่น Equal Highs (EQH) และ Equal Lows (EQL)
* **_detectStrongWeakHighLows()**: ระบุว่าจุดสูงสุด/ต่ำสุดใดมีความแข็งแกร่ง (Strong) หรืออ่อนแอ (Weak) ตามแนวโน้ม
* **getStructure(filter)**: ดึงข้อมูล BOS/CHoCH ตามเงื่อนไขที่กำหนด (เช่น เฉพาะระดับ Swing)
* **getOrderBlocks(filter)**: ดึงข้อมูล Order Blocks พร้อมสถานะว่าถูกใช้ไปแล้ว (Mitigated) หรือยัง
* **getFairValueGaps(filter)**: ดึงข้อมูลช่องว่างราคา FVG ที่ยังไม่ได้ถูกเติม (Unfilled)

---

### 2. การเรียกใช้ฟังก์ชันและตัวแปรภายนอก (External Dependencies)
ไฟล์นี้ถูกเขียนในรูปแบบ **Class-based** และทำงานร่วมกับปัจจัยภายนอกดังนี้:

* **OHLCV Data Structure**: ต้องการ Array ของ Object ที่บรรจุค่า `time`, `open`, `high`, `low`, `close` เป็น Input หลัก
* **Math Objects**: ใช้ `Math.max`, `Math.min`, และ `Math.abs` ในการเปรียบเทียบราคาและหาระยะของโซนต่างๆ
* **LightweightCharts Integration**: ออกแบบมาเพื่อให้ส่งค่าที่ประมวลผลแล้วไปวาดเป็น `PriceLine`, `Rectangle`, หรือ `Series` บนกราฟได้ทันที

---

### 3. คุณสมบัติหลัก (Key Features)
* **Comprehensive SMC Tool**: รวมทุกองค์ประกอบของ Smart Money ไว้ในไฟล์เดียว (BOS, CHoCH, OB, FVG, EQH/EQL, PD Zones)
* **Dual Level Analysis**: แยกแยะโครงสร้างระหว่าง **Internal** (ระยะสั้น) และ **Swing** (ระยะยาว) เพื่อให้เห็นภาพรวมของเทรนด์
* **Order Block Mitigation**: ระบบติดตามโซน OB ว่าราคาได้กลับมาทดสอบและใช้คำสั่งซื้อขายไปแล้วหรือยัง (Mitigation Tracking)
* **Premium & Discount Zones**: คำนวณโซนราคาที่ได้เปรียบ (Discount) และโซนราคาที่แพงเกินไป (Premium) ตาม Fibonacci 0.5
* **High Customizability**: สามารถปรับจูนความละเอียดในการหาจุดสูงสุด/ต่ำสุด (Swing Lookback) ให้เหมาะกับแต่ละไทม์เฟรมได้