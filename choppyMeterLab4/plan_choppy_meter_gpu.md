# Plan: ChoppyMeterGPU — GPU-Accelerated Indicator Class

**Created:** 2026-02-11  
**Status:** 📋 Planning  
**Priority:** Medium  
**Estimated Effort:** 3-5 days

---

## 1. Overview

สร้าง JavaScript Class ชื่อ `ChoppyMeterGPU` ที่ใช้ **WebGPU API** คำนวณ Technical Indicators บน GPU
แทนการคำนวณบน CPU เพื่อรองรับการคำนวณหลาย assets พร้อมกัน (batch processing)

### เป้าหมายหลัก
- ✅ **Reusable** — เป็น standalone class, import ได้ทุกหน้า
- ✅ **Multi-Asset Batch** — คำนวณ 10+ assets ใน 1 GPU dispatch
- ✅ **CPU Fallback** — ทำงานได้แม้ browser ไม่รองรับ WebGPU
- ✅ **Same Interface** — API เหมือนกันไม่ว่าจะใช้ GPU หรือ CPU

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────┐
│  ChoppyMeterGPU (Public API)                             │
│  ════════════════════════════                             │
│  .init()          → ขอ GPU device + compile shaders      │
│  .setAssets({})   → ใส่ข้อมูล candles หลาย assets         │
│  .compute({})     → คำนวณ indicators ทั้งหมด              │
│  .isGPU           → boolean ว่าใช้ GPU หรือ CPU fallback  │
│                                                          │
│  ┌────────────────────┐  ┌────────────────────┐          │
│  │  WebGPU Backend    │  │  CPU Fallback      │          │
│  │  (ChoppyGPUCore)   │  │  (ChoppyCPUCore)   │          │
│  │                    │  │                    │          │
│  │  WGSL Shaders:     │  │  Pure JS:          │          │
│  │  - ci_compute      │  │  - indicators.js   │          │
│  │  - ema_compute     │  │  - (existing code) │          │
│  │  - adx_compute     │  │                    │          │
│  │  - atr_compute     │  │                    │          │
│  │  - rsi_compute     │  │                    │          │
│  │  - bb_compute      │  │                    │          │
│  └────────────────────┘  └────────────────────┘          │
│                                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │  GPU Memory Layout                           │        │
│  │  ─────────────────                           │        │
│  │  Input Buffer:                               │        │
│  │    [Asset0: O,H,L,C × N] [Asset1: ...] ...   │        │
│  │                                              │        │
│  │  Output Buffer:                              │        │
│  │    [Asset0: CI,ADX,ATR,EMA_S,M,L,RSI,BB]    │        │
│  │    [Asset1: ...]                             │        │
│  └──────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Indicators ที่ต้อง Implement บน GPU

| # | Indicator | Input | Output | Parallelism | ความยาก |
|---|-----------|-------|--------|-------------|---------|
| 1 | **True Range (TR)** | H, L, C | TR[] | ✅ Fully parallel | ง่าย |
| 2 | **ATR** | TR[] | ATR[] | ⚠️ Sequential (RMA) | กลาง |
| 3 | **Choppiness Index (CI)** | H, L, C, ATR | CI[] | ⚠️ Rolling sum | กลาง |
| 4 | **EMA** | C[] | EMA[] | ⚠️ Sequential | กลาง |
| 5 | **SMA** | C[] | SMA[] | ✅ Sliding window | ง่าย |
| 6 | **WMA** | C[] | WMA[] | ✅ Weighted sum | ง่าย |
| 7 | **ADX** | H, L, C | ADX[] | ⚠️ Multi-step sequential | ยาก |
| 8 | **RSI** | C[] | RSI[] | ⚠️ Sequential (RMA) | กลาง |
| 9 | **Bollinger Bands** | C[] | Upper/Mid/Lower[] | ✅ Sliding window + stddev | กลาง |
| 10 | **HMA** | C[] | HMA[] | ⚠️ Multi-step WMA | กลาง |

