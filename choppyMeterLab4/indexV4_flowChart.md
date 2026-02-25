
# Choppy Meter V4 Flow Chart

To visualize this flowchart in **draw.io**:
1. Open [draw.io](https://app.diagrams.net/).
2. Click **Arrange** > **Insert** > **Advanced** > **Mermaid**.
3. Copy and paste the code block below into the dialog.
4. Click **Insert**.

```mermaid
graph TD
    %% Nodes
    User([User])
    PageLoad(Load indexV4.html)
    
    subgraph "Initialization Phase"
        LoadScripts[Load Scripts: mainV4.js, trader.js, indicators.js]
        InitApp[appV4.init()]
        LoadSettings[Load Settings from localStorage]
        WSConnect[DerivAPI Connect WebSocket]
        AuthCheck{Token Available?}
        Auth[Authorize API]
    end

    subgraph "Data Acquisition Loop (Global)"
        StartPoll[Start Polling (60s)]
        ReqAssets[Request Ticks/Candles for 10 Assets]
        ReceiveMsg[onMessage: Data Received]
        ProcessData[Process Candles]
        CalcInd[Calculate Indicators: CI, ADX, EMA, RSI, ATR]
        CalcSMC[Calculate SMC: OrderBlocks, FVG, SwingPoints]
        ScoreAsset[Compute Trend Score & Rank]
        RenderGrid[Render Top 8 Grid Assets]
    end

    subgraph "Chart Analysis (Selected Asset)"
        SelectAsset[User Selects Asset]
        InitChart[Init Lightweight Chart & SMC Renderer]
        FastPoll[Start Fast Polling (2s)]
        UpdateChart[Update Chart Data]
        RenderOverlays[Render SMC Overlays & Zones]
        LagCheck{Lag Detection?}
        PlaySound[Play Sound Alert]
    end

    subgraph "Automated Trading (DerivTrader)"
        StartTrade[User Clicks 'Start Trading']
        TradeLoop[Trade Loop (Every 1s)]
        CheckTime{Timeframe Boundary?}
        GetSignal[Analyze Signal (EMA/SMC)]
        Execute{Action?}
        PlaceOrder[Execute Trade (Call/Put)]
        Monitor[Monitor Contract Status]
        Result{Win/Loss?}
        UpdateStats[Update Balance & Stats]
        Martingale[Apply Martingale Strategy]
    end

    %% Flow Connections
    User --> PageLoad
    PageLoad --> LoadScripts
    LoadScripts --> InitApp
    InitApp --> LoadSettings
    LoadSettings --> WSConnect
    WSConnect --> AuthCheck
    AuthCheck -- Yes --> Auth
    AuthCheck -- No --> User
    User -- Enter Token --> Auth
    
    Auth --> StartPoll
    StartPoll --> ReqAssets
    ReqAssets --> ReceiveMsg
    ReceiveMsg --> ProcessData
    ProcessData --> CalcInd
    CalcInd --> CalcSMC
    CalcSMC --> ScoreAsset
    ScoreAsset --> RenderGrid
    
    RenderGrid --> SelectAsset
    SelectAsset --> InitChart
    InitChart --> FastPoll
    FastPoll --> UpdateChart
    UpdateChart --> RenderOverlays
    UpdateChart --> LagCheck
    LagCheck -- Yes --> PlaySound
    
    User --> StartTrade
    StartTrade --> TradeLoop
    TradeLoop --> CheckTime
    CheckTime -- Yes --> GetSignal
    CheckTime -- No --> TradeLoop
    GetSignal --> Execute
    Execute -- Call/Put --> PlaceOrder
    PlaceOrder --> Monitor
    Monitor --> Result
    Result --> UpdateStats
    UpdateStats --> Martingale
    Martingale --> TradeLoop

    %% Styles
    style PageLoad fill:#f9f,stroke:#333,stroke-width:2px
    style InitApp fill:#bbf,stroke:#333
    style PlaceOrder fill:#bfb,stroke:#333
    style RenderGrid fill:#ff9,stroke:#333
```
