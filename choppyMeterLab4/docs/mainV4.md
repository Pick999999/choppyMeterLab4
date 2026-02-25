# 🚀 mainV4.md - ไฟล์ควบคุมหลัก (Main Application Logic V4)

### 1. รายการฟังก์ชันทั้งหมด (Function Summary)
สรุปการทำงานของฟังก์ชันภายในอ็อบเจกต์ `appV4`:

* **init()**: เริ่มต้นแอปพลิเคชัน, โหลดการตั้งค่าจาก LocalStorage, สร้างแผนภูมิ (Charts) สำหรับทุกสินทรัพย์ และเริ่มวงจรการอัปเดตข้อมูล
* **createChart(containerId, asset)**: สร้างอินสแตนซ์ของ LightweightCharts สำหรับแต่ละสินทรัพย์ พร้อมตั้งค่า UI และ Series (Candlesticks, EMA, SMC)
* **refreshAll()**: สั่งการให้ทุกแผนภูมิอัปเดตข้อมูลใหม่พร้อมกัน โดยเรียกผ่านระบบคิวเพื่อป้องกันการทำงานหนักเกินไป
* **updateChart(asset)**: ดึงข้อมูลราคาล่าสุดจาก API, คำนวณอินดิเคเตอร์ผ่าน `AnalysisGenerator` และวาดโครงสร้างตลาดด้วย `SMCIndicator`
* **drawSMC(chart, data)**: นำผลลัพธ์จาก SMCIndicator มาวาดลงบนกราฟ ทั้งเส้น BOS, CHoCH และกล่อง Order Blocks/FVG
* **loadSettings() / saveSettings()**: จัดการการบันทึกและโหลดค่าคอนฟิกต่างๆ เช่น ค่า Period ของอินดิเคเตอร์ หรือสีของเส้น EMA
* **updateGlobalStats()**: คำนวณสถิติรวมของทุกสินทรัพย์เพื่อหาตัวที่ "Choppy" หรือเป็นเทรนด์แรงที่สุดเพื่อแสดงในตารางสรุป
* **handleResize()**: ปรับขนาดของแผนภูมิทุกตัวให้พอดีกับหน้าจอโดยอัตโนมัติเมื่อมีการเปลี่ยนขนาดหน้าต่างเบราว์เซอร์

---

### 2. การเรียกใช้ฟังก์ชันและตัวแปรภายนอก (External Dependencies)
ไฟล์นี้เป็นศูนย์กลางที่รวบรวมโมดูลอื่นๆ เข้าด้วยกัน:

* **LightweightCharts**: ใช้ไลบรารีหลักในการวาดกราฟเทคนิค
* **DerivAPI**: เรียกใช้เพื่อดึงข้อมูล History และ Real-time Ticks จาก Server
* **Indicators / AnalysisGenerator**: ส่งข้อมูลแท่งเทียนไปคำนวณ EMA, RSI, ADX และ Choppy Index
* **SMCIndicator**: เรียกใช้คลาส SMC เพื่อวิเคราะห์จุดกลับตัวและโครงสร้างราคาระดับสถาบัน
* **Lucide Icons**: ใช้แสดงไอคอนต่างๆ บน Dashboard ให้สวยงาม

---

### 3. คุณสมบัติหลัก (Key Features)
* **Multi-Asset Monitoring**: ความสามารถในการเฝ้าดู 8-10 สินทรัพย์ (Volatility Indexes) ได้พร้อมกันในหน้าเดียว
* **Integrated SMC Visualizer**: แสดงผลโครงสร้าง Smart Money Concepts (BOS, CHoCH, OB) แบบอัตโนมัติบนกราฟ
* **Smart Refresh System**: มีระบบจัดการการดึงข้อมูลที่ไม่ทำให้ Browser ค้าง แม้จะโหลดข้อมูลจำนวนมากพร้อมกัน
* **Dynamic Customization**: ผู้ใช้สามารถปรับเปลี่ยนสีเส้น EMA และตั้งค่าอินดิเคเตอร์ได้สดๆ จากหน้าเว็บ
* **State Persistence**: ระบบจำค่าที่ผู้ใช้ตั้งไว้ได้ถาวรผ่าน LocalStorage ไม่ต้องตั้งค่าใหม่ทุกครั้งที่รีเฟรชหน้าจอ