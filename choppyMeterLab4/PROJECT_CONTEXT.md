# PROJECT_CONTEXT - Choppy Meter Lab 4

**Last Updated:** 2026-02-10T18:06:00+07:00

## Project Overview

A web-based market analysis dashboard for Deriv Volatility Index assets. The application displays real-time Choppiness Index (CI), ADX, and EMA analysis with interactive charts. **Now includes automated trading functionality, SMC (Smart Money Concepts) visualization, and Two-Step Authentication system.**

---

### 2026-02-04 - V4 SMC Integration & Logic Updates

55. ✅ **V4 Integration (indexV4.html)**:
    - **SMC Visualization**: Full integration of Smart Money Concepts (Order Blocks, FVG, Swing Points, BOS/CHoCH) using `js/SMCChartRenderer.js`.
    - **Separate Toggles**: Dedicated buttons for "⚡ SMC", "🎨 Zones", and "🔀 Alt Colors" in the chart header.
    - **Lag Detection**: Audio alerts for EMA slope lag conditions (Medium Down + Long Up).
    - **Trading Module**: Uses `js/trader.js` (DerivTrader) for automated trading logic.
    - **Live EMA Colors**: Real-time updates for EMA colors without needing to save settings.

56. ✅ **SMC Indicators**:
    - **Order Blocks (OB)**: Visualized as colored boxes extending to the right.
    - **Fair Value Gaps (FVG)**: Visualized as semi-transparent boxes.
    - **Market Structure**: Swing Highs/Lows (HH, HL, LH, LL) and Break of Structure (BOS) / Change of Character (CHoCH) lines.
    - **Visual Controls**: Checkboxes to toggle Bull/Bear Order Blocks and FVGs independently.

57. ✅ **Chart Enhancements**:
    - **Background Color Zones**: Highlight "Trending" (Green) vs "Choppy" (Red) zones based on CI, and RSI Buy/Sell zones.
    - **Alternate Color Zones**: Highlights areas with alternating Red/Green candles (choppy/indecisive price action).
    - **StatusCode Markers**: Manual or auto-placement of markers based on specific status codes found in `CodeCandleMaster.json`.

58. ✅ **UI Enhancements**:
    - **EMA Quick Toggles**: Added S/M/L checkboxes directly on the chart header for quick toggling of EMA Short, Medium, and Long lines.
    - **Entry Spot Visualization**: Added a "Target" button (🎯) to the "Track Order" table.
    - **Entry Line Logic**: Toggling the target button draws a horizontal line (Green for Call, Red for Put) at the entry price on the chart.
    - **Persistence**: Entry spot lines persist across symbol switches for active contracts, and the toggle remains available even for closed orders.

---

## Key Files Structure

```
d:\Rust\choppyMeterLab4\
├── index.html          # Original dashboard
├── indexV2.html        # Enhanced dashboard (Top 8 assets + Chart + Trading)
├── indexV3.html        # V3 with Tabbed Settings, EMA Color Picker, Analysis Viewer (Uses js/trade.js)
├── indexV4.html        # V4 with SMC Integration, Advanced Toggles, Lag Alerts (Uses js/trader.js)
├── indexV4_flowChart.md # Flowchart documentation for indexV4 logic
├── details.html        # Detailed chart view
├── login.html          # Step 1 Authentication
├── login2.html         # Step 2 Authentication
├── checkusersha3.php   # Backend: Step 1 Auth
├── checkuserstep2.php  # Backend: Step 2 Auth
├── css/
│   ├── style.css       # Base styles
│   ├── styleV2.css     # V2 enhancements
│   └── styleV3.css     # V3/V4 specific styles (Modals, Toggles)
└── js/
    ├── jsB.js          # Security & Auth module
    ├── deriv.js        # Deriv WebSocket wrapper
    ├── indicators.js   # Core technical indicators
    ├── SMCIndicator.js # Smart Money Concepts logic
    ├── SMCChartRenderer.js # Visual renderer for SMC elements
    ├── mainV3.js       # Logic for indexV3.html
    ├── mainV4.js       # Logic for indexV4.html (SMC, V4 features)
    ├── trader.js       # Trading Logic (Used in V4)
    ├── trade.js        # Trading Logic (Used in V3)
    └── backgroundColorZonesPlugin.js # Chart background zones
```

