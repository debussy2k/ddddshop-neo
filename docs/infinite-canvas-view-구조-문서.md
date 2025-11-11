# Infinite Canvas View 구조 문서

## 개요

`infinite-canvas-view.svelte`는 Svelte 기반의 무한 캔버스 UI 편집기의 핵심 뷰 컴포넌트입니다. 이 컴포넌트는 반응형 디자인을 위한 3가지 브레이크포인트(Desktop, Tablet, Mobile)를 동시에 표시하고, 사용자가 Space 키를 이용해 캔버스를 자유롭게 이동(패닝)하고 Ctrl+휠로 확대/축소(줌)할 수 있는 기능을 제공합니다.

## 아키텍처 구조

```
infinite-canvas-view.svelte (최상위 뷰)
├── canvas-panning.ts (패닝/줌 기능)
├── canvas-manager.svelte.ts (캔버스 상태 관리)
├── Context.svelte.ts (브레이크포인트별 컨텍스트)
└── PageWidget (각 브레이크포인트별)
    └── SectionWidget (여러 섹션)
        └── WidgetRenderer (자식 위젯들)
            ├── FrameWidget
            ├── SandboxWidget
            ├── SimpleImageWidget
            └── ShowcaseWidget
```

## 핵심 컴포넌트

### 1. infinite-canvas-view.svelte

**역할**: 최상위 캔버스 뷰 컴포넌트

**주요 기능**:
- 3개의 브레이크포인트(desktop, tablet, mobile) 컨텍스트 생성
- 무한 캔버스 패닝 및 줌 기능 초기화
- 각 브레이크포인트별 PageWidget 렌더링

**핵심 코드 구조**:

```typescript
let doc = $derived(studioDoc.document);
let desktopContext = new Context('desktop');
let tabletContext = new Context('tablet');
let mobileContext = new Context('mobile');
```

```typescript
onMount(() => {
    // Infinite canvas 패닝 기능 설정
    if (inputElement && canvasElement) {
        const panningControl = setupCanvasPanning({
            inputElement,        // flex-1 엘리먼트에서 입력 받기
            targetElement: canvasElement,  // infinite-canvas에 transform 적용
            onPanChange: (x, y) => {
                // console.log(`Canvas panned to: ${x}, ${y}`);
            },
            onSpacePressed: (isPressed) => {
                tabletContext.isPanning = isPressed;
                mobileContext.isPanning = isPressed;
                desktopContext.isPanning = isPressed;
            },
            onScaleChange: (scale, panX, panY) => {
                canvasManager.updateZoomScale(scale);
            }
        });

        // zoom 리셋 기능을 canvasManager에 등록
        canvasManager.registerResetZoom(panningControl.resetZoom);

        return panningControl.cleanup;
    }
});
```

**DOM 구조**:

```svelte
<div class="flex-1 relative overflow-hidden bg-gray-100" 
     style="box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.15);" 
     bind:this={inputElement}>
    <div class='infinite-canvas absolute' bind:this={canvasElement}>
        <PageWidget doc={doc} context={desktopContext} />
        <PageWidget doc={doc} context={tabletContext} />
        <PageWidget doc={doc} context={mobileContext} />
    </div>
</div>
```

### 2. canvas-panning.ts

**역할**: 무한 캔버스의 패닝(이동) 및 줌(확대/축소) 기능 제공

**주요 기능**:
- Space 키 + 드래그로 캔버스 이동
- Ctrl + 마우스 휠로 줌 인/아웃
- 마우스 위치 기준 줌 동작 (줌 시 마우스 포인터 아래의 내용이 고정됨)
- interact.js 라이브러리를 사용한 드래그 처리

**핵심 설정**:

```typescript
let scale = 1;

const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const ZOOM_SPEED = 0.001;
```

**패닝 처리**:

```typescript
move: (event: DragEvent) => {
    if (!isSpacePressed || !isDragging) {
        return;
    }

    // 이동 delta를 누적
    panX += event.dx;
    panY += event.dy;

    // Transform 적용 - targetElement에 적용
    applyTransform();
    
    config.onPanChange?.(panX, panY);
    event.stopPropagation();
},
```

**줌 처리** (마우스 위치 기준):

```typescript
// 마우스 휠 이벤트 리스너 (줌 기능)
const handleWheel = (e: WheelEvent) => {
    // Control 키가 눌린 상태에서만 줌 동작
    if (e.ctrlKey) {
        e.preventDefault();
        
        // 마우스 위치 (inputElement 기준)
        const rect = config.inputElement.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 줌 전 마우스 위치의 월드 좌표 계산
        const worldX = (mouseX - panX) / scale;
        const worldY = (mouseY - panY) / scale;
        
        // 새로운 scale 계산
        const delta = -e.deltaY * ZOOM_SPEED;
        const newScale = Math.min(Math.max(scale * (1 + delta), MIN_SCALE), MAX_SCALE);
        
        // 같은 월드 좌표가 같은 화면 좌표에 오도록 pan 조정
        panX = mouseX - worldX * newScale;
        panY = mouseY - worldY * newScale;
        scale = newScale;
        
        // Transform 적용
        applyTransform();
        
        config.onScaleChange?.(scale, panX, panY);
    }
};
```

