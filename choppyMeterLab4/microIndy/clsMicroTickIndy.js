/**
 * clsMicroTickIndy - Micro Tick Indicator Class
 *
 * Price Impact Momentum Tracker
 * Analyzes price movements using:
 * - Divergence Detection
 * - Strength Threshold Monitoring
 * - Pattern Recognition
 *
 * @version 1.0.0
 * @author Price Impact Analysis Team
 */

 /*
 const indy = new clsMicroTickIndy();

ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.msg_type === 'candles') {
        // Historical data
        indy.setCandles(data.candles);
    } else if (data.msg_type === 'ohlc') {
        // Real-time update
        indy.updateCandle(data.ohlc);
    }
};
```

---

## 📊 โครงสร้าง Class
```
clsMicroTickIndy
├── Properties
│   ├── config (maxArrows, maxChange, thresholds)
│   ├── candles (raw candle data)
│   ├── arrowData (processed arrows)
│   ├── minuteSummaries (minute analysis)
│   ├── alerts (detected alerts)
│   └── stats (statistics)
│
├── Public Methods
│   ├── addCandle()
│   ├── updateCandle()
│   ├── setCandles()
│   ├── getArrows()
│   ├── getMinuteSummaries()
│   ├── getAlerts()
│   ├── getStats()
│   ├── getData()
│   ├── updateConfig()
│   ├── getConfig()
│   ├── clear()
│   └── on()
│
├── Private Methods
│   ├── processCandles()
│   ├── calculateArrowData()
│   ├── processMinuteSummaries()
│   ├── runAnalysis()
│   ├── detectDivergence()
│   ├── checkStrengthThreshold()
│   ├── recognizePattern()
│   └── isDuplicateAlert()
│
└── Static Methods
    ├── formatTime()
    ├── formatDate()
    └── getVersion()

 */

class clsMicroTickIndy {
    /**
     * Constructor
     * @param {Object} config - Configuration object
     */
    constructor(config = {}) {
        // Configuration
        this.config = {
            maxArrows: config.maxArrows || 30,
            maxChange: config.maxChange || 1.0,
            thresholds: config.thresholds || {
                low: 0.001,
                medium: 0.003,
                high: 0.005,
                extreme: 0.010
            },
            marketType: config.marketType || 'volatility', // 'volatility', 'forex', 'crypto'
        };

        // Data storage
        this.candles = [];
        this.minuteSummaries = [];
        this.alerts = [];
        this.arrowData = [];

        // Statistics
        this.stats = {
            totalCandles: 0,
            avgChange: 0,
            maxChange: 0,
            upCount: 0,
            downCount: 0
        };

        // Callbacks
        this.callbacks = {
            onAlert: null,
            onArrowUpdate: null,
            onStatsUpdate: null
        };
    }

    /**
     * Set callback functions
     * @param {String} event - Event name ('alert', 'arrowUpdate', 'statsUpdate')
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        switch(event) {
            case 'alert':
                this.callbacks.onAlert = callback;
                break;
            case 'arrowUpdate':
                this.callbacks.onArrowUpdate = callback;
                break;
            case 'statsUpdate':
                this.callbacks.onStatsUpdate = callback;
                break;
        }
    }

    /**
     * Add new candle data
     * @param {Object} candle - Candle object {time, open, high, low, close}
     */
    addCandle(candle) {
        this.candles.push({
            time: candle.time,
            open: parseFloat(candle.open),
            high: parseFloat(candle.high),
            low: parseFloat(candle.low),
            close: parseFloat(candle.close)
        });

        // Process new candle
        this.processCandles();
    }

    /**
     * Update existing candle (for real-time updates)
     * @param {Object} candle - Updated candle object
     */
    updateCandle(candle) {
        if (this.candles.length === 0) {
            this.addCandle(candle);
            return;
        }

        const lastCandle = this.candles[this.candles.length - 1];

        if (lastCandle.time === candle.time) {
            // Update existing candle
            this.candles[this.candles.length - 1] = {
                time: candle.time,
                open: parseFloat(candle.open),
                high: parseFloat(candle.high),
                low: parseFloat(candle.low),
                close: parseFloat(candle.close)
            };
        } else {
            // New candle
            this.addCandle(candle);
        }

        this.processCandles();
    }

    /**
     * Set candles data in bulk
     * @param {Array} candles - Array of candle objects
     */
    setCandles(candles) {
        this.candles = candles.map(c => ({
            time: c.time,
            open: parseFloat(c.open),
            high: parseFloat(c.high),
            low: parseFloat(c.low),
            close: parseFloat(c.close)
        }));

        this.processCandles();
    }