### GPU Parallelism Strategy

```
Parallel Across Assets (workgroup per asset):
  ┌────────┬────────┬────────┬────────┬─────┐
  │Asset 0 │Asset 1 │Asset 2 │Asset 3 │ ... │  ← แต่ละ workgroup
  │CI,ADX  │CI,ADX  │CI,ADX  │CI,ADX  │     │
  │EMA,ATR │EMA,ATR │EMA,ATR │EMA,ATR │     │
  └────────┴────────┴────────┴────────┴─────┘
  
Sequential Within Asset (loop inside shader):
  Candle[0] → Candle[1] → ... → Candle[149]
  EMA[i] = α * price[i] + (1-α) * EMA[i-1]  ← ต้องทำทีละขั้น
```

> **หมายเหตุ**: EMA, RSI, ADX เป็น sequential indicator 
> (ค่าปัจจุบันขึ้นกับค่าก่อนหน้า) → ไม่สามารถ parallel ภายใน 1 asset ได้
> แต่สามารถ parallel **ข้าม assets** ได้ ซึ่งเป็นจุดที่ GPU ได้เปรียบ

---

## 4. File Structure

```
js/
├── ChoppyMeterGPU.js          ← Main class (public API + auto-detect GPU/CPU)
├── gpu/
│   ├── ChoppyGPUCore.js       ← WebGPU backend (buffer management, dispatch)
│   ├── shaders/
│   │   ├── tr_atr.wgsl        ← True Range + ATR compute shader
│   │   ├── ci.wgsl            ← Choppiness Index compute shader
│   │   ├── ema.wgsl           ← EMA compute shader (short/medium/long)
│   │   ├── adx.wgsl           ← ADX compute shader (DI+/DI-/DX/ADX)
│   │   ├── rsi.wgsl           ← RSI compute shader
│   │   ├── bb.wgsl            ← Bollinger Bands compute shader
│   │   └── hma.wgsl           ← Hull Moving Average compute shader
│   └── gpu-utils.js           ← Buffer helpers, shader loader
├── ChoppyCPUCore.js           ← CPU fallback (wraps existing indicators.js)
└── indicators.js              ← (existing) ไม่แก้ไข — ใช้เป็น fallback
```

---

## 5. Public API Design

```javascript
// ════════════════════════════════════════════════
// การใช้งาน ChoppyMeterGPU
// ════════════════════════════════════════════════

// 1. สร้าง instance
const meter = new ChoppyMeterGPU();

// 2. Initialize (ขอ GPU device, compile shaders)
const gpuAvailable = await meter.init();
// gpuAvailable = true → ใช้ GPU
// gpuAvailable = false → fallback CPU อัตโนมัติ

console.log(meter.isGPU);    // true/false
console.log(meter.backend);  // 'webgpu' | 'cpu'

// 3. ใส่ข้อมูล candles หลาย assets
meter.setAssets({
  'R_100': {
    candles: [
      { epoch: 1700000000, open: 100.5, high: 101.2, low: 99.8, close: 100.9 },
      // ... 150 candles
    ]
  },
  'R_75': { candles: [...] },
  'R_50': { candles: [...] },
  'R_25': { candles: [...] },
  'R_10': { candles: [...] },
  // ... รองรับสูงสุด ~64 assets (GPU workgroup limit)
});

// 4. คำนวณ — ได้ผลลัพธ์ทั้งหมดในครั้งเดียว
const results = await meter.compute({
  ciPeriod: 14,
  adxPeriod: 14,
  atrPeriod: 14,
  emaPeriods: { short: 7, medium: 25, long: 99 },
  rsiPeriod: 14,
  bbPeriod: 20,
  bbStdDev: 2,
  hmaPeriod: 9,
});

// 5. ใช้ผลลัพธ์
const r100 = results['R_100'];
r100.ci          // Float32Array [null, ..., 62.3, 58.1]
r100.adx         // Float32Array [null, ..., 28.5, 30.2]
r100.atr         // Float32Array [null, ..., 0.45, 0.42]
r100.ema.short   // Float32Array [null, ..., 100.5, 100.8]
r100.ema.medium  // Float32Array [...]
r100.ema.long    // Float32Array [...]
r100.rsi         // Float32Array [null, ..., 55.2, 58.0]
r100.bb.upper    // Float32Array [...]
r100.bb.middle   // Float32Array [...]
r100.bb.lower    // Float32Array [...]
r100.score       // number — computed: ADX + (100 - CI) + bonus

// 6. Incremental update (เพิ่มแท่งเทียนใหม่ 1 แท่ง)
meter.appendCandle('R_100', {
  epoch: 1700000300, open: 101.0, high: 101.5, low: 100.7, close: 101.2
});
const updated = await meter.computeIncremental('R_100');

// 7. Cleanup
meter.destroy(); // ปล่อย GPU buffers
```