---

## indexV4.html Features (SMC Version)

### 1. Smart Money Concepts (SMC)
- **Visualization**: Automatically draws Order Blocks, FVGs, and Market Structure on the chart.
- **Controls**:
  - `⚡ SMC` Toggle: Master switch for all SMC elements.
  - **Legend Checkboxes**: Toggle individual elements:
    - OB Bear / OB Bull
    - FVG Bear / FVG Bull
  - **Renderer**: Uses `SMCChartRenderer.js` to draw primitives (Boxes, Lines) on the Lightweight Chart.

### 2. Advanced Chart Zones
- **Choppy Zones**: Background colors change based on CI (Trending vs Choppy).
- **RSI Zones**: Background highlights Oversold (Buy) and Overbought (Sell) areas.
- **Alternate Color Zones**: Detects and marks "confused" markets with alternating candle colors (e.g., R-G-R-G).

### 3. StatusCode Markers
- **Integration**: Loads `CodeCandleMaster.json` via `js/CodeColorMaster.js`.
- **Functionality**:
  - Enter specific Status Codes (e.g., "25,30").
  - Click "Show Marker" to visualize where these codes occurred.
  - "Auto Show" checkbox to mark new candles automatically.

### 4. Lag Alerts
- **Condition**: EMA Medium Slope DOWN + EMA Long Slope UP.
- **Feedback**:
  - "LAG" label appears in red/orange.
  - **Audio Alert**: Plays `notification-ding-dong-432437.mp3` (with fallback to beep) if enabled.
  - **Cooldown**: Prevents spamming alerts (30s cooldown per symbol).

---

## indexV3.html Features (Verified 2026-02-04)

### 🎯 **Main Features**
- **Tabbed Settings Modal**: Organized controls (Controls, EMA, Token, Trading).
- **EMA Color Customization**: Persistent custom colors for all 3 EMA lines.
- **Analysis Version Switcher**: Toggle between V1 (Inline) and V2 (Class-based) analysis generation.
- **Analysis Data Viewer**: Live JSON view of the analysis data for debugging/verification.
- **Trading Module**: Uses `js/trade.js` for execution.

---

## indexV2.html Features (Main Focus)

### 1. Top 8 Asset Display
- Fetches data for all 10 Volatility Index assets
- Calculates score: `ADX + (100 - CI) + Candle Bonus`
- Displays only top 8 assets sorted by score
- Compact cards with mini Choppy Meters

### 2. EMA Settings Panel
Configurable moving average settings:
| Setting | Short | Medium | Long |
|---------|-------|--------|------|
| Type | EMA/SMA/WMA | EMA/SMA/WMA | EMA/SMA/WMA |
| Period | 7 (default) | 25 (default) | 99 (default) |
| Show | Toggle | Toggle | Toggle |

### 3. ATR Anomaly Detection
Highlights abnormal candles when size > ATR × Multiplier:
- **Period**: 14 (default)
- **Multiplier**: 1.5 (default)
- **Normal Up**: `#22c55e` (green)
- **Normal Down**: `#ef4444` (red)
- **Abnormal Up**: `#00ff00` (bright green)
- **Abnormal Down**: `#ff0000` (bright red)

### 4. Selected Asset Chart Panel
- Click any meter card → Shows interactive chart
- **LightweightCharts** candlestick with 3 EMA lines
- **Chart updates every 2 seconds** (independent of meter refresh)
- EMA Slope & Crossover Analysis sidebar
- **Dynamic Tooltip** on crosshair hover

### 5. EMA Crossover Alert
- Beep toggle for audio alerts
- Detects Golden Cross / Death Cross (Medium × Long)
- Different pitch for Golden (800Hz) vs Death (400Hz)

### 6. Auto-Refresh & Polling
- **Meters**: Update based on Auto Refresh interval (1-15 min)
- **Chart**: Updates every 2 seconds when asset selected

