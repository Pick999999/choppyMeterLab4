/**
 * clsMicroTickIndy - Usage Examples
 * 
 * This file demonstrates how to use the clsMicroTickIndy class
 */

// ==================== EXAMPLE 1: Basic Usage ====================

console.log('=== Example 1: Basic Usage ===');

// 1. Create instance
const indy = new clsMicroTickIndy({
    maxArrows: 30,
    maxChange: 1.0,
    thresholds: {
        low: 0.001,
        medium: 0.003,
        high: 0.005,
        extreme: 0.010
    }
});

// 2. Add candle data
const sampleCandles = [
    { time: 1000, open: 1250.50, high: 1250.60, low: 1250.45, close: 1250.55 },
    { time: 1001, open: 1250.55, high: 1250.70, low: 1250.50, close: 1250.65 },
    { time: 1002, open: 1250.65, high: 1250.80, low: 1250.60, close: 1250.50 },
    { time: 1003, open: 1250.50, high: 1250.65, low: 1250.45, close: 1250.60 },
    { time: 1004, open: 1250.60, high: 1250.85, low: 1250.55, close: 1250.80 }
];

sampleCandles.forEach(candle => indy.addCandle(candle));

// 3. Get arrows
const arrows = indy.getArrows();
console.log('Arrows:', arrows);

// 4. Get statistics
const stats = indy.getStats();
console.log('Stats:', stats);


// ==================== EXAMPLE 2: With Callbacks ====================

console.log('\n=== Example 2: With Callbacks ===');

const indyWithCallbacks = new clsMicroTickIndy();

// Set up alert callback
indyWithCallbacks.on('alert', (alerts) => {
    console.log('🚨 New Alerts:', alerts);
    alerts.forEach(alert => {
        console.log(`  - ${alert.category}: ${alert.data.title}`);
    });
});

// Set up arrow update callback
indyWithCallbacks.on('arrowUpdate', (arrows) => {
    console.log(`📊 Arrows Updated: ${arrows.length} arrows`);
});

// Set up stats update callback
indyWithCallbacks.on('statsUpdate', (stats) => {
    console.log(`📈 Stats: Up ${stats.upCount}, Down ${stats.downCount}`);
});

// Add candles
sampleCandles.forEach(candle => indyWithCallbacks.addCandle(candle));


// ==================== EXAMPLE 3: Real-time Updates ====================

console.log('\n=== Example 3: Real-time Updates ===');

const realtimeIndy = new clsMicroTickIndy();

// Simulate real-time candle updates
function simulateRealtimeUpdate() {
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Update existing candle (OHLC updates)
    const updatingCandle = {
        time: currentTime,
        open: 1250.50,
        high: 1250.70,
        low: 1250.45,
        close: 1250.60  // This will change as candle updates
    };
    
    realtimeIndy.updateCandle(updatingCandle);
    
    // After some time, close is updated
    updatingCandle.close = 1250.65;
    updatingCandle.high = 1250.75;
    realtimeIndy.updateCandle(updatingCandle);
    
    console.log('Real-time candle updated');
}

simulateRealtimeUpdate();


// ==================== EXAMPLE 4: Bulk Data Loading ====================

console.log('\n=== Example 4: Bulk Data Loading ===');

const bulkIndy = new clsMicroTickIndy();

// Load historical data
const historicalCandles = Array.from({ length: 100 }, (_, i) => ({
    time: 1000 + i,
    open: 1250 + Math.random() * 2,
    high: 1251 + Math.random() * 2,
    low: 1249 + Math.random() * 2,
    close: 1250.5 + Math.random() * 2
}));

bulkIndy.setCandles(historicalCandles);
console.log(`Loaded ${bulkIndy.getStats().totalCandles} candles`);


// ==================== EXAMPLE 5: Pattern Detection ====================

console.log('\n=== Example 5: Pattern Detection ===');

const patternIndy = new clsMicroTickIndy();

