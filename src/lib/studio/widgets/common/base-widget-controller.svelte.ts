import type { NonSectionWidget, BaseWidgetProp, BaseContainerProp } from "$lib/studio/types";
import { studioDoc } from "$lib/studio/studio-doc.svelte";
import { bpm } from "$lib/studio/breakpoint-man.svelte";
import { setupDraggable, unsetup as unsetupDraggable } from "./draggable";
import { setupResizable } from "./resizable";
import { type ComputedValue } from "./computed-value-util";
import { ChangeTracker } from "./change-tracker";
import * as du from "./doc-util";

export interface WidgetControllerConfig {
    updateProp: (id: string, updatedProps: Partial<BaseWidgetProp>, breakpoint: string) => void;
    remove: (id: string) => void;
}

export class BaseWidgetController<T extends NonSectionWidget> {
    // 설정
    protected config: WidgetControllerConfig;
	element!: HTMLElement;    
    data: T;
    currentProp!: BaseWidgetProp;
    parentProp!: BaseWidgetProp & BaseContainerProp;
    computedVal!: ComputedValue;
    tracker = new ChangeTracker();
    refreshTrigger = $state(0);

    get isActive() {
        return studioDoc.activeId === this.data.id;
    }

    constructor(data:T, config: WidgetControllerConfig) {
        $effect(() => {
            // console.log('a_data', this.data);
        });

        this.config = config;
        this.data = $derived.by(() => {
            // console.log('data', data);
            return data;
        });
    }

    setCurrentProp(prop: BaseWidgetProp) {
        this.currentProp = prop;
        this.handleSizeConstraintsChange();
    }

    setParentProp(parentProp: Readonly<BaseWidgetProp & BaseContainerProp>) {
        this.parentProp = parentProp;
        this.handleParentLayoutChange();
    }

    setComputedVal(computedVal: ComputedValue) {
        this.computedVal = computedVal;
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
        const parentEl = studioDoc.getElement(this.data.parentId);
        if (parentEl === null) {
            console.error(`parentEl is null (id: ${this.data.parentId})`);
            return { width: 0, height: 0 };
        }
        return { width: du.getElementWidth(parentEl), height: du.getElementHeight(parentEl) };
	}

	setupDraggableWidget() {
		// console.log('setupDraggableWidget', this.data.id);
		setupDraggable({
			id: this.data.id,
			element: this.element as HTMLElement,
			getCurrentProp: () => this.currentProp,
			getParentSize: () => this.getParentSize(),
			updateCallback: (id, updatedProps) => {
				this.config.updateProp(id, updatedProps, bpm.current);
			}
		});
	}

	setupResizableWidget() {
		// console.log('setupResizableWidget', this.data.id);
		setupResizable({
			id: this.data.id,
			element: this.element as HTMLElement,
			getCurrentProp: () => this.currentProp,
			getComputedVal: () => this.computedVal,
			getParentSize: () => this.getParentSize(),
			updateCallback: (id, updatedProps) => {
				this.config.updateProp(id, updatedProps, bpm.current);
			}
		});
	}

    handleSizeConstraintsChange() {
        if (this.element === undefined)
            return;

		// width, height의 min,max값이 변하면 Resizable 설정을 다시해야 함.
		// currentProp은 모든 변화에 반응하기 때문에 min,max값 변화를 추적하여 설정 다시 함. 
		if (this.currentProp.sizeConstraints) {
            if (this.tracker.hasChanged('sizeConstraints', this.currentProp.sizeConstraints)) {
                // console.log('min,max changed');
                this.setupResizableWidget();
            }
		}
		
		// sizeConstraints가 undefined가 되면 Resizable 설정을 다시해야 함. 
		// (부모가 block이고, 자신이 flex 에서 block 으로 변경되면 발생)
		if (this.tracker.hasChanged('sizeConstraints-is-undefined', this.currentProp.sizeConstraints === undefined ) && this.currentProp.sizeConstraints === undefined) {
			// console.log('frame sizeConstraints undefined');
			this.setupResizableWidget();
		}
	}    

    handleParentLayoutChange() {
        if (this.element === undefined)
            return;

		if (this.parentProp?.layout) {
            if (this.tracker.hasChanged('layout', this.parentProp.layout)) {
                console.log('parent layout changed');
                if (this.parentProp.layout === 'block') {
                    this.setupDraggableWidget();
                }
                else if (du.isLayoutFlexBox(this.parentProp.layout)) {
                    // console.log('unsetupDraggable');
                    unsetupDraggable(this.element);
                }
                else {
                    console.error('layout not supported', this.parentProp.layout);
                }
            }
        }		

	}    

    handleMousedown(event: MouseEvent) {
        studioDoc.activeId = this.data.id;
		
		// 포커스 설정 추가 - 키보드 이벤트를 받기 위해 필요
		this.element?.focus();	

        // 이벤트 버블링 방지
        event.stopPropagation();
        event.preventDefault();
    }    

    handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Delete') {
            e.preventDefault();
            e.stopPropagation();
            this.config.remove(this.data.id);
        }
    }    
}