### 7. LocalStorage Persistence
All settings saved/loaded automatically:
- Timeframe, Refresh Interval
- Beep Toggle
- EMA Short/Medium/Long (type, period, show)
- ATR (period, multiplier, show)
- **Analysis Settings** (flatThreshold, macdThreshold, HMA/EHMA periods, BB settings)
- **Tooltip Fields Selection**

### 8. Analysis Settings Modal (NEW)
- **Flat Threshold**: Determines when EMA direction is "Flat" vs trending
- **MACD Threshold**: Determines convergence/divergence detection
- **HMA Period**: Hull Moving Average period
- **EHMA Period**: Exponential Hull Moving Average period
- **BB Period/StdDev**: Bollinger Bands configuration

### 9. Tooltip Fields Modal (NEW)
- Select which fields to display in the chart tooltip
- Categories: Basic Info, EMA Short/Medium/Long, Crossover & MACD, Indicators, Bollinger Bands, Candle Structure, Crossover Positions

### 10. Analysis Data Generation (NEW)
Complete analysis object per candle including:
- Candle time, color, pip size
- EMA values, directions, turn types (using flatThreshold)
- MACD values, convergence/divergence types
- CI, ADX, ATR, Bollinger Bands
- Candle structure (wick, body percentages)
- Crossover tracking (Golden/Death, candles since)

### 11. Auto Trading Features
**Trading Panel UI:**
- API Token input with Authorize button
- Digital Clock (Thai time UTC+7)
- Duration, Duration Unit, Money/Trade, Trade Type, Target Profit settings
- Start/Stop Trading buttons with status display

**Trading Logic:**
- `getAction()` - Returns CALL (emaMedium > emaLong) or PUT (emaMedium < emaLong)
- `checkEntry()` - Checks at second 0 of each timeframe candle
- `executeTrade()` - Sends proposal then buy to Deriv API
- `processTradeResult()` - Updates stats, continues trading until target

---

## Technical Indicators (js/indicators.js)

| Function | Description |
|----------|-------------|
| `sma(data, period)` | Simple Moving Average |
| `rma(data, period)` | Wilder's Smoothing (RMA) |
| `tr(high, low, close)` | True Range |
| `adx(high, low, close, period)` | Average Directional Index |
| `ci(high, low, close, period)` | Choppiness Index |
| `ema(data, period)` | Exponential Moving Average |
| `atr(high, low, close, period)` | Average True Range |
| `wma(data, period)` | Weighted Moving Average (**NEW**) |
| `hma(data, period)` | Hull Moving Average (**NEW**) |
| `ehma(data, period)` | Exponential Hull Moving Average (**NEW**) |
| `bollingerBands(data, period, stdDev)` | Bollinger Bands (**NEW**) |
| `rsi(data, period)` | Relative Strength Index (**NEW**) |

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│  refreshData() - Every 60s (based on refreshInterval)                  │
│     └─> Fetch data for all 10 assets                                    │
│         └─> processCandles() × 10 assets                                │
│             ├─> Calculate Indicators (CI, ADX, EMA, ATR, BB, SMC)       │
│             ├─> Generate Analysis Data                                  │
│             └─> Render Grid (Top 8 Choppy Meters)                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  startChartPolling() - When asset selected                              │
│     └─> fetchSelectedAssetData() Every 2s (1 asset)                     │
│         └─> processChartData()                                          │
│             ├─> Calculate Indicators                                    │
│             ├─> Update Chart Series (Candles, EMA, SMC)                 │
│             └─> Update Analysis Panel & Tooltip                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Recent Changes Log

### 2026-02-01 - Lag Detection & Audio Alerts

49. ✅ **EMA Lag Detection (UI + Alerts)**:
    - Added detection for a specific lag condition: **EMA Medium slope = Down** while **EMA Long slope = Up**.
    - Shows a clear warning in the EMA Slope & Crossover panel when detected (labelled "LAG").
    - Implemented across V2/V3/V4 chart panels (`js/mainV2.js`, `js/mainV3.js`, `js/mainV4.js`).

50. ✅ **Trading Panel Lag Controls**:
    - Added a Lag status label and a checkbox `Enable lag sound alerts`.
    - The label updates live to `LAG` / `OK` for the selected symbol.

