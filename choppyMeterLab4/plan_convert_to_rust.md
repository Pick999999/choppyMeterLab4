# Migration Plan: ChoppyMeter (Web) to Rust + Tauri Desktop App

This document outlines the phased approach to migrating the existing `ChoppyMeter` web application to a high-performance desktop application using Rust and Tauri.

## Overview
The goal is to transition from a browser-based architecture (HTML/JS/PHP) to a native desktop app where:
- **Frontend**: Remains HTML/JS/CSS (hosted by Tauri) but modernized.
- **Backend**: Rust replaces the PHP auth and handles heavy logic.
- **Performance**: Critical calculations (indicators, strategy) move from JS to Rust.
- **Stability**: WebSocket connections and trading state are managed by the robust Rust backend.
- **Architecture**: Rust Workspace with modular crates (DLL-Ready).

---

## 📂 Project Structure (Created)

```
choppyMeterLab4/
├── choppy-meter-rust/               ← Rust Workspace Root
│   ├── Cargo.toml                   ← Workspace Members Config
│   ├── frontend/                    ← Junction Link → ../../choppyMeterLab4 (for Tauri)
│   ├── crates/
│   │   ├── indicators/              ← ✅ EMA, SMA, RSI, ATR, ADX, CI, BB (5 tests passed)
│   │   │   ├── Cargo.toml           ← crate-type: ["rlib", "cdylib"] (DLL-Ready)
│   │   │   └── src/lib.rs
│   │   ├── smc/                     ← ✅ Swing Points, Order Blocks, FVG (1 test passed)
│   │   │   ├── Cargo.toml
│   │   │   └── src/lib.rs
│   │   └── trader/                  ← ✅ Trade Logic, Martingale, Prevent Duplicate (7 tests passed)
│   │       ├── Cargo.toml
│   │       └── src/lib.rs
│   └── src-tauri/                   ← Tauri App (Main Consumer)
│       ├── Cargo.toml               ← depends on indicators, smc, trader
│       ├── build.rs
│       ├── tauri.conf.json          ← points to indexV5.html, CSP configured
│       ├── capabilities/default.json
│       └── src/main.rs              ← Tauri Commands: greet, calculate_ema
├── indexV5.html                     ← Frontend Entry Point (existing)
├── js/                              ← Original JS Files (existing)
└── css/                             ← Original CSS Files (existing)
```

---

## 📊 Progress Tracking System
Use the checkboxes below to track progress. `[x]` = completed and verified.

### Phase 1: Setup & Hybrid App
- [x] 1.1 Create Workspace + Crate Structure ✅ 2026-02-10
- [x] 1.2 Configure `tauri.conf.json` (Tauri v2 format) ✅ 2026-02-10
- [x] 1.3 Write `src-tauri/src/main.rs` with Tauri Commands ✅ 2026-02-10
- [x] 1.4 Create `capabilities/default.json` (Tauri v2 permissions) ✅ 2026-02-10
- [x] 1.5 Run `cargo tauri dev` and verify app launches ✅ 2026-02-10
- [ ] 1.6 Test WebSocket Connection (Deriv API) inside Tauri window
- [ ] 1.7 Implement PHP Auth Replacement in Rust (`login_step_1`, `login_step_2`)
- [ ] 1.8 Update Frontend JS to use Tauri Commands for Auth

### Phase 2: Core Logic (Rust Indicators)
- [x] 2.1 Create `crates/indicators` with DLL-Ready Cargo.toml ✅ 2026-02-10
- [x] 2.2 Port EMA/SMA/RSI/ATR/ADX/CI/BB to Rust ✅ 2026-02-10
- [x] 2.3 Port SMC (Swing Points, OB, FVG) to Rust ✅ 2026-02-10
- [x] 2.4 Create Rust Structs (`Candle`, `BollingerBandsResult`, etc.) ✅ 2026-02-10
- [x] 2.5 Add `extern "C"` DLL exports (e.g., `ema_calculate`) ✅ 2026-02-10
- [ ] 2.6 Expose full `calculate_indicators` Tauri Command
- [ ] 2.7 Connect Frontend `clsAnalysisGeneratorV3.js` to call Rust via `invoke`
- [ ] 2.8 Dual-Run Test: Compare JS output vs Rust output
- [ ] 2.9 Performance Benchmark (5000 candles)

### Phase 3: Stability (Rust Trading Engine)
- [x] 3.1 Create `crates/trader` with trade state structs ✅ 2026-02-10
- [x] 3.2 Port `getAction`, `shouldEnterTrade`, Martingale logic ✅ 2026-02-10
- [ ] 3.3 Implement Rust WebSocket Client (`tokio-tungstenite`)
- [ ] 3.4 Threading & State Management (`Mutex<TradeState>`)
- [ ] 3.5 Port full `checkEntry` / `executeTrade` logic to Rust
- [ ] 3.6 Implement Backend-to-Frontend Event Emission (`window.emit`)
- [ ] 3.7 Paper Trading Test on Demo Account

