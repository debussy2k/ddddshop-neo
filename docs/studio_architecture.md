# Studio Architecture

## 1. Studio UI & Module Structure

`/admin/studio` 경로의 스튜디오 에디터 구조도입니다.

```mermaid
graph TD
    %% 스타일 정의
    classDef page fill:#ff9999,stroke:#333,stroke-width:2px;
    classDef layout fill:#99ccff,stroke:#333,stroke-width:2px;
    classDef panel fill:#99ff99,stroke:#333,stroke-width:1px;
    classDef widget fill:#ffff99,stroke:#333,stroke-width:1px;
    classDef util fill:#e1e1e1,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5;

    subgraph Page ["📄 Page Entry"]
        Route["/admin/studio/+page.svelte"]:::page
        KeyHandler["Global Keyboard Handler<br/>(Undo/Redo, Breakpoint)"]:::util
    end

    subgraph Layout ["📐 Main Layout (main.svelte)"]
        StudioMain["Studio Component"]:::layout
        
        subgraph Panels ["Panels"]
            TopP["Top Panel<br/>(Toolbar, Actions)"]:::panel
            LeftP["Left Panel<br/>(Assets, Layers)"]:::panel
            CenterP["Center Panel<br/>(Infinite Canvas)"]:::panel
            RightP["Right Panel<br/>(Properties)"]:::panel
        end
    end

    subgraph Canvas ["🎨 Canvas Area"]
        InfView["InfiniteCanvasView"]:::panel
        DocRender["Document Renderer"]:::panel
        
        subgraph Widgets ["Widget System"]
            BaseCtrl["BaseWidgetController"]:::widget
            W_Section["Section Widget"]:::widget
            W_Frame["Frame Widget"]:::widget
            W_Sandbox["Sandbox Widget"]:::widget
        end
    end

    %% 관계 연결
    Route --> StudioMain
    Route -.-> KeyHandler
    
    StudioMain --> TopP
    StudioMain --> LeftP
    StudioMain --> CenterP
    StudioMain --> RightP
    
    CenterP --> InfView
    InfView --> DocRender
    DocRender --> W_Section & W_Frame & W_Sandbox
    
    W_Section & W_Frame & W_Sandbox -- extends --> BaseCtrl
    
    %% Panel 상세
    LeftP --> Assets["Assets Panel"]:::panel
    LeftP --> Layers["Layers Panel"]:::panel
    
    RightP --> Props["Property Editors"]:::panel
```

## 2. State Management Architecture

Svelte 5 Runes를 활용한 상태 관리 구조 및 데이터 흐름도입니다.

```mermaid
flowchart TD
    %% 스타일 정의
    classDef singleton fill:#ffcc99,stroke:#333,stroke-width:2px;
    classDef state fill:#99ccff,stroke:#333,stroke-width:1px;
    classDef logic fill:#ff99cc,stroke:#333,stroke-width:1px;
    classDef component fill:#99ff99,stroke:#333,stroke-width:1px;

    subgraph Global_State ["🌍 Global State (Singletons)"]
        StudioDoc["StudioDoc (Singleton)<br/>studio-doc.svelte.ts"]:::singleton
        Context["Context<br/>(Breakpoint, Panning)"]:::state
        
        subgraph Doc_Internal ["StudioDoc Internals"]
            DocState["$state(DocState)<br/>(Assets, Sections)"]:::state
            ActiveId["$state(activeId)"]:::state
            HistoryInfo["$state(historyInfo)"]:::state
        end
        
        HistoryMgr["HistoryManager<br/>(Undo/Redo Logic)"]:::logic
    end

    subgraph Widget_State ["🧩 Widget Local State"]
        BaseCtrl["BaseWidgetController"]:::logic
        ChangeTracker["ChangeTracker"]:::logic
        WidgetProps["$props() / $state()"]:::state
    end

    subgraph Components ["🖥️ UI Components"]
        CanvasView["Canvas View"]:::component
        PropPanel["Property Panel"]:::component
        LayerPanel["Layer Panel"]:::component
    end

    %% 데이터 흐름
    StudioDoc -- manages --> DocState
    StudioDoc -- manages --> ActiveId
    StudioDoc -- delegates --> HistoryMgr
    
    HistoryMgr -- updates --> DocState
    
    %% 컴포넌트 구독 및 액션
    DocState -- binds/reads --> CanvasView
    ActiveId -- reads --> PropPanel
    
    CanvasView -- calls --> BaseCtrl
    PropPanel -- updates --> StudioDoc : updateProp
    
    BaseCtrl -- tracks --> ChangeTracker
    BaseCtrl -- reads --> Context : Breakpoint
    
    %% 위젯 업데이트 사이클
    ChangeTracker -- notifies --> BaseCtrl
    BaseCtrl -- setup --> Draggable["Draggable/Resizable"]:::logic
    
    %% 키보드 액션
    Keyboard["Keyboard Events"] -- calls --> StudioDoc : "undo()/redo()"
    Keyboard -- updates --> Context : "Switch Breakpoint"
```

