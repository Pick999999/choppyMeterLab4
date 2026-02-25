# 🧪 choppiness-indexV3.md - ระบบทดลองกลยุทธ์และวิเคราะห์ความผันผวน (Lab & Analysis V3)

### 1. รายการฟังก์ชันทั้งหมด (Function Summary)
สรุปการทำงานของฟังก์ชันหลักในไฟล์ `choppiness-indexV3.js`:

* **initCharts()**: เริ่มต้นสร้างกราฟหลัก (Main Chart) และกราฟรองสำหรับอินดิเคเตอร์ (CI, ADX) พร้อมตั้งค่า Layout และความสวยงาม
* **connectWS()**: จัดการการเชื่อมต่อ WebSocket กับ Deriv เพื่อดึงข้อมูลราคาแบบ Real-time และจัดการ Reconnection เมื่อการเชื่อมต่อหลุด
* **generateAnalysis()**: ฟังก์ชันหัวใจหลักที่สั่งให้ `AnalysisGenerator` ประมวลผลข้อมูลแท่งเทียน เพื่อสร้างสถิติและระบุสถานะของตลาดในแต่ละช่วงเวลา
* **updateIndicators()**: อัปเดตการวาดเส้นอินดิเคเตอร์ทั้งหมดบนกราฟ (EMA 3 เส้น, Bollinger Bands, CI, ADX)
* **createCrossoverZones(analysisArray)**: (Helper) วิเคราะห์ช่วงเวลาที่เกิดเทรนด์ (Up/Down) และสร้าง "โซนสีพื้นหลัง" เพื่อให้มองเห็นรอบการวิ่งของราคาได้ง่าย
* **enableCrossoverZones() / clearBackgroundZones()**: ควบคุมการเปิด/ปิดการแสดงผลสีพื้นหลังบนกราฟแท่งเทียน
* **updateTooltip(param)**: ระบบแสดงผลข้อมูลแบบ Dynamic เมื่อผู้ใช้เลื่อนเมาส์ไปบนกราฟ (แสดงค่าราคา, EMA, CI, ADX และสถานะแท่งเทียน)
* **applyIndicatorsToChart()**: รับค่าจากหน้า UI (Settings) มาคำนวณและวาดใหม่ทันทีโดยไม่ต้องรีโหลดหน้าเว็บ
* **addCustomMarker(time, text, color)**: ฟังก์ชันสำหรับวางเครื่องหมาย (Markers) ลงบนกราฟเพื่อบันทึกจุดสำคัญในการเทรด

---

### 2. การเรียกใช้ฟังก์ชันและตัวแปรภายนอก (External Dependencies)
ไฟล์นี้เป็นศูนย์รวมการแสดงผล (Visual Hub) ที่เรียกใช้หลายส่วนประกอบ:

* **LightweightCharts**: ใช้ API `createChart` และโมดูลเสริม `BackgroundColorZonesPlugin` สำหรับการวาดโซนสี
* **AnalysisGenerator**: เรียกใช้คลาสวิเคราะห์เพื่อประมวลผลข้อมูลแท่งเทียนดิบให้เป็นข้อมูลเชิงสถิติ
* **Indicators Library**: เรียกใช้สูตรคำนวณมาตรฐาน (SMA, EMA, RSI, ATR)
* **Deriv WebSocket**: เชื่อมต่อโดยตรงกับ `wss://ws.derivws.com/websockets/v3` เพื่อดึงข้อมูลตลาด

---

### 3. คุณสมบัติหลัก (Key Features)
* **Triple Chart Syncing**: ระบบแสดงผล 3 จอพร้อมกัน (Price, CI, ADX) ที่เลื่อนขยับตามกัน (Synchronized Scrolling)
* **Visual Trend Zones**: ระบบระบายสีพื้นหลังตามเทรนด์ (Green=Bullish, Red=Bearish) ช่วยให้แยกแยะสภาวะตลาดได้ในทันที
* **Interactive Lab Environment**: ออกแบบมาให้เป็นห้องทดลอง (Lab) ที่ผู้ใช้สามารถปรับจูนค่า Period และดูผลลัพธ์ย้อนหลังได้ทันที
* **Comprehensive Tooltip**: แสดงรายละเอียดเชิงลึกของแท่งเทียนแต่ละแท่ง รวมถึง "รหัสสถานะแท่งเทียน" (Status Candle Code)
* **Real-time Feedback**: อัปเดตราคาและอินดิเคเตอร์แบบวินาทีต่อวินาที พร้อมระบบจัดการ Marker เพื่อช่วยในการวิเคราะห์จุดเข้า/ออก