### Phase 4: High Performance (GPU) - Optional
- [ ] 4.1 Set up `wgpu`
- [ ] 4.2 Write WGSL Compute Shaders
- [ ] 4.3 Integrate GPU Pipeline with Rust Backend

### Phase 5: Polish & Distribute
- [ ] 5.1 Custom Window Chrome (Dark Theme)
- [ ] 5.2 System Tray Support
- [ ] 5.3 CI/CD Build Pipeline (`.msi` / `.exe`)

---

## ⚡ Quick Resume Guide (สำหรับครั้งหน้า)

### ✅ สถานะปัจจุบัน: Step 1.5 PASSED!
**`cargo tauri dev` compile + run สำเร็จ!** (2026-02-10)
**แก้ไข:** เพิ่ม Windows Defender Exclusion สำหรับ `target/` folder

**NEXT →** Step 1.6: ทดสอบ WebSocket เชื่อม Deriv API ภายใน Tauri window

### ✅ ขั้นตอนแก้ไข (ทำตามลำดับ):

**Step 1: Exclude โฟลเดอร์ target จาก Windows Defender** (รันด้วย PowerShell Administrator)
```powershell
Add-MpPreference -ExclusionPath "D:\Rust\choppyMeterLab4\choppy-meter-rust\target"
```

**Step 2: Kill process cargo ที่อาจค้างอยู่**
```powershell
taskkill /F /IM cargo.exe 2>$null
```

**Step 3: ลบ target folder เก่า**
```powershell
cd D:\Rust\choppyMeterLab4\choppy-meter-rust
Remove-Item -Recurse -Force target
```

**Step 4: (Optional) ปิด VSCode ก่อน build เพื่อไม่ให้ rust-analyzer สแกน**

**Step 5: Build ใหม่**
```powershell
cd D:\Rust\choppyMeterLab4\choppy-meter-rust
cargo tauri dev
```
⏱ ใช้เวลาประมาณ 10-15 นาที (ครั้งแรกหลังลบ target)

**Step 6: ถ้าสำเร็จ → หน้าต่างแอปจะเปิดขึ้นมาแสดง indexV5.html**
- ทำเครื่องหมาย `[x]` ที่ 1.5
- ทดสอบต่อ: WebSocket เชื่อม Deriv ได้ไหม (Step 1.6)

### Prerequisites (สิ่งที่มีอยู่แล้ว):
- ✅ Rust installed (`rustup`)
- ✅ `tauri-cli v2.10.0` installed (`cargo install tauri-cli`)
- ✅ Workspace compiles (`cargo test -p indicators -p smc -p trader` → 13 tests passed)
- ✅ `src-tauri/tauri.conf.json` → Tauri v2 format, ชี้ไปที่ `indexV5.html`
- ✅ `frontend/` junction link → `D:\Rust\choppyMeterLab4`

---

## 🧪 Testing Strategy per Phase

### Phase 1: Application Shell
1. **Launch Test**: `cargo tauri dev` → หน้าต่างเปิดได้
2. **Network Test**: DevTools (F12) → `wss://` เชื่อม Deriv สำเร็จ
3. **Auth Test**: Login ผ่าน Rust Commands

### Phase 2: Calculation Accuracy
1. **Dual-Run**: รัน JS + Rust indicators พร้อมกัน
2. **Compare**: `Rust_EMA == JS_EMA` (within ε)
3. **Benchmark**: 5000 candles → Rust ควรเร็วกว่า >10x

### Phase 3: Trading Stability
1. **Paper Trading**: เชื่อม Demo Account
2. **Signal Match**: Log ใน Rust ตรงกับ Chart บน Frontend
3. **Crash Recovery**: ถอด WiFi → Rust ต้อง Auto-Reconnect

### Phase 4: GPU Compute
1. **GPU vs CPU**: เทียบผลลัพธ์
2. **Stress Test**: 20+ assets → UI ยังลื่น 60fps

---

## Phase 1: Setup & "Hybrid" Application
**Goal**: Get the existing web application running inside a desktop window with minimal code changes.

### 1.1 Project Initialization (Workspace Architecture)
- **Structure**: Set up a Cargo Workspace to support modular development (Micro-Libraries).
- **Command**:
  ```bash
  # Root directory
  mkdir choppy-meter-rust
  touch Cargo.toml # Workspace definition
  
  # Module Crates (Micro-Libs)
  cargo new crates/indicators --lib
  cargo new crates/smc --lib
  cargo new crates/trader --lib
  
  # Tauri App (Main Consumer)
  cargo tauri init
  ```
- **Benefit**: Allows independent compilation/testing of logic modules (`crates/*`) without rebuilding the entire UI layer.

