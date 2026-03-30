# Undo/Redo 히스토리 시스템

Immer patches 기반의 범용 Undo/Redo 시스템입니다.  
어떤 프로젝트에서든 **상태 객체 + immer** 조합으로 즉시 재사용할 수 있습니다.

---

## 1. 아키텍처 개요

```
┌─────────────────────────────────────────────────────────┐
│                    UI Components                         │
│   (Widget, Property Panel, Toolbar 등)                   │
│                         │                                │
│          콜백/이벤트 호출 ▼                                │
│  ┌──────────────────────────────────┐                    │
│  │         Actions (커맨드 계층)       │                   │
│  │  예: SandboxActions, SectionActions │                  │
│  │                                    │                  │
│  │  historyManager.execute(draft => { │                  │
│  │      draft.items.push(newItem);    │                  │
│  │  });                               │                  │
│  └──────────────┬─────────────────────┘                  │
│                 │                                         │
│                 ▼                                         │
│  ┌──────────────────────────────────┐                    │
│  │       HistoryManager<T>           │                   │
│  │                                    │                  │
│  │  - execute(producer)   → patches   │                  │
│  │  - undo()              → inverse   │                  │
│  │  - redo()              → forward   │                  │
│  │  - setBatchMode()                  │                  │
│  │  - commitBatch()                   │                  │
│  │  - subscribe(listener)             │                  │
│  └──────────────┬─────────────────────┘                  │
│                 │                                         │
│      상태 변경 알림 ▼                                      │
│  ┌──────────────────────────────────┐                    │
│  │      Store (반응형 래퍼)            │                   │
│  │  예: StudioDoc (Svelte $state)    │                   │
│  │                                    │                  │
│  │  subscribe → $state 갱신           │                   │
│  │  → UI 자동 업데이트                  │                  │
│  └──────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────┘
```

### 핵심 컴포넌트 역할

| 컴포넌트 | 역할 | 재사용 여부 |
|---------|------|-----------|
| **HistoryManager** | Immer patches로 undo/redo 스택 관리 | **재사용 가능** (공통) |
| **Store (반응형 래퍼)** | HistoryManager를 구독하여 프레임워크 반응형 상태로 변환 | 프로젝트별 구현 |
| **Actions (커맨드)** | 도메인 로직을 `execute()`로 감싸는 커맨드 클래스 | 프로젝트별 구현 |
| **UI Components** | Actions를 호출하여 상태 변경 | 프로젝트별 구현 |

---

## 2. HistoryManager 상세

### 2.1 의존성

```bash
npm install immer
```

### 2.2 소스 위치

```
src/lib/history-system/
├── history-manager.ts   # 핵심 클래스
└── index.ts             # re-export
```

### 2.3 타입 시그니처

```typescript
class HistoryManager<T extends Record<string, any>> {
    constructor(initialState: T, maxHistorySize?: number);

    // 상태 변경 (Immer producer 함수)
    execute(producer: (draft: T) => void | T): T;

    // Undo / Redo
    undo(): T | null;
    redo(): T | null;
    jumpTo(steps: number): T | null;   // 음수=과거, 양수=미래

    // 상태 조회
    getCurrentState(): T;
    canUndo(): boolean;
    canRedo(): boolean;
    getHistoryInfo(): HistoryInfo;

    // 기록 모드
    setRecordMode(): void;             // 기본 모드
    setSilentMode(): void;             // 히스토리 기록 안 함
    setBatchMode(): void;              // 배치 시작
    commitBatch(): T;                  // 배치 커밋
    cancelBatch(): T;                  // 배치 취소(되돌림)
    getHistoryMode(): HistoryMode;

    // 직접 상태 설정 (히스토리 무시)
    setState(newState: T): void;
    clear(): void;

    // 구독
    subscribe(listener: (state: T) => void): () => void;
}
```

### 2.4 세 가지 기록 모드

