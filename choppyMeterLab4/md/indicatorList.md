# Indicator & SMC (FVG / Order Block) Function Index

Generated from `indexV4.html` script references and related JS files.

## Summary
- Purpose: list functions and their source files related to indicators (EMA, SMA, HMA, EHMA, ATR, ADX, CI, RSI, Bollinger) and SMC features (FVG, Order Blocks, Swing Points, Structures).
- File: md/indicatorList.md
- Collected from: `js/indicators.js`, `js/clsAnalysisGenerator.js`, `js/SMCIndicator.js`, `js/SMCIndicator.standalone.js`, `js/SMCChartRenderer.js`, `js/backgroundColorZonesPlugin.js`, `js/mainV4.js`.

---

## Files & Functions

- js/indicators.js
  - `sma(data, period)`
  - `rma(data, period)`
  - `tr(high, low, close)`
  - `adx(high, low, close, period)`
  - `ci(high, low, close, period)`
  - `ema(data, period)`
  - `atr(high, low, close, period)`
  - `wma(data, period)`
  - `hma(data, period)`
  - `ehma(data, period)`
  - `bollingerBands(data, period, stdDevMultiplier)`
  - `rsi(data, period)`

- js/clsAnalysisGenerator.js (class `AnalysisGenerator`)
  - Core: `constructor(candleData, options)`, `generate()`, `getSummary()`, `toJSON()`
  - MA helpers: `calculateMA(data, period, type)`, `calculateEMA(data, period)`, `calculateHMA(data, period)`, `calculateEHMA(data, period)`, `calculateWMA(data, period)`
  - Other indicators: `calculateRSI(data, period)`, `calculateATR(data, period)`, `calculateATRWithTime(data, period)`, `calculateBB(data, period)`, `calculateCI(data, period)`, `calculateADX(data, period)`
  - Helpers: `getEMADirection(previousEMA, currentEMA)`, `getMACDConver(previousMACD, currentMACD)`

- js/SMCIndicator.js and js/SMCIndicator.standalone.js (class `SMCIndicator`)
  - Lifecycle: `constructor(config)`, `_reset()`
  - ATR & helpers: `_calculateATR(data, period)`, `_highest(...)`, `_lowest(...)`, `_indexOfMax(...)`, `_indexOfMin(...)`
  - Leg/structure detection: `_getLeg(index, size, prevLeg)`, `_processStructure(index, size, isInternal)`, `_processSwingPoints(index, size, isInternal, forEqualHL)`
  - Order Block & FVG: `_storeOrderBlock(pivot, currentIndex, bias, isInternal)`, `_checkOrderBlockMitigation(index)`, `_detectFVG(index)`, `_checkFVGFill(index)`
  - Misc: `_updateTrailingExtremes(index)`, `calculate(data)`
  - Getters: `getStructures(filter)`, `getSwingPoints(filter)`, `getOrderBlocks(filter)`, `getFairValueGaps(filter)`, `getEqualHighsLows(filter)`, `getTrend(level)`, `getAllResults()`

- js/SMCChartRenderer.js (class `SMCChartRenderer`)
  - Rendering lifecycle: `constructor(chart, candlestickSeries, config)`, `clear()`
  - Markers & structures: `renderSwingPoints(swingPoints)`, `renderStructures(structures)`
  - Primitives / boxes: `createBoxPrimitive(time1, time2, price1, price2, fillColor, borderColor)`
  - Render OB & FVG: `renderOrderBlocks(orderBlocks, currentTime)`, `renderFairValueGaps(fvgs, currentTime)`
  - Other renders: `renderEqualHighsLows(equalHLs)`, `renderPremiumDiscountZone(zone)`, `renderStrongWeakLevels(levels, endTime)`
  - High-level: `renderAll(smcResults, options)`
  - Integrations: uses `BackgroundColorZonesPlugin` when available

- js/backgroundColorZonesPlugin.js
  - Plugin class: `BackgroundColorZonesPlugin` (attach/detach, setZones, addZone, removeZone, clearZones, getZones)
  - Pane/renderer: `BackgroundZonesPaneView`, `BackgroundZonesRenderer` (draw)
  - Helper functions: `createCiRsiZones(candles, ciArray, rsiArray, options)`, `createZonesFromAnalysis(analysisData, options)`, `createCrossoverZones(analysisData)`, `createChoppyZones(analysisData, ciThreshold)`
  - Config manager: `ZoneConfigManager` (get/set/save)

- js/mainV4.js (appV4)
  - Indicator / SMC related methods:
    - `calculateMA(data, type, period)`
    - `processCandles(symbol, candles, updateGrid)`
    - `processChartData(symbol, candles)`
    - `detectCrossover(arrA, arrB)` (local helper)
    - `computeSlope(arr)` (local helper)
    - `generateAnalysisData(symbol, candles, emaArrays, ci, adx, atr, bbValues)` (invokes analysis generator)
    - `updateSelectedChart()` (applies EMA series, ATR anomaly coloring, merges SMC rendering)
    - `handleSmcDisplayToggle()` (toggle OB/FVG visibility)
    - `toggleSMC()` (show/hide SMC visuals)
    - `toggleChoppyZones()` (background zones)
    - `autoShowStatusCodeMarkers()` / `showStatusCodeMarkers()` (marker helpers interacting with SMC results)

## Notes / Next Steps
- SMC logic (FVG / Order Blocks) lives primarily in `js/SMCIndicator.js` and is rendered by `js/SMCChartRenderer.js` (primitives + markers).
- Indicator math is centralized in `js/indicators.js` and also re-implemented/adapted in `js/clsAnalysisGenerator.js` for analysis generation.
- Background zones (CI/RSI) and crossover/choppy-zone helpers are in `js/backgroundColorZonesPlugin.js`.

If you want, I can:
- Add line-number links to each file for quicker navigation.
- Extract a CSV or searchable JSON of function → file mapping.

---

Generated on 2026-02-01