51. ✅ **Audio Alerts with Fallback**:
    - Plays `sounds/notification-ding-dong-432437.mp3` 3 times when lag is detected.
    - If MP3 fails, a WebAudio fallback (`playLagBeep`) generates a beep sequence.

52. ✅ **Trading Symbol Lock**:
    - Added a "🔒 Lock" checkbox next to the Trading Symbol in the trading panel (`indexV4.html` / `js/trader.js`).
    - **Function**: Prevents the trading symbol from changing when you click other assets to view their charts.
    - Useful for analyzing other pairs while keeping the active trading pair fixed.

### 2026-01-30 - CodeCandle Master & Zones

43. ✅ **CodeCandle Master Data Integration**:
    - Added `js/CodeColorMaster.js` to project
    - Auto-loads CodeCandle data from backend
    - Supports StatusCode lookup from `CodeCandleMaster.json`

44. ✅ **StatusCode Marker Controls**:
    - Added input field `txtStatusCode` for entering StatusCode values
    - Added "📍 Show Marker" button and "Auto" mode to track specific candle patterns on the chart.

### 2026-02-09 - UI & Analysis Enhancements

59. ✅ **Quick Decision Table**:
    - **Layout**: Two-column layout (Charts Left, Decision Table Right).
    - **Features**: Thai explanations, matched rules, and entry checklist (BUY/SELL/IDLE).
    - **Dynamic Updates**: Real-time population based on market analysis.

60. ✅ **Multi-Asset Analysis V2**:
    - **Selection**: Checkboxes for selecting multiple Deriv assets.
    - **Execution**: Batch analysis generation with support for parallel API requests.
    - **Docs**: detailed field descriptions added to `clsAnalysisGeneratorV2.js`.

61. ✅ **Order Table Enhancements**:
    - **Columns**: Added "Target" column to the main Track Order table.
    - **Visuals**: Profit/Loss numbers colored (Green for Profit, Red for Loss).

### 2026-02-07 - Performance & Trading Tools

62. ✅ **Super Kernel (GPU Parsing)**:
    - **Batch Processing**: Implemented GPU-based batch processing for indicators in `multiAsset.html`.
    - **Performance**: improved throughput for multi-asset analysis.

63. ✅ **Trading Controls**:
    - **Trade Duration**: Added "Long Term" (30m) and "Short Term" (55s) toggles in bottom menu.
    - **Break-Even Logic**: Precise "Profit Zero" tracking (0-0.1 range) and new Entry/Market Price stats.

64. ✅ **Integrations**:
    - **Telegram Bot**: Added Settings for Token/Chat ID to send trade results.
### 2026-02-10 - Incremental Analysis & Meter Fixes

65. ✅ **AnalysisGeneratorV3 (Incremental Updates)**:
    - **New Class**: `js/clsAnalysisGeneratorV3.js` supports incremental indicator calculation.
    - **Optimization**: Calculates only the newest candle using stored state (EMA, RSI, ADX) instead of recalculating the entire history.
    - **Performance**: Improved real-time performance for high-frequency updates.

66. ✅ **Meter Strip Correction**:
    - **Fix**: Removed `.reverse()` from `recentCandles` in `js/mainV4.js`.
    - **Result**: Meter strip now displays candles in chronological order (Left=Oldest, Right=Newest), matching the main chart direction.

### 2026-02-10 - Micro Tick Stream & Chart Fixes

67. ✅ **Micro Tick Visualization (indexV5.html)**:
    - **Container**: Added a "Micro Tick Stream" section below the main chart to visualize real-time price ticks.
    - **SVG Icons**: Created high-quality SVG icons (`green_arrow_up.svg`, `red_arrow_down.svg`) for clear visual feedback.
    - **Dynamic Display**:
        - Shows a stream of green (Up) and red (Down) arrows as new ticks arrive.
        - **Configurable Limit**: Added an input field to set the display limit (N), automatically removing the oldest ticks.
    - **Auto-Start**: Feature is forced enabled on initialization if the container exists.