```
RECORD (기본)
  execute() 호출 시마다 히스토리에 즉시 기록
  → 일반적인 버튼 클릭, 값 입력 등

SILENT
  execute()로 상태는 변경되지만 히스토리에는 기록하지 않음
  → 실시간 미리보기, 임시 상태 등

BATCH
  setBatchMode() 시점의 상태를 스냅샷으로 저장
  이후 execute() 호출은 상태만 변경 (히스토리 미기록)
  commitBatch()를 호출하면 스냅샷↔현재 차이를 하나의 히스토리 항목으로 저장
  cancelBatch()를 호출하면 스냅샷 시점으로 상태 복원
  → 드래그, 리사이즈 등 연속 변경을 하나의 undo 단위로 묶을 때 사용
```

**BATCH 모드 흐름도:**

```
setBatchMode()          commitBatch()
     │                       │
     ▼                       ▼
  [스냅샷 저장]  ──execute()──▶  [스냅샷 ↔ 현재 diff → past에 push]
                 ──execute()──▶
                 ──execute()──▶
                                  → RECORD 모드로 자동 전환
```

---

## 3. 재사용 가이드

### 3.1 설치 & 복사

1. `immer` 패키지를 설치합니다.

```bash
npm install immer
```

2. `src/lib/history-system/` 폴더를 프로젝트에 복사합니다.

```
your-project/
└── src/lib/history-system/
    ├── history-manager.ts
    └── index.ts
```

### 3.2 STEP 1: 상태 타입 정의

관리할 애플리케이션 상태를 인터페이스로 정의합니다.

```typescript
// app-state.ts
export interface AppState {
    todos: { id: string; text: string; done: boolean }[];
    filter: 'all' | 'active' | 'done';
}
```

### 3.3 STEP 2: HistoryManager 인스턴스 생성

```typescript
import { HistoryManager } from '$lib/history-system';
import type { AppState } from './app-state';

const initialState: AppState = {
    todos: [],
    filter: 'all'
};

const historyManager = new HistoryManager<AppState>(initialState, 100);
```

### 3.4 STEP 3: 반응형 Store 연결 (Svelte 5 예시)

HistoryManager 자체는 프레임워크에 의존하지 않으므로,
프레임워크의 반응형 시스템에 맞게 래퍼를 작성합니다.

```typescript
// todo-store.svelte.ts
import { HistoryManager, HistoryMode } from '$lib/history-system';
import type { AppState } from './app-state';

class TodoStore {
    private state = $state<AppState>({ todos: [], filter: 'all' });
    historyManager = new HistoryManager<AppState>({ todos: [], filter: 'all' });
    private unsub: (() => void) | null = null;

    constructor() {
        this.unsub = this.historyManager.subscribe((newState) => {
            this.state = newState;
        });
    }

    get current(): AppState {
        return this.state;
    }

    undo = () => this.historyManager.undo();
    redo = () => this.historyManager.redo();

    destroy() {
        this.unsub?.();
    }
}

export const todoStore = new TodoStore();
```

### 3.5 STEP 4: Actions 클래스 작성

Actions 클래스는 도메인 로직을 `execute()` 안에서 Immer draft를 수정하는 방식으로 작성합니다.

```typescript
// todo-actions.ts
import type { HistoryManager } from '$lib/history-system';
import type { AppState } from './app-state';
import { nanoid } from 'nanoid';

export class TodoActions {
    constructor(private historyManager: HistoryManager<AppState>) {}

    add(text: string) {
        this.historyManager.execute(draft => {
            draft.todos.push({ id: nanoid(), text, done: false });
        });
    }

    toggle(id: string) {
        this.historyManager.execute(draft => {
            const todo = draft.todos.find(t => t.id === id);
            if (todo) todo.done = !todo.done;
        });
    }

    remove(id: string) {
        this.historyManager.execute(draft => {
            draft.todos = draft.todos.filter(t => t.id !== id);
        });
    }

    setFilter(filter: AppState['filter']) {
        this.historyManager.execute(draft => {
            draft.filter = filter;
        });
    }
}
```