### 3. canvas-manager.svelte.ts

**역할**: 캔버스의 전역 상태 관리

**주요 상태**:
- `canvasMode`: 'infinite-canvas' | 'fixed-canvas' - 캔버스 모드
- `width`: 캔버스 너비
- `zoomScale`: 현재 줌 스케일
- `needUpdate`: 업데이트 필요 플래그

**핵심 메서드**:

```typescript
// 줌 스케일 업데이트 메서드 추가
updateZoomScale(scale: number) {
    this.zoomScale = scale;
}

// zoom 리셋 콜백 등록 메서드
registerResetZoom(callback: () => void) {
    this.resetZoomCallback = callback;
}

// zoom 리셋 실행 메서드
resetZoom() {
    if (this.resetZoomCallback) {
        this.resetZoomCallback();
    }
}
```

### 4. Context.svelte.ts

**역할**: 각 브레이크포인트별 컨텍스트 정보 관리

**주요 상태**:

```typescript
export class Context {
    breakPoint: BreakPoint = $state('desktop');
    isPanning: boolean = $state(false);
    
    constructor(breakPoint: BreakPoint) {
        this.breakPoint = breakPoint;
    }

    get break(): BreakPoint {
        return this.breakPoint;
    }
}
```

- `breakPoint`: 'desktop' | 'tablet' | 'mobile'
- `isPanning`: 현재 패닝 모드 활성화 여부

### 5. page-widget.svelte

**역할**: 각 브레이크포인트별 페이지 컨테이너

**주요 기능**:
- 브레이크포인트에 따라 위치와 너비 자동 계산
- 마우스 다운 시 해당 브레이크포인트를 현재 활성 브레이크포인트로 설정
- 섹션 위젯들을 렌더링

**레이아웃 계산**:

```typescript
let top = 32;
let left = $derived.by(() => {
    switch(context.breakPoint) {
        case 'desktop':
            return 32;
        case 'tablet':
            return 32 + 992 + 32;
        case 'mobile':
            return 32 + 992 + 32 + 768 + 32;
    }
})
let width = $derived(
    context.breakPoint === 'desktop' ? 992 : 
    context.breakPoint === 'tablet' ? 768 : 
    320
);
```

**렌더링**:

```svelte
<!-- desktop -->
<div class='page @container absolute shadow-lg shadow-gray-400 mt-4' 
    style="top:{top}px; left:{left}px; width:{width}px;"
    use:captureMouseDown
    role="button"
    tabindex="0"
>
    <div class='absolute top-[-40px] left-0 text-sm p-2 rounded-sm text-gray-500 bg-gray-200' 
         style="width:{width}px;">
        {context.breakPoint} {width}
    </div>

    {#each doc.sections as section (section.id)}
        <SectionWidget data={section} {context} />
    {/each}
</div>
```

### 6. section-widget.svelte

**역할**: 개별 섹션 위젯 (페이지의 주요 구성 단위)

**주요 기능**:
- 섹션 선택 및 활성화 처리
- 리사이즈 핸들을 통한 높이 조정
- 자식 위젯들 렌더링
- 레이아웃 스타일 적용

**핵심 렌더링**:

```svelte
<div 
    id={`${data.id}-${context.break}`}
    bind:this={sectionElement}
    class={getSectionClasses(isActive)}
    style:height={currentProp.height}
    onmousedown={handleMoutdown}
    role="button"
    tabindex="0"
    onkeydown={keydown}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
>
    {#if canvasManager.mode === 'fixed-canvas'}
        <div class='absolute pointer-events-none top-0 bottom-0 left:[-320px] right:[320px] 
                    opacity-0 hover:opacity-100 transition-opacity duration-200' 
            class:opacity-100={isHovered}
            style="width:100%">
            <!-- 섹션 왼쪽 빈 공간 -->
            <div class='absolute top-0 bottom-0 w-[320px] border-y border-blue-400 border-dashed' 
                 style="left:-320px">
            </div>
            <!-- 섹션 오른쪽 빈 공간 -->
            <div class='absolute top-0 bottom-0 w-[320px] border-y border-blue-400 border-dashed' 
                 style="left:100%">
            </div>
        </div>
    {/if}
    
    <div class="_outer">
        <!-- Child 위젯들 렌더링 -->
        {#if childWidgets().length > 0}
            <div class={cn("es-section-widget-inner w-full")}
                style={childrenLayoutStyle}
                style:height={currentProp.height}
            >
                <WidgetRenderer widgets={childWidgets()} {context} />
            </div>
        {/if}
    </div>

    <!-- 리사이즈 핸들 -->
    <ResizeHandle 
        targetElement={sectionElement}
        direction="vertical"
        detectionDirection="bottom"
        threshold={10}
        minSize={50}
        maxSize={800}
        onStart={(newHeight) => {
            studioDoc.historyManager.setBatchMode();
            updateSectionHeight(newHeight);
        }}
        onResize={(newHeight) => {
            updateSectionHeight(newHeight);
        }}
        onEnd={(newHeight) => {
            updateSectionHeight(newHeight);
            studioDoc.historyManager.commitBatch();
            studioDoc.historyManager.setRecordMode();
        }}
    />
</div>
```