    /**
     * Process candles and generate arrows
     * @private
     */
    processCandles() {
        if (this.candles.length < 2) return;

        this.arrowData = [];
        let totalChange = 0;
        let maxChange = 0;
        let upCount = 0;
        let downCount = 0;

        // Calculate arrows for last N candles
        const displayCount = Math.min(this.config.maxArrows, this.candles.length - 1);
        const startIndex = Math.max(0, this.candles.length - displayCount - 1);

        for (let i = startIndex + 1; i < this.candles.length; i++) {
            const current = this.candles[i];
            const previous = this.candles[i - 1];
            const arrow = this.calculateArrowData(current, previous);

            this.arrowData.push(arrow);

            totalChange += Math.abs(arrow.change);
            maxChange = Math.max(maxChange, Math.abs(arrow.change));

            if (arrow.direction === 'up') upCount++;
            else downCount++;
        }

        // Update statistics
        this.stats = {
            totalCandles: this.candles.length,
            avgChange: this.arrowData.length > 0 ? totalChange / this.arrowData.length : 0,
            maxChange: maxChange,
            upCount: upCount,
            downCount: downCount
        };

        // Process minute summaries
        this.processMinuteSummaries();

        // Run analysis
        this.runAnalysis();

        // Trigger callbacks
        if (this.callbacks.onArrowUpdate) {
            this.callbacks.onArrowUpdate(this.arrowData);
        }
        if (this.callbacks.onStatsUpdate) {
            this.callbacks.onStatsUpdate(this.stats);
        }
    }

    /**
     * Calculate arrow data for a candle
     * @private
     * @param {Object} current - Current candle
     * @param {Object} previous - Previous candle
     * @returns {Object} Arrow data
     */
    calculateArrowData(current, previous) {
        const priceChange = ((current.close - previous.close) / previous.close) * 100;
        const absChange = Math.abs(priceChange);

        let opacity = absChange / this.config.maxChange;
        opacity = Math.max(0.1, Math.min(1.0, opacity));

        return {
            direction: priceChange >= 0 ? 'up' : 'down',
            opacity: opacity,
            change: priceChange,
            time: current.time,
            currentClose: current.close,
            previousClose: previous.close,
            priceChangeAbs: current.close - previous.close
        };
    }

    /**
     * Process minute summaries
     * @private
     */
    processMinuteSummaries() {
        const minuteGroups = {};

        this.arrowData.forEach(arrow => {
            const date = new Date(arrow.time * 1000);
            const minuteKey = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

            if (!minuteGroups[minuteKey]) {
                minuteGroups[minuteKey] = {
                    time: arrow.time,
                    minuteKey: minuteKey,
                    arrows: [],
                    upCount: 0,
                    downCount: 0,
                    upTotalChange: 0,
                    downTotalChange: 0,
                    closePrice: arrow.currentClose
                };
            }

            minuteGroups[minuteKey].arrows.push(arrow);
            minuteGroups[minuteKey].closePrice = arrow.currentClose;

            if (arrow.direction === 'up') {
                minuteGroups[minuteKey].upCount++;
                minuteGroups[minuteKey].upTotalChange += arrow.priceChangeAbs;
            } else {
                minuteGroups[minuteKey].downCount++;
                minuteGroups[minuteKey].downTotalChange += arrow.priceChangeAbs;
            }
        });

        // Convert to array and calculate net impact
        this.minuteSummaries = Object.values(minuteGroups).map(data => ({
            ...data,
            netImpact: data.upTotalChange + data.downTotalChange
        })).sort((a, b) => a.time - b.time);
    }

    /**
     * Run all analysis (Divergence, Strength, Pattern)
     * @private
     */
    runAnalysis() {
        const newAlerts = [];

        // 1. Divergence Detection
        const divergence = this.detectDivergence();
        if (divergence && !this.isDuplicateAlert('divergence', divergence, 60000)) {
            newAlerts.push({
                category: 'divergence',
                data: divergence,
                timestamp: new Date().toLocaleTimeString('th-TH'),
                createdAt: Date.now()
            });
        }

        // 2. Strength Threshold
        if (this.minuteSummaries.length > 0) {
            const latestSummary = this.minuteSummaries[this.minuteSummaries.length - 1];
            const previousSummaries = this.minuteSummaries.slice(0, -1);
            const strengthAlerts = this.checkStrengthThreshold(latestSummary, previousSummaries);

            strengthAlerts.forEach(alert => {
                if (!this.isDuplicateAlert('strength', alert, 30000)) {
                    newAlerts.push({
                        category: 'strength',
                        data: alert,
                        timestamp: new Date().toLocaleTimeString('th-TH'),
                        createdAt: Date.now()
                    });
                }
            });
        }

        // 3. Pattern Recognition
        const pattern = this.recognizePattern();
        if (pattern && !this.isDuplicateAlert('pattern', pattern, 120000)) {
            newAlerts.push({
                category: 'pattern',
                data: pattern,
                timestamp: new Date().toLocaleTimeString('th-TH'),
                createdAt: Date.now()
            });
        }

        // Add new alerts
        this.alerts.push(...newAlerts);

        // Limit alerts to last 20
        if (this.alerts.length > 20) {
            this.alerts = this.alerts.slice(-20);
        }

        // Trigger alert callback
        if (newAlerts.length > 0 && this.callbacks.onAlert) {
            this.callbacks.onAlert(newAlerts);
        }
    }