### 3.6 STEP 5: Command 인스턴스 생성 & 연결

```typescript
// commands.ts
import { todoStore } from './todo-store.svelte';
import { TodoActions } from './todo-actions';

export const cmdTodo = new TodoActions(todoStore.historyManager);
```

### 3.7 STEP 6: UI에서 사용

```svelte
<script lang="ts">
    import { todoStore } from './todo-store.svelte';
    import { cmdTodo } from './commands';

    let inputText = $state('');
</script>

<div>
    <button onclick={todoStore.undo} disabled={!todoStore.historyManager.canUndo()}>
        Undo
    </button>
    <button onclick={todoStore.redo} disabled={!todoStore.historyManager.canRedo()}>
        Redo
    </button>

    <input bind:value={inputText} />
    <button onclick={() => { cmdTodo.add(inputText); inputText = ''; }}>
        추가
    </button>

    {#each todoStore.current.todos as todo}
        <div>
            <input type="checkbox" checked={todo.done}
                   onchange={() => cmdTodo.toggle(todo.id)} />
            <span>{todo.text}</span>
            <button onclick={() => cmdTodo.remove(todo.id)}>삭제</button>
        </div>
    {/each}
</div>
```

---

## 4. 배치 모드 사용법

연속적인 변경(드래그, 리사이즈 등)을 **하나의 undo 단위**로 묶을 때 사용합니다.

### 기본 패턴

```typescript
// 드래그 시작
historyManager.setBatchMode();

// 드래그 중 (매 프레임마다 호출 - 히스토리에 기록되지 않음)
historyManager.execute(draft => {
    draft.position.x = newX;
    draft.position.y = newY;
});

// 드래그 종료 - 시작점~끝점의 차이를 하나의 히스토리로 기록
historyManager.commitBatch();
```

### 드래그 취소 패턴

```typescript
historyManager.setBatchMode();

// 드래그 중...
historyManager.execute(draft => { /* ... */ });

// ESC 키 등으로 취소 - 시작점으로 되돌림
historyManager.cancelBatch();
```

### 실제 사용 예 (interactjs 드래그)

```typescript
import interact from 'interactjs';

interact(element).draggable({
    listeners: {
        start: () => {
            historyManager.setBatchMode();
        },
        move: (event) => {
            historyManager.execute(draft => {
                const item = findItem(draft, itemId);
                item.x += event.dx;
                item.y += event.dy;
            });
        },
        end: () => {
            historyManager.commitBatch();
        }
    }
});
```

---

## 5. 이 프로젝트(ddddshop-neo)에서의 사용 사례: Sandbox 위젯

### 5.1 파일 구조

```
src/lib/studio/
├── history-manager.ts           # HistoryManager 클래스 (원본)
├── studio-doc.svelte.ts         # 반응형 Store (StudioDoc)
├── command.ts                   # Actions 인스턴스 모음
├── types.ts                     # DocState 등 타입 정의
│
├── widgets/
│   ├── sandbox/
│   │   ├── sandbox.type.ts          # Sandbox 타입 정의
│   │   ├── sandbox-actions.ts       # Sandbox CRUD 커맨드
│   │   ├── sandbox-widget.svelte    # Sandbox 렌더링 컴포넌트
│   │   └── sandbox-property.svelte  # Sandbox 속성 편집 패널
│   │
│   ├── section/
│   │   ├── section-actions.ts       # Section CRUD 커맨드
│   │   └── section-widget.svelte    # 리사이즈 시 배치모드 사용
│   │
│   └── common/
│       ├── draggable.ts             # 드래그 → 배치모드 사용
│       └── resizable.ts             # 리사이즈 → 배치모드 사용
```

### 5.2 데이터 흐름 상세