---

## 6. WGSL Shader Example (EMA)

```wgsl
// ema.wgsl — EMA Compute Shader
// แต่ละ workgroup คำนวณ 1 asset

struct Params {
  num_assets: u32,
  num_candles: u32,
  ema_period_short: u32,
  ema_period_medium: u32,
  ema_period_long: u32,
};

@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<storage, read> close_prices: array<f32>;   // flattened [assets × candles]
@group(0) @binding(2) var<storage, read_write> ema_short: array<f32>;
@group(0) @binding(3) var<storage, read_write> ema_medium: array<f32>;
@group(0) @binding(4) var<storage, read_write> ema_long: array<f32>;

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let asset_idx = gid.x;
  if (asset_idx >= params.num_assets) { return; }
  
  let offset = asset_idx * params.num_candles;
  let n = params.num_candles;
  
  // EMA Short
  let alpha_s = 2.0 / (f32(params.ema_period_short) + 1.0);
  ema_short[offset] = close_prices[offset]; // seed
  for (var i = 1u; i < n; i = i + 1u) {
    let idx = offset + i;
    ema_short[idx] = alpha_s * close_prices[idx] + (1.0 - alpha_s) * ema_short[idx - 1u];
  }
  
  // EMA Medium
  let alpha_m = 2.0 / (f32(params.ema_period_medium) + 1.0);
  ema_medium[offset] = close_prices[offset];
  for (var i = 1u; i < n; i = i + 1u) {
    let idx = offset + i;
    ema_medium[idx] = alpha_m * close_prices[idx] + (1.0 - alpha_m) * ema_medium[idx - 1u];
  }
  
  // EMA Long
  let alpha_l = 2.0 / (f32(params.ema_period_long) + 1.0);
  ema_long[offset] = close_prices[offset];
  for (var i = 1u; i < n; i = i + 1u) {
    let idx = offset + i;
    ema_long[idx] = alpha_l * close_prices[idx] + (1.0 - alpha_l) * ema_long[idx - 1u];
  }
}
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Day 1)
- [ ] สร้าง `ChoppyMeterGPU.js` — main class skeleton
- [ ] สร้าง `ChoppyGPUCore.js` — WebGPU device init, buffer management
- [ ] สร้าง `ChoppyCPUCore.js` — CPU fallback wrapper (ใช้ `indicators.js` เดิม)
- [ ] Implement auto-detect GPU/CPU + unified interface
- [ ] Unit test: init() + isGPU detection

### Phase 2: Core Shaders (Day 2)
- [ ] เขียน WGSL shader: `tr_atr.wgsl` (True Range + ATR)
- [ ] เขียน WGSL shader: `ema.wgsl` (EMA Short/Medium/Long)
- [ ] เขียน WGSL shader: `ci.wgsl` (Choppiness Index)
- [ ] เขียน buffer packing/unpacking utilities
- [ ] Verify: เทียบผลลัพธ์ GPU vs CPU ต้องตรงกัน (tolerance ±0.01)

### Phase 3: Advanced Shaders (Day 3)
- [ ] เขียน WGSL shader: `adx.wgsl` (ADX — complex multi-step)
- [ ] เขียน WGSL shader: `rsi.wgsl` (RSI)
- [ ] เขียน WGSL shader: `bb.wgsl` (Bollinger Bands)
- [ ] เขียน WGSL shader: `hma.wgsl` (Hull Moving Average)
- [ ] Verify: ทุก shader ให้ผลตรงกับ CPU

### Phase 4: Integration & Test Page (Day 4)
- [ ] สร้าง `testGPUMeter.html` — test page
  - [ ] เลือก assets (checkboxes)
  - [ ] แสดง benchmark: GPU time vs CPU time
  - [ ] แสดงตาราง results เทียบค่า GPU/CPU
  - [ ] แสดง GPU device info
- [ ] Integrate กับ `indexV5.html` (optional toggle)
- [ ] Test กับ 10 assets พร้อมกัน

### Phase 5: Optimization & Polish (Day 5)
- [ ] Implement `computeIncremental()` — คำนวณแค่แท่งเทียนใหม่
- [ ] Memory optimization — reuse buffers, minimize GPU↔CPU transfers
- [ ] Error handling ครบถ้วน (device lost, OOM, shader errors)
- [ ] Documentation + JSDoc comments
- [ ] Performance benchmark: 1/5/10/20 assets

---

## 8. Performance Expectations

| Scenario | CPU (ปัจจุบัน) | GPU (คาดการณ์) | Speedup |
|----------|---------------|----------------|---------|
| 1 asset × 150 candles | ~2ms | ~3ms (overhead) | ❌ ช้ากว่า |
| 5 assets × 150 candles | ~10ms | ~4ms | ✅ 2.5x |
| 10 assets × 150 candles | ~20ms | ~5ms | ✅ 4x |
| 20 assets × 150 candles | ~40ms | ~6ms | ✅ 6.7x |
| 10 assets × 1000 candles | ~100ms | ~10ms | ✅ 10x |

> **หมายเหตุ**: ตัวเลขเป็นการคาดการณ์เบื้องต้น  
> GPU overhead (buffer transfer) อยู่ที่ ~1-3ms คงที่  
> ยิ่ง assets เยอะหรือ candles ยาว → GPU ยิ่งคุ้มค่า

---

## 9. Browser Compatibility

| Browser | WebGPU Support | Fallback |
|---------|---------------|----------|
| Chrome 113+ | ✅ Full | — |
| Edge 113+ | ✅ Full | — |
| Firefox 130+ | ✅ (behind flag → stable soon) | CPU |
| Safari 18+ | ✅ (macOS/iOS) | — |
| Older browsers | ❌ | CPU auto-fallback |

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| WebGPU ยังไม่ stable ทุก browser | สูง | CPU fallback เสมอ, detect ก่อนใช้ |
| f32 precision ไม่พอ | ต่ำ | Financial data ใช้ f32 ได้ (4-5 decimal places) |
| Shader compile time ช้า | กลาง | Compile ครั้งเดียวตอน init(), cache pipeline |
| GPU device lost (tab background) | กลาง | Handle `device.lost` event, re-init or fallback |
| WGSL debugging ยาก | กลาง | เทียบ output กับ CPU ทุกครั้ง, ใช้ Chrome GPU debugger |

---

## 11. Dependencies

- **WebGPU API** — built-in (Chrome 113+)
- **indicators.js** — existing file (ใช้เป็น CPU fallback, ไม่แก้ไข)
- **ไม่ต้องติดตั้ง npm package เพิ่มเติม**

---

## 12. Future Enhancements (ถ้าสำเร็จ)

- 🔮 **SMC Indicators บน GPU** — Order Blocks, FVG detection
- 🔮 **Real-time streaming** — ต่อ WebSocket → GPU compute → render loop
- 🔮 **WebGPU + Tauri** — ใช้ wgpu (Rust) แทน browser WebGPU
- 🔮 **Shared GPU buffers** — ส่ง output ตรงไป Canvas rendering ไม่ผ่าน CPU
