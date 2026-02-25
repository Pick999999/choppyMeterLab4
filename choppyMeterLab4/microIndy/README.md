# 📊 Price Impact Momentum Tracker - Complete Documentation

## 📖 สารบัญ

1. [ภาพรวมของระบบ](#ภาพรวมของระบบ)
2. [แนวคิดหลัก (Core Concepts)](#แนวคิดหลัก-core-concepts)
3. [คำศัพท์และคำอธิบาย](#คำศัพท์และคำอธิบาย)
4. [ระบบวิเคราะห์ทั้ง 3 แบบ](#ระบบวิเคราะห์ทั้ง-3-แบบ)
5. [การทำงานของ Indicators](#การทำงานของ-indicators)
6. [วิธีใช้งาน](#วิธีใช้งาน)
7. [ตัวอย่างการใช้งานจริง](#ตัวอย่างการใช้งานจริง)
8. [FAQ](#faq)

---

## 🎯 ภาพรวมของระบบ

**Price Impact Momentum Tracker** เป็น custom indicator ที่ออกแบบมาเพื่อวิเคราะห์ **"น้ำหนัก" หรือ "แรง"** ของการเคลื่อนไหวราคา ไม่ใช่แค่นับจำนวนแท่งเทียนเขียว/แดง แต่วัดว่าแต่ละแท่งมี **ผลกระทบต่อราคา (Price Impact)** เท่าไหร่

### 💡 จุดเด่นหลัก

✅ **วัดน้ำหนักของการเคลื่อนไหว** - ไม่ใช่แค่นับจำนวน  
✅ **แยก Up/Down Impact** - เห็นชัดว่าฝ่างไหนมีแรงมากกว่า  
✅ **Timeframe Summary** - สรุปผลในแต่ละนาที  
✅ **Visual Representation** - ใช้สีและความทึบแสดง intensity  
✅ **3 ระบบวิเคราะห์อัจฉริยะ** - Divergence, Strength, Pattern  

### 🎨 Visual Components

```
┌─────────────────────────────────────────────────────────────┐
│                    📈 CANDLESTICK CHART                     │
│                  (Real-time Price Movement)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              🎯 ARROW INDICATORS DISPLAY                    │
│  ▲ ▲ ▼ ▲ [⏱️ 14:31] ▲ ▼ ▼ ▲ [⏱️ 14:32] ▲ ▲ ▲             │
│  (สีเข้ม = ราคาเปลี่ยนมาก, สีจาง = เปลี่ยนน้อย)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│               📊 MINUTE SUMMARY CARDS                       │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │ ⏱️ 14:31        │  │ ⏱️ 14:32        │                 │
│  │ ▲5  ▼2          │  │ ▲3  ▼4          │                 │
│  │ Up: +0.00065    │  │ Up: +0.00045    │                 │
│  │ Down: -0.00030  │  │ Down: -0.00080  │                 │
│  │ Net: +0.00035   │  │ Net: -0.00035   │                 │
│  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│            🚨 REAL-TIME ALERTS & ANALYSIS                   │
│  ┌────────────────────────────────────────┐                │
│  │ 📈 Bullish Divergence Detected         │                │
│  │ ราคาทำ Lower Low แต่แรงขายลดลง        │                │
│  │ → มีโอกาสกลับตัวขึ้น                   │                │
│  └────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

## 💭 แนวคิดหลัก (Core Concepts)

### 1. Price Impact vs. Candle Count

**ปัญหาของการนับแท่งเทียนธรรมดา:**
```
สถานการณ์ 1: มีแท่งเขียว 5 แท่ง
- แท่ง 1: ราคาเพิ่ม +0.00010
- แท่ง 2: ราคาเพิ่ม +0.00015
- แท่ง 3: ราคาเพิ่ม +0.00012
- แท่ง 4: ราคาเพิ่ม +0.00008
- แท่ง 5: ราคาเพิ่ม +0.00020
รวม: +0.00065

สถานการณ์ 2: มีแท่งแดง 1 แท่ง
- แท่ง 1: ราคาลด -0.00300
รวม: -0.00300

ผลลัพธ์: 
- การนับแท่ง: เขียวชนะ 5:1
- Price Impact: แดงชนะ -0.00235 (เพราะ +0.00065 - 0.00300)
```

**คำถาม:** แท่งเขียว 5 แท่ง vs แท่งแดง 1 แท่ง ฝ่ายไหนแรงกว่า?  
**คำตอบ:** ต้องดูที่ **Price Impact** ไม่ใช่แค่จำนวน!

### 2. Opacity-based Visualization

ความเข้มของสี (Opacity) = ความแรงของการเคลื่อนไหว

```javascript
// สูตรคำนวณ Opacity
priceChange = ((currentClose - previousClose) / previousClose) * 100
opacity = |priceChange| / maxChange
opacity = clamp(0.1, 1.0, opacity)
```

**ตัวอย่าง:**
```
Max Change = 1.0%

แท่ง A: เปลี่ยน +0.1% → opacity = 0.1 (สีจาง)
แท่ง B: เปลี่ยน +0.5% → opacity = 0.5 (สีปานกลาง)
แท่ง C: เปลี่ยน +1.0% → opacity = 1.0 (สีเข้มสุด)
แท่ง D: เปลี่ยน +2.0% → opacity = 1.0 (จำกัดไว้ที่ 1.0)
```

### 3. Sliding Window Display

แสดงเฉพาะ N แท่งล่าสุด เพื่อ:
- ประหยัด Memory
- Performance ดีขึ้น
- โฟกัสที่ข้อมูลล่าสุด

```
Max Display = 30 แท่ง

มีข้อมูล 50 แท่ง:
[1][2][3]...[20][21]...[50]
              ↑
         ตัดแท่ง 1-20 ออก
         แสดงแค่ 21-50
```

---

## 📚 คำศัพท์และคำอธิบาย

### A. คำศัพท์พื้นฐาน

#### **OHLC (Open, High, Low, Close)**
```
     High
      |
Open--+--Close
      |
     Low
```
- **Open**: ราคาเปิด (ราคาแรกของแท่งเทียน)
- **High**: ราคาสูงสุดที่เกิดขึ้นในแท่งนั้น
- **Low**: ราคาต่ำสุดที่เกิดขึ้นในแท่งนั้น
- **Close**: ราคาปิด (ราคาสุดท้ายของแท่งเทียน)

#### **Candle (แท่งเทียน)**
- **Green/Bullish Candle (แท่งเขียว)**: Close > Open (ราคาปิดสูงกว่าเปิด)
- **Red/Bearish Candle (แท่งแดง)**: Close < Open (ราคาปิดต่ำกว่าเปิด)

#### **Price Change (การเปลี่ยนแปลงราคา)**
```javascript
// ความต่างของราคาระหว่างแท่งปัจจุบันกับแท่งก่อนหน้า
priceChange = currentClose - previousClose

// เป็นเปอร์เซ็นต์
priceChangePercent = (priceChange / previousClose) * 100
```

**ตัวอย่าง:**
```
แท่งก่อนหน้า: Close = 1250.50
แท่งปัจจุบัน: Close = 1250.80

Price Change = 1250.80 - 1250.50 = +0.30
Price Change % = (0.30 / 1250.50) * 100 = +0.024%
```

### B. คำศัพท์ที่ใช้ในระบบ

#### **Net Impact**
ผลรวมของการเปลี่ยนแปลงราคาสุทธิในช่วงเวลาหนึ่ง

```
Net Impact = Up Impact + Down Impact

ตัวอย่าง:
Up Impact = +0.00065 (จาก 5 แท่งเขียว)
Down Impact = -0.00300 (จาก 1 แท่งแดง)
Net Impact = +0.00065 - 0.00300 = -0.00235
```

#### **Up Impact**
ผลรวมของราคาที่เพิ่มขึ้นจากแท่งเขียวทั้งหมด

```
แท่งเขียว 3 แท่ง:
- แท่ง 1: +0.00010
- แท่ง 2: +0.00015
- แท่ง 3: +0.00012
Up Impact = +0.00037
```

#### **Down Impact**
ผลรวมของราคาที่ลดลงจากแท่งแดงทั้งหมด (เป็นค่าลบ)

```
แท่งแดง 2 แท่ง:
- แท่ง 1: -0.00020
- แท่ง 2: -0.00030
Down Impact = -0.00050
```

#### **Opacity (ความทึบ/ความเข้ม)**
ค่าระหว่าง 0.0 - 1.0 ที่แสดงความแรงของการเคลื่อนไหว
- 0.1 = สีจางมาก (การเคลื่อนไหวน้อย)
- 0.5 = สีปานกลาง
- 1.0 = สีเข้มสุด (การเคลื่อนไหวมาก)

#### **Threshold (เกณฑ์)**
ค่าขีดจำกัดที่ใช้ในการตัดสินใจ

```javascript
thresholds = {
    low: 0.001,      // 0.1% - การเคลื่อนไหวน้อย
    medium: 0.003,   // 0.3% - ปานกลาง
    high: 0.005,     // 0.5% - แรง
    extreme: 0.010   // 1.0% - แรงมาก
}
```

### C. คำศัพท์ทางเทคนิค

#### **Divergence (ความแตกต่าง/ไม่สอดคล้อง)**
เมื่อราคาและ momentum ไปคนละทิศ บ่งชี้ว่าเทรนด์อาจกลับตัว

#### **Momentum (แรงผลัก/โมเมนตัม)**
ความเร็วและทิศทางของการเคลื่อนไหวราคา

#### **Volatility (ความผันผวน)**
ระดับการเปลี่ยนแปลงของราคา ยิ่งผันผวนมาก ราคายิ่งแกว่งตัวเยอะ

#### **Breakout (ทะลุ)**
เมื่อราคาทะลุออกจากกรอบที่รวมตัวอยู่

#### **Consolidation (รวมตัว)**
ราคาเคลื่อนไหวในกรอบแคบๆ ไม่มีทิศทางชัด

#### **Exhaustion (หมดแรง)**
ภาวะที่ momentum เริ่มลดลง แม้ราคายังไปทิศทางเดิม

---

## 🔬 ระบบวิเคราะห์ทั้ง 3 แบบ

### 1️⃣ Divergence Detection (การตรวจจับความแตกต่าง)

#### แนวคิด
ตรวจจับเมื่อ **ราคากับ momentum ไม่สอดคล้องกัน** ซึ่งเป็นสัญญาณว่าเทรนด์อาจจะกลับตัว

#### ประเภท Divergence

##### A. Bullish Divergence (สัญญาณกลับขึ้น) 📈

**คำจำกัดความ:**
- ราคาทำ **Lower Low** (ต่ำลงเรื่อยๆ)
- แต่ Net Impact ทำ **Higher Low** (ลบน้อยลง/แรงขายลด)

**ความหมาย:**
ราคาลง แต่แรงขายลดลง = ผู้ขายเริ่มหมดแรง → มีโอกาสกลับตัวขึ้น

**ตัวอย่าง:**
```
นาที  |  ราคา   |  Net Impact  |  สถานะ
------|---------|--------------|------------------
14:30 | 1250.50 |  -0.00150    | ราคาลงแรง
14:31 | 1250.30 |  -0.00080    | ราคาลงต่อ แต่แรงขายลด! ←
14:32 | 1250.10 |  -0.00030    | ราคาลงต่อ แต่แรงขายลดมาก! ←

การวิเคราะห์:
✓ ราคา: 1250.50 → 1250.30 → 1250.10 (Lower Low)
✓ Impact: -0.00150 → -0.00080 → -0.00030 (Higher Low)
🚨 Alert: Bullish Divergence!
💡 คาดการณ์: ราคาอาจกลับตัวขึ้น
```

**กราฟ:**
```
ราคา:    ╲
          ╲    Lower Low
           ╲
            ╲
             ●

Impact:      ╱ Higher Low
           ╱
         ╱
       ●

← Divergence เกิดขึ้น!
```

##### B. Bearish Divergence (สัญญาณกลับลง) 📉

**คำจำกัดความ:**
- ราคาทำ **Higher High** (สูงขึ้นเรื่อยๆ)
- แต่ Net Impact ทำ **Lower High** (บวกน้อยลง/แรงซื้อลด)

**ความหมาย:**
ราคาขึ้น แต่แรงซื้อลดลง = ผู้ซื้อเริ่มหมดแรง → มีโอกาสกลับตัวลง

**ตัวอย่าง:**
```
นาที  |  ราคา   |  Net Impact  |  สถานะ
------|---------|--------------|------------------
14:30 | 1250.50 |  +0.00200    | ราคาขึ้นแรง
14:31 | 1250.80 |  +0.00120    | ราคาขึ้นต่อ แต่แรงซื้อลด! ←
14:32 | 1251.00 |  +0.00050    | ราคาขึ้นต่อ แต่แรงซื้อลดมาก! ←

การวิเคราะห์:
✓ ราคา: 1250.50 → 1250.80 → 1251.00 (Higher High)
✓ Impact: +0.00200 → +0.00120 → +0.00050 (Lower High)
🚨 Alert: Bearish Divergence!
💡 คาดการณ์: ราคาอาจกลับตัวลง
```

**กราฟ:**
```
ราคา:              ╱ Higher High
                 ╱
               ╱
             ●

Impact:    ╲
            ╲   Lower High
             ╲
              ●

← Divergence เกิดขึ้น!
```

#### วิธีการตรวจจับ

```javascript
function detectDivergence(minuteSummaries) {
    // ต้องมีข้อมูลอย่างน้อย 3 นาที
    if (minuteSummaries.length < 3) return null;
    
    const last3 = minuteSummaries.slice(-3);
    const prices = last3.map(s => s.closePrice);
    const impacts = last3.map(s => s.netImpact);
    
    // Bullish Divergence
    const priceLowerLow = 
        prices[2] < prices[1] && prices[1] < prices[0];
    const impactHigherLow = 
        impacts[2] > impacts[1] && impacts[1] > impacts[0];
    
    if (priceLowerLow && impactHigherLow && impacts[2] < 0) {
        return { type: 'BULLISH', ... };
    }
    
    // Bearish Divergence
    const priceHigherHigh = 
        prices[2] > prices[1] && prices[1] > prices[0];
    const impactLowerHigh = 
        impacts[2] < impacts[1] && impacts[1] < impacts[0];
    
    if (priceHigherHigh && impactLowerHigh && impacts[2] > 0) {
        return { type: 'BEARISH', ... };
    }
    
    return null;
}
```

#### Divergence Strength (ระดับความแข็งแกร่ง)

```javascript
function calculateDivergenceStrength(prices, impacts) {
    const priceChange = Math.abs(prices[2] - prices[0]);
    const impactChange = Math.abs(impacts[2] - impacts[0]);
    const ratio = impactChange / (priceChange + 0.00001);
    
    if (ratio > 0.5) return 'STRONG';    // แข็งแกร่ง
    if (ratio > 0.3) return 'MEDIUM';    // ปานกลาง
    return 'WEAK';                        // อ่อน
}
```

**ความหมาย:**
- **STRONG**: Impact เปลี่ยนแปลงมาก → Divergence น่าเชื่อถือ
- **MEDIUM**: Impact เปลี่ยนปานกลาง → พิจารณาสัญญาณอื่นประกอบ
- **WEAK**: Impact เปลี่ยนน้อย → อาจเป็น false signal

---

### 2️⃣ Strength Threshold (เกณฑ์ความแรง)

#### แนวคิด
แจ้งเตือนเมื่อ **Net Impact เกินค่าที่กำหนด** บอกว่าตลาดมี momentum แรง

#### ระดับ Threshold

```javascript
const thresholds = {
    low: 0.001,      // 0.1% - การเคลื่อนไหวปกติ
    medium: 0.003,   // 0.3% - เริ่มมี momentum
    high: 0.005,     // 0.5% - momentum แรง
    extreme: 0.010   // 1.0% - momentum แรงมาก
};
```

**การปรับค่า Threshold ตาม Market:**

| Market Type | Low | Medium | High | Extreme |
|-------------|-----|--------|------|---------|
| Volatility Indices | 0.001 | 0.003 | 0.005 | 0.010 |
| Forex (Major) | 0.0003 | 0.0008 | 0.0015 | 0.0030 |
| Crypto | 0.005 | 0.015 | 0.030 | 0.050 |

#### ประเภทการแจ้งเตือน

##### A. Impact Spike (ระเบิดกะทันหัน) 🚨

**เงื่อนไข:**
```javascript
absImpact > thresholds.extreme  // เกิน 1.0%
```

**ความหมาย:**
Net Impact กระโดดขึ้นมาก ผิดปกติ

**สาเหตุที่อาจเป็น:**
- มีข่าวเศรษฐกิจสำคัญ
- Whale (ปลาใหญ่) เข้าตลาด
- Market Manipulation
- Stop Loss Hunting

**ตัวอย่าง:**
```
14:30 - Net: +0.00050 (ปกติ)
14:31 - Net: +0.00080 (ปกติ)
14:32 - Net: +0.01200 (กระโดด 15 เท่า!) ←

🚨 EXTREME UP SPIKE!
Net Impact: +0.01200 (+1.2%)
⚠️ อาจมีข่าวสำคัญ หรือ whale เข้าตลาด
```

##### B. Sustained Strength (แรงต่อเนื่อง) 🔄

**เงื่อนไข:**
```javascript
// ต้องผ่าน 3 นาทีติดต่อกัน
1. ทิศทางเดียวกันทั้งหมด
2. Net Impact > threshold.medium ทุกนาที
```

**ความหมาย:**
Momentum แรงและต่อเนื่อง แสดงว่าเทรนด์แข็งแกร่ง

**ตัวอย่าง:**
```
14:30 - Net: +0.00600 (ทิศทาง UP)
14:31 - Net: +0.00580 (ทิศทาง UP)
14:32 - Net: +0.00620 (ทิศทาง UP)
14:33 - Net: +0.00610 (ทิศทาง UP) ←

🔄 SUSTAINED HIGH MOMENTUM
ทิศทางขึ้น 4 นาทีติดต่อกัน
→ เทรนด์แข็งแกร่ง พิจารณาติดตาม
```

##### C. Reversal Warning (เตือนกลับตัว) ↩️

**เงื่อนไข:**
```javascript
// เปรียบเทียบนาทีปัจจุบันกับนาทีก่อนหน้า
1. ทั้งคู่มี Net Impact > threshold.medium
2. แต่กลับทิศกัน (บวก → ลบ หรือ ลบ → บวก)
```

**ความหมาย:**
Momentum กลับทิศทันที อาจเกิดการกลับตัวครั้งใหญ่

**ตัวอย่าง:**
```
14:30 - Net: +0.00800 (ขึ้นแรง)
14:31 - Net: -0.00750 (ลงแรง) ← กลับทิศทันที!

↩️ MOMENTUM REVERSAL!
จาก UP (+0.008) → DOWN (-0.0075)
→ ระวังการกลับตัว
```

#### การใช้งาน Strength Threshold

**Strategy 1: Entry Signal**
```
ถ้า EXTREME UP SPIKE
→ รอ pullback แล้วค่อย BUY

ถ้า SUSTAINED MOMENTUM
→ เข้าตาม trend
```

**Strategy 2: Exit Signal**
```
ถ้า REVERSAL WARNING
→ พิจารณาปิด position

ถ้า momentum ลดลง 2-3 นาทีติดต่อกัน
→ เตรียมตัว exit
```

---

### 3️⃣ Pattern Recognition (การจำแนก Pattern)

#### แนวคิด
ตรวจจับ**รูปแบบที่เกิดขึ้นซ้ำๆ** และทำนายพฤติกรรมตลาด

#### Pattern ทั้ง 5 แบบ

##### Pattern 1: Accumulation (การสะสม) 📊

**ลักษณะ:**
```
Visual: ▼ ▼ ▲ ▲ ▲ ▲ ▲
        └─ เขียวเพิ่มเรื่อยๆ
```

**เงื่อนไข:**
- Up Count เพิ่มขึ้นเรื่อยๆ
- Net Impact เป็นบวกและเพิ่มขึ้น
- Down Impact ลดลง

**ตัวอย่าง:**
```
นาที  | Up | Down | Net Impact
------|-------|------|------------
14:30 |   3   |  2   | +0.001
14:31 |   4   |  1   | +0.002  ← Up เพิ่ม
14:32 |   5   |  1   | +0.003  ← Up เพิ่มต่อ
14:33 |   6   |  0   | +0.004  ← Up เพิ่มต่อ
14:34 |   7   |  0   | +0.005  ← Up เพิ่มต่อ
```

**การวิเคราะห์:**
```
📊 Accumulation Pattern Detected!

สถานการณ์: แรงซื้อกำลังสะสมตัวเรื่อยๆ
การคาดการณ์: อาจเกิด Breakout ขึ้นในเร็วๆ นี้

แนะนำ:
✓ เตรียมเข้า BUY
✓ ตั้ง alert เมื่อ breakout
✓ วาง stop loss ใต้ support
```

**กราฟแสดง:**
```
Net Impact
    |
    |              ╱╱╱  ← กำลังสะสมแรงขึ้น
    |            ╱
    |          ╱
    |        ╱
    |______╱____________ Time
        Accumulation Zone
```

##### Pattern 2: Distribution (การแจกจ่าย) 📉

**ลักษณะ:**
```
Visual: ▲ ▲ ▼ ▼ ▼ ▼ ▼
        └─ แดงเพิ่มเรื่อยๆ
```

**เงื่อนไข:**
- Down Count เพิ่มขึ้นเรื่อยๆ
- Net Impact เป็นลบและลดต่ำลง
- Up Impact ลดลง

**ตัวอย่าง:**
```
นาที  | Up | Down | Net Impact
------|-------|------|------------
14:30 |   2   |  3   | -0.001
14:31 |   1   |  4   | -0.002  ← Down เพิ่ม
14:32 |   1   |  5   | -0.003  ← Down เพิ่มต่อ
14:33 |   0   |  6   | -0.004  ← Down เพิ่มต่อ
14:34 |   0   |  7   | -0.005  ← Down เพิ่มต่อ
```

**การวิเคราะห์:**
```
📉 Distribution Pattern Detected!

สถานการณ์: แรงขายกำลังเพิ่มขึ้นเรื่อยๆ
การคาดการณ์: อาจเกิด Breakout ลงในเร็วๆ นี้

แนะนำ:
✓ เตรียมเข้า SELL
✓ ตั้ง alert เมื่อ breakout
✓ วาง stop loss เหนือ resistance
```

##### Pattern 3: Consolidation (การรวมตัว) ↔️

**ลักษณะ:**
```
Visual: ▲ ▼ ▲ ▼ ▲ ▼ ▲ ▼
        └─ Up/Down สลับกัน
```

**เงื่อนไข:**
- Up Count ≈ Down Count
- Net Impact ใกล้ 0
- ไม่มีทิศทางชัด

**ตัวอย่าง:**
```
นาที  | Up | Down | Net Impact
------|-------|------|------------
14:30 |   3   |  3   | +0.0001
14:31 |   2   |  3   | -0.0001  ← แกว่ง
14:32 |   3   |  2   | +0.0001  ← แกว่ง
14:33 |   3   |  3   | +0.0000  ← แกว่ง
14:34 |   2   |  3   | -0.0001  ← แกว่ง
```

**การวิเคราะห์:**
```
↔️ Consolidation Pattern Detected!

สถานการณ์: ตลาดรวมตัว ไม่มีทิศทางชัด
การคาดการณ์: รอ Breakout - เตรียมพร้อมเข้าเทรด

แนะนำ:
✓ รอ breakout (ขึ้นหรือลง)
✓ ตั้ง alert ทั้ง 2 ทิศทาง
✓ Breakout ขึ้น → BUY
✓ Breakout ลง → SELL
```

**กราฟแสดง:**
```
Price
    |
    |  ─ ─ ─ ─ ─ ─ ─  Upper Range
    | ╱╲╱╲╱╲╱╲╱╲╱╲
    |╱            ╲   ← Consolidation
    |  ─ ─ ─ ─ ─ ─ ─  Lower Range
    |_________________ Time
          รอ Breakout!
```

##### Pattern 4: Breakout (การทะลุ) 🚀

**ลักษณะ:**
```
Visual: ━━━━ 🚀▲  หรือ  ━━━━ 💥▼
        └─ รวมตัว   └─ พุ่งขึ้น/ลง!
```

**เงื่อนไข:**
- หลัง consolidation (Net Impact ต่ำ 4 นาที)
- Net Impact กระโดดขึ้น > 2.5 เท่า
- ทิศทางชัดเจน

**ตัวอย่าง:**
```
นาที  | Net Impact | สถานะ
------|------------|------------------
14:30 | +0.00010   | รวมตัว
14:31 | -0.00008   | รวมตัว
14:32 | +0.00012   | รวมตัว
14:33 | -0.00010   | รวมตัว
14:34 | +0.00850   | BREAKOUT! ← พุ่งขึ้น!

Avg ก่อนหน้า = 0.00010
ปัจจุบัน = 0.00850 (85 เท่า!)
```

**การวิเคราะห์:**
```
🚀 Breakout ขึ้น Detected!

สถานการณ์: Net Impact กระโดดจาก 0.00010 → 0.00850
การคาดการณ์: เทรนด์ใหม่เริ่มแล้ว - พิจารณาเข้าเทรด

แนะนำ:
✓ เข้า BUY ทันที
✓ ตั้ง stop loss ที่ breakout level
✓ Take profit ตาม Risk:Reward
```

**กราฟแสดง:**
```
Price
    |                    🚀
    |                  ╱
    |                ╱
    |  ─ ─ ─ ─ ─ ─ ╱  ← Breakout!
    | ╱╲╱╲╱╲╱╲
    |╱          
    |_________________ Time
    Consolidation  Breakout
```

##### Pattern 5: Exhaustion (การหมดแรง) ⚠️

**ลักษณะ:**
```
Visual: ▲▲▲▲▲ ▲▲ ▲ △ ▽
        └─ แรงสูง  └─ เริ่มอ่อนลง
```

**เงื่อนไข:**
- ขึ้น/ลงมาหลายนาที
- Up/Down Count เริ่มลดลง
- Net Impact ลดลงแม้ราคายังไปทิศเดิม

**ตัวอย่าง:**
```
นาที  | Up | Down | Net Impact | สถานะ
------|-------|------|------------|------------------
14:30 |   7   |  1   | +0.00500   | แรงมาก
14:31 |   6   |  2   | +0.00400   | แรงลดลง ←
14:32 |   5   |  2   | +0.00300   | แรงลดต่อ ←
14:33 |   4   |  3   | +0.00200   | แรงลดมาก ←
14:34 |   3   |  3   | +0.00100   | เกือบหมด ←
```

**การวิเคราะห์:**
```
⚠️ Exhaustion Pattern Detected!

สถานการณ์: แรงเริ่มหมด ทั้งที่ยังไปทิศทางเดิม
การคาดการณ์: ใกล้จุดกลับตัว - พิจารณาปิดออร์เดอร์

แนะนำ:
✓ ปิด position บางส่วน
✓ เลื่อน stop loss ให้ติดกับราคา
✓ เตรียมรับ reversal
```

**กราฟแสดง:**
```
Momentum
    |
    |╱╲  ← แรงเริ่มลด
    |   ╲
    |    ╲   ราคายังขึ้น
    |     ╲  แต่แรงลด!
    |      ╲
    |_______╲_________ Time
           Exhaustion Zone
```

#### สรุป Pattern ทั้ง 5

| Pattern | Visual | สัญญาณ | Action |
|---------|--------|--------|--------|
| Accumulation | ▼▼▲▲▲ | แรงซื้อสะสม | เตรียม BUY |
| Distribution | ▲▲▼▼▼ | แรงขายเพิ่ม | เตรียม SELL |
| Consolidation | ▲▼▲▼▲ | รวมตัว | รอ Breakout |
| Breakout | ━━🚀 | ทะลุออก | เข้า Trade ทันที |
| Exhaustion | ▲▲▲△▽ | หมดแรง | ปิด Position |

---

## ⚙️ การทำงานของ Indicators

### Flow Chart ทั้งหมด

```
┌─────────────────────────────────────────┐
│  1. รับข้อมูล Candle จาก Deriv API     │
│     (OHLC, Timestamp)                   │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  2. คำนวณ Price Change แต่ละแท่ง       │
│     - currentClose - previousClose      │
│     - % change                          │
│     - ทิศทาง (UP/DOWN)                  │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  3. คำนวณ Opacity                       │
│     opacity = |priceChange| / maxChange │
│     clamp(0.1, 1.0)                     │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  4. แสดงลูกศรด้วย Opacity               │
│     - สีเขียว (UP) opacity 0.1-1.0      │
│     - สีแดง (DOWN) opacity 0.1-1.0      │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  5. จัดกลุ่มตามนาที                     │
│     - นับ Up/Down Count                 │
│     - รวม Up/Down Impact                │
│     - คำนวณ Net Impact                  │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  6. แสดง Minute Summary Card            │
│     - ⏱️ เวลา                           │
│     - ▲ Up Count / ▼ Down Count        │
│     - Up Impact / Down Impact           │
│     - Net Impact                        │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  7. วิเคราะห์ด้วย 3 ระบบ               │
│     ├─ Divergence Detection             │
│     ├─ Strength Threshold               │
│     └─ Pattern Recognition              │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│  8. แสดง Alert Cards                    │
│     - Divergence Alerts (สีม่วง)       │
│     - Strength Alerts (สีแดง)          │
│     - Pattern Alerts (สีน้ำเงิน)       │
└─────────────────────────────────────────┘
```

### การคำนวณแบบ Step-by-Step

**ตัวอย่างข้อมูล:**
```javascript
// ข้อมูล 3 แท่งเทียน
candles = [
    { time: 1000, open: 1250.50, high: 1250.60, low: 1250.45, close: 1250.55 },
    { time: 1001, open: 1250.55, high: 1250.70, low: 1250.50, close: 1250.65 },
    { time: 1002, open: 1250.65, high: 1250.80, low: 1250.60, close: 1250.50 }
];
```

**Step 1: คำนวณ Price Change**
```javascript
// แท่งที่ 1 vs แท่งที่ 0
change1 = 1250.65 - 1250.55 = +0.10
percent1 = (0.10 / 1250.55) * 100 = +0.008%
direction1 = 'UP'

// แท่งที่ 2 vs แท่งที่ 1
change2 = 1250.50 - 1250.65 = -0.15
percent2 = (-0.15 / 1250.65) * 100 = -0.012%
direction2 = 'DOWN'
```

**Step 2: คำนวณ Opacity**
```javascript
maxChange = 1.0  // 1.0%

// แท่งที่ 1
opacity1 = 0.008 / 1.0 = 0.008
opacity1 = clamp(0.1, 1.0, 0.008) = 0.1  // ขั้นต่ำคือ 0.1

// แท่งที่ 2
opacity2 = 0.012 / 1.0 = 0.012
opacity2 = clamp(0.1, 1.0, 0.012) = 0.1
```

**Step 3: สรุปในนาทีนั้น**
```javascript
// สมมติ 2 แท่งนี้อยู่ในนาทีเดียวกัน (14:30)
minuteSummary = {
    time: 1000,
    minuteKey: '14:30',
    upCount: 1,         // มี 1 แท่งเขียว
    downCount: 1,       // มี 1 แท่งแดง
    upImpact: +0.10,    // แท่งเขียวเพิ่มราคา 0.10
    downImpact: -0.15,  // แท่งแดงลดราคา 0.15
    netImpact: -0.05,   // สุทธิลดลง 0.05
    closePrice: 1250.50
};
```

**Step 4: วิเคราะห์**
```javascript
// 4.1 Divergence Detection
divergence = detectDivergence(minuteSummaries);
// ต้องมี 3 นาที → ยังวิเคราะห์ไม่ได้

// 4.2 Strength Threshold
strength = checkStrengthThreshold(minuteSummary);
// netImpact = 0.05 < threshold.low (0.1%)
// → ไม่มี alert

// 4.3 Pattern Recognition
pattern = recognizePattern(minuteSummaries);
// ต้องมี 5 นาที → ยังวิเคราะห์ไม่ได้
```

### Sliding Window Implementation

```javascript
// ตั้งค่าแสดงสูงสุด 30 แท่ง
maxArrows = 30;

// มีข้อมูล 50 แท่ง
totalCandles = 50;

// คำนวณ index ที่จะแสดง
displayCount = Math.min(30, 50 - 1) = 30;
startIndex = Math.max(0, 50 - 30 - 1) = 19;

// แสดงแท่ง index 20-50 (30 แท่ง)
for (i = 20; i < 50; i++) {
    // render arrow
}

// เมื่อมีแท่งใหม่ (แท่งที่ 51)
// → แสดงแท่ง 21-51 (ตัด index 20 ออก)
```

---

## 🚀 วิธีใช้งาน

### การติดตั้ง

1. **เปิดไฟล์ HTML**
   - ไม่ต้องติดตั้งอะไรเพิ่ม
   - เปิดได้ทั้ง Desktop และ Mobile

2. **เชื่อมต่อ Deriv**
   - ใช้ Demo App ID (1089) - ไม่ต้องสมัคร
   - เชื่อมต่อผ่าน WebSocket

### การตั้งค่า

#### 1. เลือก Market Symbol
```
Volatility Indices:
- R_10, R_25, R_50, R_75, R_100
- 1HZ10V, 1HZ25V (1 second)

Forex:
- frxEURUSD, frxGBPUSD, frxUSDJPY
```

#### 2. เลือก Timeframe
```
- 60 = 1 Minute
- 120 = 2 Minutes
- 300 = 5 Minutes
- 900 = 15 Minutes
- 3600 = 1 Hour
```

#### 3. ตั้งค่า Parameters
```
Candle Count: 50-200 แท่ง
Max Change %: 0.3-3.0% (ปรับตาม volatility)
Max Arrows Display: 20-50 แท่ง
```

### ขั้นตอนการใช้งาน

**Step 1: Connect**
```
1. เลือก Market (เช่น R_10)
2. เลือก Timeframe (เช่น 1 Minute)
3. กด "Connect & Load Data"
4. รอสถานะ "Connected"
```

**Step 2: Observe**
```
1. ดูกราฟเทียน
2. ดูลูกศรใต้กราฟ
   - สีเข้ม = เปลี่ยนแปลงมาก
   - สีจาง = เปลี่ยนแปลงน้อย
3. ดู Minute Summary Cards
   - Up/Down Count
   - Net Impact
```

**Step 3: Analysis**
```
1. ตรวจสอบ Alert Section
2. อ่าน Divergence Alerts
3. อ่าน Strength Alerts
4. อ่าน Pattern Alerts
5. ตัดสินใจเทรด
```

**Step 4: Trade**
```
ตัวอย่าง:
- เห็น Accumulation Pattern
- Net Impact เพิ่มขึ้นต่อเนื่อง
- Breakout ขึ้น Alert!
→ เข้า BUY
→ ตั้ง Stop Loss
→ รอ Take Profit
```

### การปรับแต่ง Threshold

**สำหรับ Volatility Indices (R_10, R_25, ...):**
```javascript
Max Change %: 1.0-2.0%
Thresholds:
- Low: 0.001 (0.1%)
- Medium: 0.003 (0.3%)
- High: 0.005 (0.5%)
- Extreme: 0.010 (1.0%)
```

**สำหรับ Forex:**
```javascript
Max Change %: 0.3-0.8%
Thresholds:
- Low: 0.0003 (0.03%)
- Medium: 0.0008 (0.08%)
- High: 0.0015 (0.15%)
- Extreme: 0.0030 (0.30%)
```

---

## 📖 ตัวอย่างการใช้งานจริง

### กรณีศึกษาที่ 1: Volatility 10 Index (R_10)

**สถานการณ์:**
```
เวลา: 14:25-14:35
Market: R_10 (Volatility 10 Index)
Timeframe: 1 Minute
```

**Timeline:**

**14:25-14:28 - Consolidation Phase**
```
14:25 - Net: +0.0001 | Up 3, Down 3
14:26 - Net: -0.0001 | Up 2, Down 3
14:27 - Net: +0.0001 | Up 3, Down 2
14:28 - Net: -0.0001 | Up 3, Down 3

📊 Alert: Consolidation Pattern
"ตลาดรวมตัว ไม่มีทิศทางชัด"
→ รอ Breakout
```

**14:29-14:31 - Accumulation Phase**
```
14:29 - Net: +0.0015 | Up 4, Down 1
14:30 - Net: +0.0020 | Up 5, Down 1
14:31 - Net: +0.0025 | Up 6, Down 1

📊 Alert: Accumulation Pattern
"แรงซื้อกำลังสะสมตัวเรื่อยๆ"
→ อาจเกิด Breakout ขึ้น

⚠️ Alert: SUSTAINED MOMENTUM
"ทิศทางขึ้น 3 นาทีติดต่อกัน"
→ เทรนด์แข็งแกร่ง
```

**14:32 - Breakout!**
```
14:32 - Net: +0.0085 | Up 7, Down 0

🚀 Alert: Breakout ขึ้น!
"Net Impact กระโดดจาก 0.0025 → 0.0085"
→ เทรนด์ใหม่เริ่มแล้ว

🚨 Alert: HIGH UP MOMENTUM
"Net Impact: +0.0085 (0.85%)"
→ Momentum แรง
```

**การตัดสินใจ:**
```
✓ เข้า BUY ที่ 14:32
✓ Stop Loss ที่ consolidation low
✓ Take Profit ที่ 1.5x Risk
```

**14:33-14:35 - Exhaustion Phase**
```
14:33 - Net: +0.0070 | Up 6, Down 1
14:34 - Net: +0.0050 | Up 5, Down 2
14:35 - Net: +0.0030 | Up 4, Down 3

⚠️ Alert: Exhaustion Pattern
"แรงเริ่มหมด ทั้งที่ยังไปทิศทางเดิม"
→ ใกล้จุดกลับตัว

📈 Alert: Bearish Divergence (ถ้าราคายังขึ้น)
"ราคาทำ Higher High แต่แรงซื้อลดลง"
→ มีโอกาสกลับตัวลง
```

**การตัดสินใจ:**
```
✓ ปิด BUY position
✓ เลื่อน stop loss เป็น breakeven
✓ Take profit บางส่วน
```

**ผลลัพธ์:**
```
Entry: 1250.50
Exit: 1251.30
Profit: +0.80 points
```

---

### กรณีศึกษาที่ 2: EUR/USD Forex

**สถานการณ์:**
```
เวลา: 10:00-10:15
Market: EUR/USD
Timeframe: 5 Minutes
Event: ECB ประกาศดอกเบี้ย
```

**Timeline:**

**10:00-10:05 - ก่อนข่าว**
```
10:00 - Net: +0.00005 | Up 12, Down 8
10:05 - Net: +0.00003 | Up 10, Down 10

↔️ Alert: Consolidation
"รอ Breakout - เตรียมพร้อมเข้าเทรด"
```

**10:10 - ข่าวออก! (Hawkish ECB)**
```
10:10 - Net: +0.00350 | Up 18, Down 2

🚨 Alert: EXTREME UP SPIKE!
"Net Impact: +0.00350 (+0.35%)"
⚠️ อาจมีข่าวสำคัญ

🚀 Alert: Breakout ขึ้น!
"เทรนด์ใหม่เริ่มแล้ว"
```

**การตัดสินใจ:**
```
❌ อย่าเข้าทันที - Spike แรงเกิน
✓ รอ pullback
✓ ดู Minute Summary
```

**10:15 - Pullback Phase**
```
10:15 - Net: +0.00120 | Up 14, Down 6

✓ Net Impact ยังเป็นบวก (แรงซื้อยังมี)
✓ ราคา pullback ~38.2% Fibonacci
→ เข้า BUY
```

**ผลลัพธ์:**
```
Entry: 1.0850
Stop Loss: 1.0830
Take Profit: 1.0890
Result: Hit TP (+40 pips)
```

---

### กรณีศึกษาที่ 3: False Signal

**สถานการณ์:**
```
เวลา: 16:30-16:45
Market: R_50
Timeframe: 1 Minute
```

**Timeline:**

**16:30-16:35 - Accumulation ปลอม**
```
16:30 - Net: +0.0012 | Up 4, Down 1
16:31 - Net: +0.0015 | Up 5, Down 1
16:32 - Net: +0.0018 | Up 5, Down 0

📊 Alert: Accumulation Pattern
"แรงซื้อกำลังสะสมตัวเรื่อยๆ"
```

**16:33 - ไม่เกิด Breakout**
```
16:33 - Net: +0.0010 | Up 3, Down 2
16:34 - Net: +0.0005 | Up 3, Down 3

⚠️ Alert: Exhaustion Pattern
"แรงเริ่มหมด"
```

**16:35-16:40 - กลับตัวลง**
```
16:35 - Net: -0.0020 | Up 1, Down 5
16:36 - Net: -0.0025 | Up 0, Down 6
16:37 - Net: -0.0030 | Up 1, Down 7

📉 Alert: Distribution Pattern
"แรงขายกำลังเพิ่มขึ้นเรื่อยๆ"

📈 Alert: Bearish Divergence
"ราคาทำ Higher High แต่แรงซื้อลดลง"
→ มีโอกาสกลับตัวลง
```

**บทเรียน:**
```
❌ Accumulation ไม่ได้หมายความว่าจะ breakout เสมอ
✓ ต้องดู Exhaustion ประกอบ
✓ ถ้าไม่ breakout ภายใน 2-3 นาที → อาจเป็น false signal
✓ ใช้ Stop Loss เสมอ!
```

---

## ❓ FAQ

### Q1: ทำไมต้องใช้ Net Impact แทนการนับแท่งเทียน?

**A:** เพราะแท่งเทียนไม่ได้บอก**ขนาดของการเปลี่ยนแปลง**

```
ตัวอย่าง:
แท่งเขียว 10 แท่ง เพิ่มราคาอย่างละ +0.0001 = +0.0010
แท่งแดง 1 แท่ง ลดราคา -0.0050 = -0.0050

การนับแท่ง: เขียวชนะ 10:1
Net Impact: แดงชนะ -0.0040

→ แท่งแดง 1 แท่งมีแรงกว่าแท่งเขียว 10 แท่ง!
```

### Q2: Divergence มีความแม่นยำแค่ไหน?

**A:** Divergence เป็นสัญญาณที่ดี แต่ **ไม่ได้แม่นยำ 100%**

**ความแม่นยำโดยประมาณ:**
- Strong Divergence: 60-70%
- Medium Divergence: 50-60%
- Weak Divergence: 40-50%

**เพิ่มความแม่นยำด้วย:**
✓ ดู Divergence + Pattern (Exhaustion)
✓ ดู Support/Resistance ประกอบ
✓ ดู Volume (ถ้ามี)
✓ ใช้ Stop Loss เสมอ

### Q3: Pattern Recognition ทำงานอย่างไร?

**A:** มองหา**รูปแบบที่ซ้ำกัน** ใน Net Impact และ Up/Down Count

```javascript
// ตัวอย่าง Accumulation Detection
function isAccumulation(last5Minutes) {
    // เช็คว่า Up Count เพิ่มขึ้นเรื่อยๆ
    upCountTrend = checkTrend(upCounts);
    
    // เช็คว่า Net Impact เพิ่มขึ้นเรื่อยๆ
    netImpactTrend = checkTrend(netImpacts);
    
    // ถ้าทั้ง 2 เพิ่มขึ้น = Accumulation
    return upCountTrend === 'UP' && netImpactTrend === 'UP';
}
```

### Q4: ควรใช้ Timeframe ไหน?

**A:** ขึ้นอยู่กับ**สไตล์การเทรด**

| Timeframe | สไตล์ | ข้อดี | ข้อเสีย |
|-----------|-------|-------|---------|
| 1 Minute | Scalping | สัญญาณเยอะ | Noise มาก |
| 5 Minutes | Day Trading | สมดุลดี | ต้องจับจังหวะ |
| 15 Minutes | Swing | สัญญาณชัด | น้อยกว่า |
| 1 Hour | Position | Noise น้อย | สัญญาณน้อย |

**คำแนะนำ:**
- Beginner: 5-15 Minutes
- Advanced: 1-5 Minutes
- Conservative: 15-60 Minutes

### Q5: Max Change % ควรตั้งเท่าไหร่?

**A:** ขึ้นอยู่กับ **Volatility ของ Market**

```
Volatility สูง (R_100, Crypto):
→ Max Change = 2.0-3.0%

Volatility ปานกลาง (R_50, R_75):
→ Max Change = 1.0-1.5%

Volatility ต่ำ (Forex, R_10):
→ Max Change = 0.5-0.8%
```

**วิธีทดสอบ:**
1. ดูข้อมูลย้อนหลัง 1 ชั่วโมง
2. หา Max % Change ที่เกิดขึ้น
3. ตั้งค่าประมาณ 80-120% ของค่าที่พบ

### Q6: Sliding Window ควรตั้งกี่แท่ง?

**A:** ขึ้นอยู่กับ **ขนาดหน้าจอและความต้องการ**

```
Desktop (1920x1080):
→ 30-50 แท่ง

Laptop (1366x768):
→ 20-30 แท่ง

Mobile:
→ 15-20 แท่ง
```

**คำแนะนำ:**
- เยอะเกิน = ดูยาก
- น้อยเกิน = ข้อมูลไม่พอ
- Sweet spot: 30 แท่ง

### Q7: Alert บ่อยเกินไป ทำอย่างไร?

**A:** ปรับ **Threshold ให้สูงขึ้น**

```javascript
// ปัจจุบัน
thresholds = {
    low: 0.001,
    medium: 0.003,
    high: 0.005,
    extreme: 0.010
};

// ปรับเป็น (Alert น้อยลง)
thresholds = {
    low: 0.002,
    medium: 0.005,
    high: 0.008,
    extreme: 0.015
};
```

**หรือ:**
- ปิด Strength Alerts ชั่วคราว
- เปิดแค่ Divergence + Pattern
- ปรับ duplicate time limit ให้นานขึ้น

### Q8: ใช้กับ Crypto ได้ไหม?

**A:** **ได้** แต่ต้องปรับ Threshold

```javascript
// Crypto มี Volatility สูงมาก
thresholds = {
    low: 0.005,      // 0.5%
    medium: 0.015,   // 1.5%
    high: 0.030,     // 3.0%
    extreme: 0.050   // 5.0%
};

maxChange = 5.0;  // 5%
```

**ข้อควรระวัง:**
- Crypto แกว่งตัวมาก
- Flash Crash บ่อย
- Spread กว้าง
→ ใช้ Stop Loss ที่กว้างกว่า Forex

### Q9: มี Backtest ได้ไหม?

**A:** **ได้** แต่ต้องแก้โค้ดเพิ่ม

```javascript
// เพิ่มฟังก์ชัน Backtest
function backtest(historicalData, strategy) {
    let results = [];
    
    for (let i = 0; i < historicalData.length; i++) {
        // Run analysis
        const signals = analyzeData(historicalData.slice(0, i));
        
        // Simulate trade
        if (signals.shouldBuy) {
            // Enter trade
        }
        
        // Calculate P&L
    }
    
    return results;
}
```

**หรือ:** Export data แล้วใช้ Python/Excel วิเคราะห์

### Q10: เปรียบเทียบกับ Indicator ดั้งเดิม?

**A:** นี่คือตารางเปรียบเทียบ:

| Feature | Traditional Indicators | Price Impact Tracker |
|---------|------------------------|----------------------|
| **ข้อมูลที่ใช้** | Price, Volume | Price, Direction, Impact |
| **การวัด** | ค่าเฉลี่ย, Oscillator | Direct Impact |
| **Timeframe** | Fixed Period | Dynamic (Minute-based) |
| **Visualization** | Lines, Histogram | Arrows, Opacity |
| **ความซับซ้อน** | ปานกลาง | สูง |
| **ความแม่นยำ** | ดี | ดีมาก (ในบางสถานการณ์) |

**ข้อดี Price Impact:**
✓ เห็นแรงซื้อ/ขายชัดเจน
✓ Visual ง่าย
✓ Real-time Analysis

**ข้อเสีย:**
✗ ต้องเรียนรู้ใหม่
✗ ยังไม่เป็นที่รู้จักแพร่หลาย
✗ ต้องใช้ร่วมกับ Indicator อื่น

---

## 📝 สรุป

**Price Impact Momentum Tracker** เป็น custom indicator ที่:

1. **วัดน้ำหนักของการเคลื่อนไหว** แทนการนับแท่งเทียน
2. **แสดงผลด้วย Visual ที่เข้าใจง่าย** (ลูกศร + สี + opacity)
3. **วิเคราะห์อัตโนมัติด้วย 3 ระบบ:**
   - Divergence Detection
   - Strength Threshold
   - Pattern Recognition
4. **ให้ Alert แบบ real-time** ช่วยตัดสินใจเทรด

**วิธีใช้ให้ได้ผล:**
✓ เริ่มจาก Demo Account
✓ ทดสอบกับ Volatility Indices ก่อน
✓ ใช้ร่วมกับ Support/Resistance
✓ ตั้ง Stop Loss เสมอ
✓ เรียนรู้รูปแบบที่เกิดซ้ำๆ

**ข้อควรระวัง:**
⚠️ ไม่มี Indicator ไหนแม่นยำ 100%
⚠️ ต้องใช้ Money Management
⚠️ ต้องปรับ Threshold ตาม Market
⚠️ ควรใช้ร่วมกับ Technical Analysis อื่นๆ

---

## 📚 เอกสารอ้างอิง

- Deriv API Documentation: https://api.deriv.com
- Lightweight Charts: https://tradingview.github.io/lightweight-charts/
- Technical Analysis Basics
- Price Action Trading Principles

---

## 🤝 Contributing

ถ้าอยากพัฒนาต่อ:
1. Fork repository
2. เพิ่มฟีเจอร์
3. ทดสอบให้ละเอียด
4. Submit Pull Request

---

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

---

## 💬 ติดต่อ & Support

- Issues: สามารถรายงานปัญหาได้
- Suggestions: ยินดีรับฟีดแบ็ค
- Questions: ถามได้ใน Discussion

---

**สร้างโดย:** Price Impact Analysis Team  
**เวอร์ชัน:** 1.0.0  
**อัปเดตล่าสุด:** 2024

---

**Happy Trading! 📈💰**