```
사용자 조작
    │
    ▼
sandbox-property.svelte
    │  cmd.update(id, { text: newText })
    │  cmd.updateProp(id, { width: '200px' }, 'desktop')
    ▼
SandboxActions (sandbox-actions.ts)
    │  this.historyManager.execute(draft => {
    │      const widget = findById(id, draft);
    │      Object.assign(widget, updates);
    │  })
    ▼
HistoryManager.execute()
    │  1. produceWithPatches() → nextState + patches + inversePatches
    │  2. RECORD 모드 → past 스택에 push
    │  3. notifyListeners()
    ▼
StudioDoc.subscribe()
    │  this.doc = newState (Svelte $state 갱신)
    ▼
sandbox-widget.svelte (자동 재렌더링)
```

### 5.3 SandboxActions 주요 메서드

```typescript
class SandboxActions {
    constructor(private historyManager: HistoryManager<DocState>) {}

    // 새 Sandbox 추가
    add(input: SandboxInput): { id: string } {
        const newId = nanoid();
        this.historyManager.execute(draft => {
            const parent = findById(input.parentId, draft);
            parent.children.push({ id: newId, type: 'sandbox', ... });
        });
        return { id: newId };
    }

    // Sandbox 삭제
    remove(id: string): DocState {
        return this.historyManager.execute(draft => {
            const widget = findById(id, draft);
            const parent = findById(widget.parentId, draft);
            parent.children = parent.children.filter(c => c.id !== id);
        });
    }

    // 기본 속성 업데이트 (name, text 등)
    update(id: string, updates: Partial<Sandbox>): DocState {
        return this.historyManager.execute(draft => {
            const widget = findById(id, draft);
            Object.assign(widget, updates);
        });
    }

    // breakpoint별 스타일 속성 업데이트
    updateProp(id: string, updates: Partial<SandboxPropValue>, breakpoint: BreakPoint): DocState {
        return this.historyManager.execute(draft => {
            const widget = findById(id, draft);
            widget.prop[breakpoint] = { ...widget.prop[breakpoint], ...updates };
        });
    }
}
```

### 5.4 배치 모드 사용 사례 (드래그 & 리사이즈)

**draggable.ts에서의 사용:**

```typescript
interact(element).draggable({
    listeners: {
        start: (event) => {
            event.stopPropagation();
            studioDoc.historyManager.setBatchMode();     // ← 배치 시작
        },
        move: (event) => {
            // execute()가 호출되지만 BATCH 모드이므로 히스토리에 기록되지 않음
            updateCallback(id, { left: newLeft, top: newTop });
        },
        end: (event) => {
            studioDoc.historyManager.commitBatch();      // ← 배치 커밋
        }
    }
});
```

**section-widget.svelte에서의 사용 (섹션 높이 리사이즈):**

```typescript
onStart: (newHeight) => {
    studioDoc.historyManager.setBatchMode();     // 배치 시작
    updateSectionHeight(newHeight);
},
onResize: (newHeight) => {
    updateSectionHeight(newHeight);               // 중간 변경 (기록 안 됨)
},
onEnd: (newHeight) => {
    updateSectionHeight(newHeight);
    studioDoc.historyManager.commitBatch();      // 배치 커밋
    studioDoc.historyManager.setRecordMode();    // RECORD 모드 복원
}
```

### 5.5 command.ts - Actions 인스턴스 관리

```typescript
import { studioDoc } from './studio-doc.svelte';
import { SandboxActions } from './widgets/sandbox/sandbox-actions';
import { SectionActions } from './widgets/section/section-actions';

// 모든 Actions는 동일한 historyManager를 공유
export let cmdSandbox = new SandboxActions(studioDoc.historyManager);
export let cmdSection = new SectionActions(studioDoc.historyManager);
```

### 5.6 StudioDoc - 반응형 Store