// Set callback to detect patterns
patternIndy.on('alert', (alerts) => {
    alerts.forEach(alert => {
        if (alert.category === 'pattern') {
            console.log(`🔍 Pattern Detected: ${alert.data.pattern}`);
            console.log(`   Message: ${alert.data.message}`);
            console.log(`   Prediction: ${alert.data.prediction}`);
            console.log(`   Confidence: ${alert.data.confidence}`);
            console.log(`   Visual: ${alert.data.visual}`);
        }
    });
});

// Add data that creates an accumulation pattern
const accumulationData = [
    { time: 1000, open: 1250, high: 1250.5, low: 1249.5, close: 1250.2 },
    { time: 1060, open: 1250.2, high: 1250.7, low: 1250, close: 1250.5 },
    { time: 1120, open: 1250.5, high: 1251, low: 1250.3, close: 1250.8 },
    { time: 1180, open: 1250.8, high: 1251.5, low: 1250.5, close: 1251.2 },
    { time: 1240, open: 1251.2, high: 1252, low: 1251, close: 1251.8 }
];

accumulationData.forEach(candle => patternIndy.addCandle(candle));


// ==================== EXAMPLE 6: Divergence Detection ====================

console.log('\n=== Example 6: Divergence Detection ===');

const divIndy = new clsMicroTickIndy();

divIndy.on('alert', (alerts) => {
    alerts.forEach(alert => {
        if (alert.category === 'divergence') {
            console.log(`📈 Divergence Detected: ${alert.data.type}`);
            console.log(`   Strength: ${alert.data.strength}`);
            console.log(`   Prices: ${alert.data.data.prices.join(' → ')}`);
            console.log(`   Impacts: ${alert.data.data.impacts.join(' → ')}`);
        }
    });
});

// Bullish Divergence: Price goes down, but impact decreases (selling weakens)
const bullishDivData = [
    { time: 1000, open: 1250, high: 1251, low: 1249, close: 1249.5 },  // Down, strong sell
    { time: 1060, open: 1249.5, high: 1250, low: 1248.5, close: 1249 }, // Down, weaker sell
    { time: 1120, open: 1249, high: 1249.5, low: 1248, close: 1248.7 }  // Down, weak sell
];

bullishDivData.forEach(candle => divIndy.addCandle(candle));


// ==================== EXAMPLE 7: Strength Threshold Monitoring ====================

console.log('\n=== Example 7: Strength Threshold ===');

const strengthIndy = new clsMicroTickIndy({
    thresholds: {
        low: 0.001,
        medium: 0.003,
        high: 0.005,
        extreme: 0.010
    }
});

strengthIndy.on('alert', (alerts) => {
    alerts.forEach(alert => {
        if (alert.category === 'strength') {
            console.log(`⚡ Strength Alert: ${alert.data.level}`);
            console.log(`   ${alert.data.title}`);
            console.log(`   ${alert.data.prediction}`);
        }
    });
});

// Create spike
const spikeData = [
    { time: 1000, open: 1250, high: 1250.5, low: 1249.5, close: 1250.2 },
    { time: 1060, open: 1250.2, high: 1250.7, low: 1250, close: 1250.4 },
    { time: 1120, open: 1250.4, high: 1263, low: 1250, close: 1262.5 }  // SPIKE!
];

spikeData.forEach(candle => strengthIndy.addCandle(candle));


// ==================== EXAMPLE 8: Configuration Management ====================

console.log('\n=== Example 8: Configuration ===');

const configIndy = new clsMicroTickIndy();

// Get current config
console.log('Current config:', configIndy.getConfig());

// Update config
configIndy.updateConfig({
    maxArrows: 50,
    maxChange: 2.0
});

console.log('Updated config:', configIndy.getConfig());


// ==================== EXAMPLE 9: Data Retrieval ====================

console.log('\n=== Example 9: Data Retrieval ===');

const dataIndy = new clsMicroTickIndy();

// Add some data
sampleCandles.forEach(candle => dataIndy.addCandle(candle));

// Get all data
const allData = dataIndy.getData();
console.log('All data:', {
    candles: allData.candles.length,
    arrows: allData.arrows.length,
    summaries: allData.minuteSummaries.length,
    alerts: allData.alerts.length
});