    /**
     * Check if alert is duplicate
     * @private
     * @param {String} category - Alert category
     * @param {Object} alertData - Alert data
     * @param {Number} timeWindow - Time window in milliseconds
     * @returns {Boolean}
     */
    isDuplicateAlert(category, alertData, timeWindow) {
        return this.alerts.some(a => {
            if (a.category !== category) return false;
            if (Date.now() - a.createdAt > timeWindow) return false;

            switch(category) {
                case 'divergence':
                    return a.data.type === alertData.type;
                case 'strength':
                    return a.data.level === alertData.level;
                case 'pattern':
                    return a.data.pattern === alertData.pattern;
                default:
                    return false;
            }
        });
    }

    /**
     * Detect Divergence
     * @private
     * @returns {Object|null} Divergence data or null
     */
    detectDivergence() {
        if (this.minuteSummaries.length < 3) return null;

        const last3 = this.minuteSummaries.slice(-3);
        const prices = last3.map(s => s.closePrice);
        const impacts = last3.map(s => s.netImpact);

        // Bullish Divergence: Price Lower Low, Impact Higher Low
        const priceLowerLow = prices[2] < prices[1] && prices[1] < prices[0];
        const impactHigherLow = impacts[2] > impacts[1] && impacts[1] > impacts[0];

        if (priceLowerLow && impactHigherLow && impacts[2] < 0) {
            return {
                type: 'BULLISH',
                icon: '📈',
                title: 'Bullish Divergence Detected',
                message: 'ราคาทำ Lower Low แต่แรงขายลดลง',
                prediction: 'มีโอกาสกลับตัวขึ้น',
                strength: this.calculateDivergenceStrength(prices, impacts),
                data: {
                    prices: prices.map(p => p.toFixed(5)),
                    impacts: impacts.map(i => i.toFixed(5))
                }
            };
        }

        // Bearish Divergence: Price Higher High, Impact Lower High
        const priceHigherHigh = prices[2] > prices[1] && prices[1] > prices[0];
        const impactLowerHigh = impacts[2] < impacts[1] && impacts[1] < impacts[0];

        if (priceHigherHigh && impactLowerHigh && impacts[2] > 0) {
            return {
                type: 'BEARISH',
                icon: '📉',
                title: 'Bearish Divergence Detected',
                message: 'ราคาทำ Higher High แต่แรงซื้อลดลง',
                prediction: 'มีโอกาสกลับตัวลง',
                strength: this.calculateDivergenceStrength(prices, impacts),
                data: {
                    prices: prices.map(p => p.toFixed(5)),
                    impacts: impacts.map(i => i.toFixed(5))
                }
            };
        }

        return null;
    }

    /**
     * Calculate divergence strength
     * @private
     * @param {Array} prices - Price array
     * @param {Array} impacts - Impact array
     * @returns {String} 'STRONG', 'MEDIUM', or 'WEAK'
     */
    calculateDivergenceStrength(prices, impacts) {
        const priceChange = Math.abs(prices[2] - prices[0]);
        const impactChange = Math.abs(impacts[2] - impacts[0]);
        const ratio = impactChange / (priceChange + 0.00001);

        if (ratio > 0.5) return 'STRONG';
        if (ratio > 0.3) return 'MEDIUM';
        return 'WEAK';
    }

