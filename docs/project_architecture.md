# Project Architecture Diagram

## 전체 프로젝트 구조도

이 다이어그램은 `ddddshop-neo` 프로젝트의 주요 모듈과 의존성 관계를 나타냅니다.

```mermaid
graph TD
    %% 스타일 정의
    classDef route fill:#ff9999,stroke:#333,stroke-width:2px;
    classDef core fill:#99ccff,stroke:#333,stroke-width:2px;
    classDef ui fill:#99ff99,stroke:#333,stroke-width:1px;
    classDef service fill:#ffff99,stroke:#333,stroke-width:1px;
    classDef widget fill:#ffcc99,stroke:#333,stroke-width:1px;

    subgraph Routes ["📂 Application Routes (src/routes)"]
        direction TB
        R_Root["/ (Landing)"]:::route
        R_Admin["/admin"]:::route
        R_Studio_Page["/admin/studio"]:::route
    end

    subgraph Shared ["📂 Shared Libraries (src/lib)"]
        direction TB
        Stores["Stores (Svelte 5 Runes)<br/>auth, backend, category"]:::service
        Services["API Services<br/>shopicus.api, login"]:::service
        CommonUI["Common UI Components<br/>button, input, dialog"]:::ui
    end

    subgraph Studio ["🎨 Studio System (src/lib/studio)"]
        direction TB
        
        subgraph Studio_Logic ["Core Logic"]
            Context["Context<br/>(Singleton Access)"]:::core
            StudioDoc["StudioDoc<br/>(Document Model)"]:::core
            CanvasMgr["Canvas Manager"]:::core
            HistoryMgr["History Manager"]:::core
            TabMgr["Left Panel Tab Manager"]:::core
        end

        subgraph Studio_Layout ["UI Layout"]
            Main["Main Layout"]:::ui
            TopP["Top Panel"]:::ui
            LeftP["Left Panel<br/>(Layers, Assets)"]:::ui
            CenterP["Center Panel<br/>(Infinite Canvas)"]:::ui
            RightP["Right Panel<br/>(Properties)"]:::ui
        end

        subgraph Widget_System ["Widget System"]
            BaseCtrl["Base Widget Controller"]:::widget
            
            subgraph Concrete_Widgets ["Widgets"]
                W_Section["Section Widget"]:::widget
                W_Frame["Frame Widget"]:::widget
                W_Sandbox["Sandbox Widget"]:::widget
                W_Showcase["Showcase Widget"]:::widget
            end
            
            Render["Widget Renderer"]:::ui
        end
    end

    %% 관계 연결
    R_Root & R_Admin --> Stores
    R_Studio_Page --> Main
    
    Stores --> Services
    
    %% Studio 내부 관계
    Main --> TopP
    Main --> LeftP
    Main --> CenterP
    Main --> RightP
    
    Main -.-> Context
    Context --> StudioDoc
    Context --> CanvasMgr
    Context --> HistoryMgr
    
    LeftP -.-> TabMgr
    LeftP -.-> StudioDoc
    
    CenterP --> Render
    Render --> W_Section & W_Frame & W_Sandbox & W_Showcase
    
    W_Section & W_Frame & W_Sandbox & W_Showcase -- inherits --> BaseCtrl
    BaseCtrl -.-> StudioDoc
    
    RightP -.-> StudioDoc : "Inspects Selection"
```