### 1.2 Frontend Integration
- **Asset Migration**: Ensure `indexV5.html`, `css/`, `js/`, and other assets are correctly served by Tauri.
- **Dependency Check**:
  - Verify `lightweight-charts` loads correctly in the WebView.
  - Test `js/deriv.js` WebSocket connection to Deriv API (handle any CORS or CSP issues in Tauri config).

### 1.3 PHP Logic Replacement (Authentication)
- **Problem**: `checkusersha3.php` and `checkuserstep2.php` currently handle auth. Tauri does not run PHP.
- **Solution**: Rewrite this logic in Rust (`src-tauri/src/main.rs`).
- **Action Items**:
  - Implement a Tauri Command `login_step_1` that replicates `checkusersha3.php` (hashing/validation).
  - Implement `login_step_2` for `checkuserstep2.php`.
  - Update `js/jsB.js` (or relevant login JS) to call `invoke('login_step_1', ...)` instead of `fetch('checkusersha3.php')`.

---

## Phase 2: Core Logic Migration (Rust Backend)
**Goal**: Move performance-critical indicator calculations from JavaScript to Rust.

### 2.1 Rust Indicator Library (DLL-Ready Architecture)
- **Concept**: Structure the core logic (indicators & math) as a **Rust Library Crate (`lib.rs`)**.
- **Benefit**: This allows the code to be compiled in two ways:
    1.  **Embedded**: Statically linked into the Tauri App (High performance, single .exe file).
    2.  **DLL / Shared Lib**: Compiled as `.dll` (via `cdylib`) for use by **other applications** (e.g., Python, C#, or MetaTrader).
- **Implementation**:
    - Use `[lib]` crate type in `Cargo.toml`.
    - Expose C-compatible interfaces (`extern "C"`) for functions we want to export to DLL.

### 2.2 Data Structure Mirroring
- Define Rust structs that mirror the JS objects:
  ```rust
  #[repr(C)] // Ensures compatible memory layout for DLL usage
  pub struct Candle { 
      time: u64, 
      open: f64, 
      high: f64, 
      low: f64, 
      close: f64 
  }
  ```
- Use `serde` for serialization when communicating with Tauri/JS.

### 2.3 Tauri Command Interface
- Create Tauri commands to expose calculations:
  - `calculate_indicators(candles: Vec<Candle>) -> AnalysisResult`
- Update `js/clsAnalysisGeneratorV3.js` to:
  1.  Send raw candle data to Rust via `invoke`.
  2.  Receive fully calculated analysis objects.
  3.  Update the UI.

---

## Phase 3: Trading Engine & WebSocket Stabilization
**Goal**: Move the stability-critical Trading and Data connection layers to Rust.

### 3.1 Rust WebSocket Client
- **Transition**: Move `js/deriv.js` logic to Rust using `tungstenite` or `tokio-tungstenite`.
- **Benefit**: Rust threads don't get throttled like background browser tabs, ensuring 100% uptime for tick data processing.
- **Implementation**:
  - Rust maintains the persistent WS connection to Deriv.
  - Rust emits events to the Frontend via `window.emit('tick', data)` for UI updates only.

### 3.2 Trading Logic (The "Brain")
- Port `js/trader.js` and `js/mainV4.js` (strategy logic) to Rust.
- **Action Items**:
  - Implement the "Check Entry" logic (Slope detection, Lag checks) in Rust.
  - Manage trade state (Open positions, P/L tracking, Stop Loss/Take Profit) in a `Mutex<TradeState>`.
  - Execute trades directly from Rust -> Deriv API (bypassing the UI thread delay).

---

## Phase 4: High-Performance Compute (Optional GPU)
**Goal**: Enable massive multi-asset analysis without UI lag.

### 4.1 Super Kernel Implementation (GPU)
- **Technology**: Use `wgpu` (WebGPU for Rust) to perform parallel calculations.
- **Use Case**: When analyzing 10+ assets simultaneously (Multi-Asset Mode).
- **Implementation**:
  - Write Compute Shaders (WGSL) for parallel EMA/RSI calculations.
  - Rust manages the `wgpu` pipeline: loading data -> dispatching compute -> reading results.
  - This effectively replaces the "Super Kernel" JavaScript implementation with native GPU code.

---

## Phase 5: GUI Refinement & Packaging
**Goal**: Polish the user experience and create a distributable installer.

### 5.1 UI Enhancements
- Remove browser-specific hacks (e.g., audio context workarounds might differ).
- Add native OS menus and System Tray support (minimize to tray for background trading).
- Implement custom window chrome (frameless window with custom controls) matching the dark theme.

### 5.2 Build & Deploy
- Configure CI/CD to build binaries for Windows (`.msi` / `.exe`).
- Sign the application if necessary for distribution.