### 7. WidgetRenderer.svelte

**역할**: 다양한 타입의 위젯을 조건부 렌더링

**지원 위젯 타입**:
- `frame`: FrameWidget
- `sandbox`: SandboxWidget
- `simple-image`: SimpleImageWidget
- `showcase`: ShowcaseWidget

**렌더링 로직**:

```svelte
{#each widgets || [] as widgetData (widgetData.id)}
    {#if (widgetData as any).type === 'frame'}
        <FrameWidget 
            data={widgetData as Frame}
            {context}
        />
    {:else if (widgetData as any).type === 'sandbox'}
        <SandboxWidget 
            data={widgetData as Sandbox}
            {context}
        />
    {:else if (widgetData as any).type === 'simple-image'}
        {#key widgetData.id + (widgetData as SimpleImage).url}
            <SimpleImageWidget 
                data={widgetData as SimpleImage}
                {context}
            />
        {/key}
    {:else if (widgetData as any).type === 'showcase'}
        <ShowcaseWidget 
            data={widgetData as Showcase}
            {context}
        />
    {/if}
{/each}
```

## 데이터 플로우

```
studioDoc.document (전역 상태)
    ↓
infinite-canvas-view (3개의 Context 생성)
    ↓
PageWidget × 3 (desktop, tablet, mobile)
    ↓
SectionWidget × N (각 섹션)
    ↓
WidgetRenderer
    ↓
개별 위젯들 (Frame, Sandbox, SimpleImage, Showcase)
```

## 사용자 인터랙션 플로우

### 1. 캔버스 패닝
1. 사용자가 Space 키를 누름
2. `canvas-panning.ts`의 `handleKeyDown`이 호출
3. `isSpacePressed = true`, 커서 모양 변경
4. 사용자가 드래그 시작
5. interact.js가 드래그 이벤트 발생
6. `panX`, `panY` 업데이트
7. `applyTransform()`으로 캔버스 이동

### 2. 줌
1. 사용자가 Ctrl 키를 누른 채 마우스 휠 조작
2. `handleWheel` 이벤트 핸들러 호출
3. 마우스 위치 기준으로 월드 좌표 계산
4. 새로운 스케일 계산
5. 월드 좌표를 유지하도록 pan 조정
6. `canvasManager.updateZoomScale()` 호출

### 3. 위젯 선택
1. 사용자가 섹션 또는 위젯 클릭
2. `context.isPanning`이 false인 경우에만 처리
3. `studioDoc.activeId` 업데이트
4. 활성 위젯의 스타일 변경 (아웃라인 표시)

## 주요 타입 정의

```typescript
// types.ts에서
export type BreakPoint = "desktop" | "tablet" | "mobile";
export type CanvasMode = "infinite-canvas" | "fixed-canvas";

export interface DocState {
    sections: Section[];
}

export type BaseWidgetProp = {
    left: string;
    width: string;
    right: string;
    centerOffsetX: number;
    top: string;
    height: string;
    bottom: string;
    centerOffsetY: number;
    horzAlign: HorizontalAlign;
    vertAlign: VerticalAlign;
    sizeConstraints?: SizeConstraints;
    backgroundColor: string;
}
```

## 반응형 디자인 전략

이 시스템은 3가지 브레이크포인트를 동시에 표시하는 독특한 접근 방식을 사용합니다:

1. **Desktop**: 992px (왼쪽 시작: 32px)
2. **Tablet**: 768px (왼쪽 시작: 1056px)
3. **Mobile**: 320px (왼쪽 시작: 1856px)

각 브레이크포인트는 독립적인 Context를 가지며, 사용자는 무한 캔버스를 패닝하면서 모든 브레이크포인트를 한 번에 볼 수 있습니다.

## 성능 최적화

1. **Svelte 5 Runes 사용**: `$state`, `$derived`, `$effect` 등의 세밀한 반응성 제어
2. **Key 기반 렌더링**: 각 위젯은 고유 ID를 키로 사용하여 효율적인 재렌더링
3. **조건부 렌더링**: 필요한 위젯만 렌더링
4. **이벤트 캡처링**: 효율적인 이벤트 처리를 위한 캡처링 단계 활용

---

이 문서는 `infinite-canvas-view.svelte`를 중심으로 한 전체 캔버스 시스템의 구조와 동작 방식을 설명합니다.