68. ✅ **Bug Fixes**:
    - **Chart Disposal Error**: Fixed "Object is disposed" error in `lightweight-charts` by properly resetting `appV4.state.bgZonesPlugin` on chart initialization and destruction.

69. ✅ **Micro Tick Summary (indexV5.html)**:
    - **Logic**: Added `updateMicroTickSummary` to calculate last 10 ticks direction (Red vs Green).
    - **UI**: Displays percentage with icon (🔴/🟢) based on dominant direction, to the left of "Display Limit" input.
331: 
332: 70. ✅ **Rust Migration Plan**:
333:     - **Artifact**: Created `plan_convert_to_rust.md`.
334:     - **Scope**: Detailed 5-phase roadmap for migrating the application to Rust + Tauri.
335:     - **Phases**: Setup -> Core Logic (Indicators) -> Trading Engine -> GPU Compute -> UI Polish.

336. ✅ **Prevent Duplicate Trade**:
338.     - **Logic**: Blocks new trade execution if there are any active orders for the current session.

### 2026-02-10 - Strong/Weak Alert Zones, EMA Cleanup & Stop Meter

71. ✅ **Strong/Weak Alert Zone Visualization (SMCChartRenderer.js)**:
    - **Feature**: Added a toggleable "⚠️ S/W Alert" checkbox in the SMC legend panel (`indexV5.html`).
    - **Zone Rendering**: When enabled, Strong/Weak levels render as **semi-transparent filled zones** (boxes) instead of thin lines, using the same `createBoxPrimitive` rendering method as Order Blocks.
    - **Fallback System**: 3-tier fallback (Box Primitive → Thick LineSeries lineWidth:6 → PriceLines) matching the OB fallback pattern for guaranteed visibility.
    - **Colors**:
        - Strong High: 🟣 Purple (`rgba(168, 85, 247, 0.25)`)
        - Strong Low: 🟠 Orange (`rgba(251, 146, 60, 0.25)`)
        - Weak High: Light Purple (`rgba(168, 85, 247, 0.15)`)
        - Weak Low: Light Orange (`rgba(251, 146, 60, 0.15)`)
    - **Zone Width**: ±0.5% of price level (visible band).
    - **Center Line**: Dashed line (lineWidth: 2) at exact price with label.
    - **Bug Fix**: `showStrongWeak` and `showStrongWeakAlert` were missing from the `renderAll` options in `updateSelectedChart()` — added to properly pass the alert mode flag.

72. ✅ **Strong/Weak Proximity Alert System (mainV4.js)**:
    - **Function**: `checkStrongWeakAlert()` checks if current price is within 0.02% of any Strong/Weak level.
    - **Audio Alert**: Plays `lag-alert-audio` sound or fallback beep when triggered.
    - **Visual Hint**: Temporary yellow warning in `trading-status` element.
    - **Cooldown**: 1-minute cooldown per alert to prevent spam.
    - **Integration**: Called from `processChartData()` on every data update.

73. ✅ **EMA Price Line Removal (mainV4.js)**:
    - **Change**: Added `priceLineVisible: false` and `lastValueVisible: false` to all 3 EMA LineSeries (Short, Medium, Long).
    - **Result**: Removed the horizontal dashed lines and right-axis labels from EMA series, keeping only the EMA curves along candlesticks for a cleaner chart.

74. ✅ **Stop Meter Feature (indexV5.html + mainV4.js + trade.js)**:
    - **UI**: Added "⏸️ Stop Meter" checkbox in the header bar (yellow accent, next to Settings button).
    - **Manual Control**: User can toggle to pause/resume the choppy meter grid refresh during trading.
    - **Auto-Pause on Trade Entry**: When `handleBuy()` succeeds in `trade.js`, the checkbox is automatically checked and grid refresh stops.
    - **Auto-Resume on Trade End**: When the last active contract closes (sold/expired) in `handleContractUpdate()`, the checkbox is automatically unchecked and grid refresh resumes.
    - **Scope**: Only pauses `refreshData()` (the grid/meter polling). Chart polling, Micro Tick Stream, and WebSocket connection remain active.
    - **State**: `appV4.state.stopMeterChoppy` boolean flag + `appV4.toggleStopMeter()` function.
