import { onMount } from "svelte";
import type { BaseContainerProp, Widget, CompositeWidget } from "$lib/studio/types";
import type { BaseWidgetProp } from "$lib/studio/types";
import { studioDoc } from "$lib/studio/studio-doc.svelte";
import { bpm } from "$lib/studio/breakpoint-man.svelte";
import { setupDraggable, unsetup as unsetupDraggable } from "./draggable";
import { setupResizable } from "./resizable";
import { canvasManager } from "../../canvas-manager.svelte";
import { getComputedVal, type ComputedValue } from "./computed-value-util";
import { ChangeTracker } from "./change-tracker";
import * as du from "./doc-util";


export interface BaseWidgetData {
    id: string;
    type: string;
    name: string;
    parentId: string;
    prop: Record<string, BaseWidgetProp>;
}

export interface WidgetControllerConfig {
    updateCallback: (id: string, updatedProps: Partial<BaseWidgetProp>, breakpoint: string) => void;
    removeCallback: (id: string) => void;
}

export class BaseWidgetController<T extends BaseWidgetData> {
    // 설정
    protected config: WidgetControllerConfig;
	element: HTMLElement | undefined;    
    data: T;
    currentProp: BaseWidgetProp&BaseContainerProp;
    parent: CompositeWidget;
    computedVal: ComputedValue;

    get isActive() {
        return studioDoc.activeId === this.data.id;
    }

    get parentProp() {
        return studioDoc.getParentByChildId(this.data.id)?.prop?.[bpm.current];
    }

    // 내부 상태
    refreshTrigger = $state(0);

    constructor(data:T, config: WidgetControllerConfig) {
        // $effect를 사용하여 변화 감지
        $effect(() => {
            console.log('a_data', this.data);
            // this.handleSizeConstraintsChange();
            // this.handleParentLayoutChange();
        });

        this.config = config;
        this.data = $derived.by(() => {
            console.log('data', data);
            return data;
        });
    }

    setCurrentProp(prop: BaseWidgetProp&BaseContainerProp) {
        this.currentProp = prop;
        console.log('currentProp', this.currentProp);
    }

    setParent(parent: Readonly<CompositeWidget>) {
        this.parent = parent;
        console.log('parent', this.parent);
    }

    setComputedVal(computedVal: ComputedValue) {
        this.computedVal = computedVal;
        console.log('>>>>>> computedVal', this.computedVal);
    }

    /**
     * 렌더링을 위한 뷰 데이터 반환
     */
    getViewData() {
        return {
            isActive: this.isActive,
            // classes: this.getClasses(this.isActive),
            // style: this.getCurrentStyle(),
            // computedVal: this.computedVal
        };
    }

    
    getParentSize() {
		const parentComp  = studioDoc.getParentWidgetSvelteComponent<any>(this.data.id);
		if (parentComp === null) {
			console.error(`parent not found for sandbox`, this.data.id);
			return { width: 0,height: 0 }
		}
		return { width: parentComp.getWidth(), height: parentComp.getHeight() };
	}

	setupDraggableWidget() {
		setupDraggable({
			id: this.data.id,
			element: this.element,
			getCurrentProp: () => this.currentProp,
			getParentSize: () => this.getParentSize(),
			updateCallback: (id, updatedProps) => {
				this.config.updateCallback(id, updatedProps, bpm.current);
			}
		});
	}

	setupResizableWidget() {
		setupResizable({
			id: this.data.id,
			element: this.element,
			getCurrentProp: () => this.currentProp,
			getComputedVal: () => this.computedVal,
			getParentSize: () => this.getParentSize(),
			updateCallback: (id, updatedProps) => {
				this.config.updateCallback(id, updatedProps, bpm.current);
			}
		});
	}
}