    /**
     * Check Strength Threshold
     * @private
     * @param {Object} summary - Current minute summary
     * @param {Array} previousSummaries - Previous summaries
     * @returns {Array} Array of strength alerts
     */
    checkStrengthThreshold(summary, previousSummaries) {
        const netImpact = summary.netImpact;
        const absImpact = Math.abs(netImpact);
        const direction = netImpact > 0 ? 'UP' : 'DOWN';
        const results = [];

        // Extreme Spike
        if (absImpact > this.config.thresholds.extreme) {
            results.push({
                level: 'EXTREME',
                icon: '🚨',
                title: `EXTREME ${direction} SPIKE!`,
                message: `Net Impact: ${netImpact >= 0 ? '+' : ''}${netImpact.toFixed(5)} (${(netImpact/summary.closePrice*100).toFixed(3)}%)`,
                prediction: 'ระวัง! Momentum แรงมาก อาจมีข่าวสำคัญ',
                color: 'extreme'
            });
        } else if (absImpact > this.config.thresholds.high) {
            results.push({
                level: 'HIGH',
                icon: '⚠️',
                title: `HIGH ${direction} MOMENTUM`,
                message: `Net Impact: ${netImpact >= 0 ? '+' : ''}${netImpact.toFixed(5)}`,
                prediction: 'Momentum แรง - สังเกตการณ์',
                color: 'high'
            });
        }

        // Sustained Strength
        if (previousSummaries.length >= 2) {
            const last3 = [...previousSummaries.slice(-2), summary];
            const allSameDirection = last3.every(s => (s.netImpact > 0) === (netImpact > 0));
            const allHigh = last3.every(s => Math.abs(s.netImpact) > this.config.thresholds.medium);

            if (allSameDirection && allHigh) {
                results.push({
                    level: 'SUSTAINED',
                    icon: '🔄',
                    title: 'SUSTAINED MOMENTUM',
                    message: `ทิศทาง ${direction} ต่อเนื่อง 3 นาที`,
                    prediction: 'เทรนด์แข็งแกร่ง - พิจารณาติดตาม',
                    color: 'medium'
                });
            }
        }

        // Momentum Reversal
        if (previousSummaries.length >= 1) {
            const prev = previousSummaries[previousSummaries.length - 1];
            const prevAbs = Math.abs(prev.netImpact);

            if (absImpact > this.config.thresholds.medium &&
                prevAbs > this.config.thresholds.medium &&
                (prev.netImpact > 0) !== (netImpact > 0)) {
                results.push({
                    level: 'REVERSAL',
                    icon: '↩️',
                    title: 'MOMENTUM REVERSAL!',
                    message: `จาก ${prev.netImpact > 0 ? 'UP' : 'DOWN'} → ${direction}`,
                    prediction: 'กลับทิศทันที - ระวังการเปลี่ยนแปลง',
                    color: 'high'
                });
            }
        }

        return results;
    }