```typescript
class StudioDoc {
    private doc = $state<DocState>(initialDoc);
    historyManager = new HistoryManager(initialDoc);

    constructor() {
        // HistoryManager의 상태 변경을 Svelte의 $state로 전파
        this.historyManager.subscribe((state) => {
            this.doc = state;
            this.updateHistoryInfo();
        });
    }

    // 편의 메서드
    undo = () => this.historyManager.undo();
    redo = () => this.historyManager.redo();
    setBatchMode = () => this.historyManager.setBatchMode();
    commitBatch = () => this.historyManager.commitBatch();
}

export const studioDoc = new StudioDoc();
```

---

## 6. 다른 프레임워크에서의 사용

HistoryManager는 프레임워크에 의존하지 않으므로 어디서든 사용 가능합니다.

### React 예시

```typescript
import { useState, useEffect, useCallback } from 'react';
import { HistoryManager } from './history-system';

function useHistoryManager<T extends Record<string, any>>(initialState: T) {
    const [manager] = useState(() => new HistoryManager(initialState));
    const [state, setState] = useState(initialState);

    useEffect(() => {
        return manager.subscribe(setState);
    }, [manager]);

    const execute = useCallback(
        (producer: (draft: T) => void) => manager.execute(producer),
        [manager]
    );

    return {
        state,
        execute,
        undo: () => manager.undo(),
        redo: () => manager.redo(),
        canUndo: manager.canUndo(),
        canRedo: manager.canRedo(),
        setBatchMode: () => manager.setBatchMode(),
        commitBatch: () => manager.commitBatch(),
        cancelBatch: () => manager.cancelBatch(),
    };
}
```

### Vue 예시

```typescript
import { ref, onUnmounted } from 'vue';
import { HistoryManager } from './history-system';

export function useHistoryManager<T extends Record<string, any>>(initialState: T) {
    const manager = new HistoryManager(initialState);
    const state = ref(initialState);

    const unsub = manager.subscribe((newState) => {
        state.value = newState as any;
    });

    onUnmounted(unsub);

    return {
        state,
        execute: (producer: (draft: T) => void) => manager.execute(producer),
        undo: () => manager.undo(),
        redo: () => manager.redo(),
        manager,
    };
}
```

### Vanilla JS / 기타

```typescript
import { HistoryManager } from './history-system';

const manager = new HistoryManager({ count: 0 });

manager.subscribe((state) => {
    document.getElementById('counter')!.textContent = String(state.count);
});

document.getElementById('increment')!.addEventListener('click', () => {
    manager.execute(draft => { draft.count += 1; });
});

document.getElementById('undo')!.addEventListener('click', () => {
    manager.undo();
});
```

---

## 7. 핵심 설계 원칙

### Immer Patches를 사용하는 이유

- **메모리 효율**: 전체 상태 스냅샷 대신 변경 diff(patches)만 저장
- **불변성 보장**: Immer가 structural sharing을 통해 변경되지 않은 부분은 참조 공유
- **직관적 API**: `execute(draft => { draft.x = 1; })` 형태로 mutable하게 코드 작성 가능
- **정밀한 Undo**: inverse patches를 통해 정확한 역방향 변경 적용

### Actions 패턴의 장점

- **관심사 분리**: UI 로직과 상태 변경 로직 분리
- **재사용성**: 같은 Action을 여러 UI 컴포넌트에서 호출 가능
- **테스트 용이성**: HistoryManager mock으로 Actions 단위 테스트 가능
- **일관성**: 모든 상태 변경이 `execute()` 를 통해 이루어지므로 히스토리 추적 보장

### 배치 모드의 필요성

드래그/리사이즈처럼 매 프레임마다 상태가 변경되는 경우,
모든 중간 상태를 히스토리에 기록하면:
- Undo 시 한 픽셀씩 되돌아가는 비직관적 동작
- 히스토리 스택이 빠르게 가득 참

배치 모드는 **시작↔끝 차이만 하나의 undo 항목으로 기록**하여 이 문제를 해결합니다.
