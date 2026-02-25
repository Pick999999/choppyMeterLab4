# 🎨 SMCChartRenderer.md - ตัวจัดการการวาดกราฟโครงสร้างตลาด (SMC Visualizer)

### 1. รายการฟังก์ชันทั้งหมด (Function Summary)
สรุปการทำงานของเมธอดภายในคลาส `SMCChartRenderer`:

* **constructor(chart, series, config)**: รับอินสแตนซ์ของกราฟและซีรีส์ราคา พร้อมตั้งค่าสีและสไตล์สำหรับเส้น BOS, CHoCH, OB และ FVG
* **render(smcResults, currentTime)**: ฟังก์ชันหลักที่รับผลลัพธ์จาก `SMCIndicator` มาสั่งวาดองค์ประกอบทั้งหมดลงบนหน้าจอกราฟ
* **renderStructures(structures)**: วาดเส้นแนวขวางพร้อมป้ายกำกับสำหรับจุด Break of Structure (BOS) และ Change of Character (CHoCH)
* **renderOrderBlocks(orderBlocks)**: วาดกล่องสี่เหลี่ยม (Rectangles) แทนโซนแรงซื้อแรงขายที่สำคัญ พร้อมแยกสี Bullish/Bearish
* **renderFairValueGaps(fvgs)**: วาดโซนช่องว่างราคา (FVG) เพื่อระบุพื้นที่ความไม่สมดุลของราคา (Imbalance)
* **renderEqualHighsLows(eqhl)**: แสดงสัญลักษณ์จุดสภาพคล่อง (Liquidity) เช่น Double Top/Bottom ด้วยเส้นประและป้ายกำกับ
* **renderPremiumDiscountZone(zone)**: วาดแถบสีแบ่งโซนราคาถูก (Discount), ราคากลาง (Equilibrium) และราคาแพง (Premium)
* **renderStrongWeakLevels(levels, currentTime)**: ระบุและวาดเส้นราคาสูงสุด/ต่ำสุดที่แข็งแกร่งหรืออ่อนแอตามโครงสร้างปัจจุบัน
* **clear()**: ล้างการวาดภาพ SMC ทั้งหมดออกจากกราฟเพื่อเตรียมการวาดใหม่หรือปิดการแสดงผล

---

### 2. การเรียกใช้ฟังก์ชันและตัวแปรภายนอก (External Dependencies)
ไฟล์นี้ทำหน้าที่เป็น Interface ระหว่าง Logic และ UI:

* **LightweightCharts (v4.2+)**: เรียกใช้ API ของกราฟ เช่น `createPriceLine`, `setMarkers` และการจัดการ `Series`
* **SMCIndicator Results**: ต้องการ Data Object ที่ประมวลผลเสร็จแล้วจากไฟล์ `SMCIndicator.js`
* **Custom Plugins**: รองรับการใช้ `BackgroundColorZonesPlugin` (ถ้ามี) เพื่อวาดแถบสีพื้นหลังในโซน Premium/Discount

---

### 3. คุณสมบัติหลัก (Key Features)
* **High-Fidelity Visualization**: เปลี่ยนข้อมูลตัวเลขที่ซับซ้อนของ SMC ให้กลายเป็นเส้นและโซนสีที่ดูง่ายบนกราฟเทคนิค
* **Dynamic Update**: รองรับการอัปเดตแบบเรียลไทม์ เมื่อราคาขยับและโครงสร้างเปลี่ยน Renderer จะขยับเส้นตามทันที
* **Mitigation Awareness**: ระบบจะหยุดวาดหรือจางสีของ Order Blocks และ FVG เมื่อราคาได้วิ่งเข้ามาเติมเต็มโซนนั้นแล้ว
* **Professional Aesthetics**: มีการตั้งค่าสีพื้นฐาน (Default Colors) ที่ดูสบายตา และสามารถปรับแต่งความโปร่งใส (Opacity) ของโซนต่างๆ ได้
* **Clean Code Architecture**: แยกส่วนการคำนวณ (Indicator) ออกจากการวาดภาพ (Renderer) ชัดเจน ทำให้ง่ายต่อการบำรุงรักษาโค้ด