    /**
     * Recognize Pattern
     * @private
     * @returns {Object|null} Pattern data or null
     */
    recognizePattern() {
        if (this.minuteSummaries.length < 5) return null;

        const last5 = this.minuteSummaries.slice(-5);

        // Helper: Check trend
        const checkTrend = (values) => {
            let upCount = 0;
            for (let i = 1; i < values.length; i++) {
                if (values[i] > values[i-1]) upCount++;
            }
            if (upCount >= values.length * 0.7) return 'UP';
            if (upCount <= values.length * 0.3) return 'DOWN';
            return 'SIDEWAYS';
        };

        const upCountTrend = checkTrend(last5.map(s => s.upCount));
        const downCountTrend = checkTrend(last5.map(s => s.downCount));
        const netImpactTrend = checkTrend(last5.map(s => s.netImpact));

        // 1. Accumulation Pattern
        if (upCountTrend === 'UP' && netImpactTrend === 'UP') {
            return {
                pattern: 'ACCUMULATION',
                icon: '📊',
                title: 'Accumulation Pattern',
                message: 'แรงซื้อกำลังสะสมตัวเรื่อยๆ',
                prediction: 'อาจเกิด Breakout ขึ้นในเร็วๆ นี้',
                confidence: 'HIGH',
                visual: last5.map(s => s.upCount > s.downCount ? '▲' : '▼').join(' ')
            };
        }

        // 2. Distribution Pattern
        if (downCountTrend === 'UP' && netImpactTrend === 'DOWN') {
            return {
                pattern: 'DISTRIBUTION',
                icon: '📊',
                title: 'Distribution Pattern',
                message: 'แรงขายกำลังเพิ่มขึ้นเรื่อยๆ',
                prediction: 'อาจเกิด Breakout ลงในเร็วๆ นี้',
                confidence: 'HIGH',
                visual: last5.map(s => s.upCount > s.downCount ? '▲' : '▼').join(' ')
            };
        }

        // 3. Consolidation Pattern
        const avgNetImpact = last5.reduce((sum, s) => sum + Math.abs(s.netImpact), 0) / 5;
        const upDownBalance = last5.every(s => Math.abs(s.upCount - s.downCount) <= 2);

        if (avgNetImpact < this.config.thresholds.low && upDownBalance) {
            return {
                pattern: 'CONSOLIDATION',
                icon: '↔️',
                title: 'Consolidation Pattern',
                message: 'ตลาดรวมตัว ไม่มีทิศทางชัด',
                prediction: 'รอ Breakout - เตรียมพร้อมเข้าเทรด',
                confidence: 'MEDIUM',
                visual: last5.map(s => '━').join(' ')
            };
        }

        // 4. Breakout Pattern
        const last = last5[last5.length - 1];
        const prev4Avg = last5.slice(0, 4).reduce((sum, s) => sum + Math.abs(s.netImpact), 0) / 4;

        if (Math.abs(last.netImpact) > prev4Avg * 2.5 && prev4Avg < this.config.thresholds.medium) {
            return {
                pattern: 'BREAKOUT',
                icon: '🚀',
                title: `Breakout ${last.netImpact > 0 ? 'ขึ้น' : 'ลง'}!`,
                message: `Net Impact กระโดดจาก ${prev4Avg.toFixed(5)} → ${last.netImpact.toFixed(5)}`,
                prediction: 'เทรนด์ใหม่เริ่มแล้ว - พิจารณาเข้าเทรด',
                confidence: 'HIGH',
                visual: '━━━━ ' + (last.netImpact > 0 ? '🚀▲' : '💥▼')
            };
        }

        // 5. Exhaustion Pattern
        const last3Impacts = last5.slice(-3).map(s => Math.abs(s.netImpact));
        const impactDecreasing = last3Impacts[2] < last3Impacts[1] && last3Impacts[1] < last3Impacts[0];
        const stillSameDirection = last5.slice(-3).every(s =>
            (s.netImpact > 0) === (last5[0].netImpact > 0)
        );

        if (impactDecreasing && stillSameDirection && last3Impacts[0] > this.config.thresholds.medium) {
            return {
                pattern: 'EXHAUSTION',
                icon: '⚠️',
                title: 'Exhaustion Pattern',
                message: 'แรงเริ่มหมด ทั้งที่ยังไปทิศทางเดิม',
                prediction: 'ใกล้จุดกลับตัว - พิจารณาปิดออร์เดอร์',
                confidence: 'MEDIUM',
                visual: last5.map((s, i) => i < 2 ? '▲' : '△').join(' ')
            };
        }

        return null;
    }

    /**
     * Get all data
     * @returns {Object} All data
     */
    getData() {
        return {
            candles: this.candles,
            arrows: this.arrowData,
            minuteSummaries: this.minuteSummaries,
            alerts: this.alerts,
            stats: this.stats
        };
    }

    /**
     * Get arrows data
     * @returns {Array} Arrow data
     */
    getArrows() {
        return this.arrowData;
    }

    /**
     * Get minute summaries
     * @returns {Array} Minute summaries
     */
    getMinuteSummaries() {
        return this.minuteSummaries;
    }

    /**
     * Get alerts
     * @param {Number} limit - Number of recent alerts to return
     * @returns {Array} Alerts
     */
    getAlerts(limit = 6) {
        return this.alerts.slice(-limit).reverse();
    }

    /**
     * Get statistics
     * @returns {Object} Statistics
     */
    getStats() {
        return this.stats;
    }

    /**
     * Clear all data
     */
    clear() {
        this.candles = [];
        this.minuteSummaries = [];
        this.alerts = [];
        this.arrowData = [];
        this.stats = {
            totalCandles: 0,
            avgChange: 0,
            maxChange: 0,
            upCount: 0,
            downCount: 0
        };
    }

    /**
     * Update configuration
     * @param {Object} newConfig - New configuration
     */
    updateConfig(newConfig) {
        this.config = {
            ...this.config,
            ...newConfig
        };

        // Reprocess if config changes affect calculations
        if (this.candles.length > 0) {
            this.processCandles();
        }
    }

    /**
     * Get current configuration
     * @returns {Object} Configuration
     */
    getConfig() {
        return { ...this.config };
    }

    /**
     * Format time from timestamp
     * @param {Number} timestamp - Unix timestamp
     * @returns {String} Formatted time
     */
    static formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    /**
     * Format date from timestamp
     * @param {Number} timestamp - Unix timestamp
     * @returns {String} Formatted date
     */
    static formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('th-TH');
    }

    /**
     * Get version
     * @returns {String} Version
     */
    static getVersion() {
        return '1.0.0';
    }
}

// Export for use in Node.js or as module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = clsMicroTickIndy;
}