// Get specific data
console.log('Arrows:', dataIndy.getArrows().length);
console.log('Summaries:', dataIndy.getMinuteSummaries().length);
console.log('Alerts:', dataIndy.getAlerts(3)); // Last 3 alerts
console.log('Stats:', dataIndy.getStats());


// ==================== EXAMPLE 10: Integration with Deriv API ====================

console.log('\n=== Example 10: Deriv API Integration ===');

// This example shows how to integrate with Deriv WebSocket API
class DerivIntegration {
    constructor() {
        this.indy = new clsMicroTickIndy({
            maxArrows: 30,
            maxChange: 1.0
        });
        
        // Set up callbacks
        this.setupCallbacks();
    }
    
    setupCallbacks() {
        this.indy.on('alert', (alerts) => {
            // Send to UI or notification system
            this.handleAlerts(alerts);
        });
        
        this.indy.on('arrowUpdate', (arrows) => {
            // Update chart display
            this.updateChart(arrows);
        });
    }
    
    handleWebSocketMessage(data) {
        if (data.msg_type === 'candles') {
            // Historical candles
            const candles = data.candles.map(c => ({
                time: c.epoch,
                open: parseFloat(c.open),
                high: parseFloat(c.high),
                low: parseFloat(c.low),
                close: parseFloat(c.close)
            }));
            this.indy.setCandles(candles);
        } else if (data.msg_type === 'ohlc') {
            // Real-time update
            const candle = {
                time: data.ohlc.epoch,
                open: parseFloat(data.ohlc.open),
                high: parseFloat(data.ohlc.high),
                low: parseFloat(data.ohlc.low),
                close: parseFloat(data.ohlc.close)
            };
            this.indy.updateCandle(candle);
        }
    }
    
    handleAlerts(alerts) {
        console.log('Processing alerts for UI:', alerts);
        // Update UI, send notifications, etc.
    }
    
    updateChart(arrows) {
        console.log('Updating chart with arrows:', arrows.length);
        // Render arrows on chart
    }
    
    getIndicatorData() {
        return this.indy.getData();
    }
}

// Usage
const derivIntegration = new DerivIntegration();
console.log('Deriv integration initialized');


// ==================== EXAMPLE 11: Utility Functions ====================

console.log('\n=== Example 11: Utility Functions ===');

// Format time
const timestamp = Math.floor(Date.now() / 1000);
console.log('Formatted time:', clsMicroTickIndy.formatTime(timestamp));
console.log('Formatted date:', clsMicroTickIndy.formatDate(timestamp));
console.log('Version:', clsMicroTickIndy.getVersion());


// ==================== EXAMPLE 12: Multiple Instances ====================

console.log('\n=== Example 12: Multiple Instances ===');

// Different configurations for different markets
const volatilityIndy = new clsMicroTickIndy({
    maxChange: 2.0,
    thresholds: {
        low: 0.001,
        medium: 0.003,
        high: 0.005,
        extreme: 0.010
    }
});

const forexIndy = new clsMicroTickIndy({
    maxChange: 0.5,
    thresholds: {
        low: 0.0003,
        medium: 0.0008,
        high: 0.0015,
        extreme: 0.0030
    }
});

const cryptoIndy = new clsMicroTickIndy({
    maxChange: 5.0,
    thresholds: {
        low: 0.005,
        medium: 0.015,
        high: 0.030,
        extreme: 0.050
    }
});

console.log('Volatility config:', volatilityIndy.getConfig());
console.log('Forex config:', forexIndy.getConfig());
console.log('Crypto config:', cryptoIndy.getConfig());


// ==================== SUMMARY ====================

console.log('\n=== Summary ===');
console.log('clsMicroTickIndy class provides:');
console.log('✓ Price impact analysis');
console.log('✓ Arrow generation with opacity');
console.log('✓ Minute summaries with Up/Down impact');
console.log('✓ Divergence detection (Bullish/Bearish)');
console.log('✓ Strength threshold monitoring');
console.log('✓ Pattern recognition (5 patterns)');
console.log('✓ Real-time updates');
console.log('✓ Flexible callbacks');
console.log('✓ Easy configuration');
console.log('✓ Multiple instances support');