<script lang="ts">
	import { onMount } from "svelte";
    import type { Frame } from "./frame.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
	import { cmdFrame } from "$lib/studio/command";
	import { setupDraggable, unsetup as unsetupDraggable } from "$lib/studio/widgets/common/draggable";
	import { setupResizable } from "$lib/studio/widgets/common/resizable";
    import WidgetRenderer from "$lib/studio/widgets/common/WidgetRenderer.svelte";
    import * as du from "$lib/studio/widgets/common/doc-util";
	import * as util from "$lib/studio/util";
    import SizeTip from "$lib/studio/widgets/common/size-tip.svelte";
    import { canvasManager } from "../../canvas-manager.svelte";
    import { getComputedVal } from "$lib/studio/widgets/common/computed-value-util";
    import { ChangeTracker } from "$lib/studio/widgets/common/change-tracker";


	let element: HTMLElement;
    let { data: data }: { data: Frame } = $props();
    // 현재 프레임이 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === data.id);
    // 현재 breakpoint에 맞는 스타일 가져오기
    let currentProp = $derived(data.prop?.[bpm.current]);
    let parent = $derived(studioDoc.getParentByChildId(data.id));
    let computedVal = $derived.by(() => {
        canvasManager.currentWidth; // 의존성만 추가. canvas크기가 변경되어도 반응하도록 함.
        canvasManager.needUpdate;   // 의존성만 추가. 
        return getComputedVal(data);
    })
    const tracker = new ChangeTracker();

	$effect(() => {
		// width, height의 min,max값이 변하면 Resizable 설정을 다시해야 함.
		// currentProp은 모든 변화에 반응하기 때문에 min,max값 변화를 추적하여 설정 다시 함. 
		if (currentProp.sizeConstraints) {
            if (tracker.hasChanged('sizeConstraints', currentProp.sizeConstraints)) {
                // console.log('min,max changed');
                setupResizableWidget();
            }
		}
		if (parent?.prop[bpm.current].layout) {
            if (tracker.hasChanged('layout', parent.prop[bpm.current].layout)) {
                console.log('parent layout changed');
                if (parent.prop[bpm.current].layout === 'block') {
                    setupDraggableWidget();
                }
                else if (du.isLayoutFlexBox(parent.prop[bpm.current].layout)) {
                    // console.log('unsetupDraggable');
                    unsetupDraggable(element);
                }
                else {
                    console.error('layout not supported', parent.prop[bpm.current].layout);
                }
            }
        }		
	});

	export function getElement() {
		return element;
	}


	onMount(() => {
        if (!parent) {
            console.error('parent not found', data.id);
        }
        
		setupDraggableWidget();
		setupResizableWidget();
	});

	function setupDraggableWidget() {
		setupDraggable({
			id: data.id,
			element: element,
            getCurrentProp: () => currentProp,
            getParentSize: () => getParentSize(),
			updateCallback: (id, updatedProps) => {
				cmdFrame.updateProp(id, updatedProps, bpm.current);
			}
		});
	}

	function setupResizableWidget() {
		setupResizable({
			id: data.id,
			element: element,
			getCurrentProp: () => currentProp,
            getParentSize: () => getParentSize(),
			updateCallback: (id, updatedProps) => {
				cmdFrame.updateProp(id, updatedProps, bpm.current);
			}
		});
	}

    
    function getParentSize() {
		let parentComp  = studioDoc.getParentWidgetSvelteComponent<any>(data.id);
		if (parentComp === null) {
			console.error(`parent not found for sandbox`, data.id);
			return { width: 0,height: 0 }
		}
		return { width: parentComp.getWidth(), height: parentComp.getHeight() };
	}

    function handleMoutdown(event: MouseEvent) {
        studioDoc.activeId = data.id;
        // 이벤트 버블링 방지
        event.stopPropagation();
        event.preventDefault();
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Delete') {
            e.preventDefault();
            e.stopPropagation();
            cmdFrame.remove(data.id);
        }
    }

    function getFrameClasses(isActive: boolean): string {
        const baseClasses = `es-frame-widget cursor-pointer bg-white `;
        const activeClasses = 'outline outline-blue-400';
        const inactiveClasses = 'hover:outline hover:outline-gray-200';

        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    }

    function getCurrentStyle() {
        let style = du.getBaseStyleOfLeafWidget(currentProp, parent?.prop[bpm.current].layout || 'block');

		if (currentProp.layout === 'flex-row') {
			style += `column-gap: ${currentProp.gap}px;`
		}
		else if (currentProp.layout === 'flex-col') {
			style += `row-gap: ${currentProp.gap}px;`
		}

        return style;
    }

	function getLayoutStyle() {
		let style = "";

		// display
        if (currentProp.layout === 'block') {
            style += "display: block;";
        }
        else if (currentProp.layout === 'flex-row') {
			/*
				align-content:start; --> 기본 값이 stretch여서 row간 간격이 발생하는 문제가 발생하는 것을 방지하기 위해 추가함.
			*/
            style += `display: flex; flex-direction: row; align-content:start; column-gap: ${currentProp.gap}px; row-gap: ${currentProp.verticalGap}px;`;
			if (currentProp.wrap) 
				style += "flex-wrap: wrap;";
        }
        else if (currentProp.layout === 'flex-col') {
            style += `display: flex; flex-direction: column; row-gap: ${currentProp.gap}px;`;
        }
        else if (currentProp.layout === 'grid') {
            style += "display: grid;";
        }

		if (currentProp.layout === 'flex-row' || currentProp.layout === 'flex-col') {
			// justify-content
			if (currentProp.justifyContent === 'start') {
				style += "justify-content: flex-start;";
			}
			else if (currentProp.justifyContent === 'end') {
				style += "justify-content: flex-end;";
			}
			else if (currentProp.justifyContent === 'center') {
				style += "justify-content: center;";
			}
			else if (currentProp.justifyContent === 'space-between') {
				style += "justify-content: space-between;";
			}
	
			// 교차축 정렬 옵션 : align-items 또는 align-content(wrap인 경우)
			if (currentProp.wrap === false) {
				if (currentProp.alignItems === 'start') {
					style += `align-items: flex-start;`;
				}
				else if (currentProp.alignItems === 'end') {
					style += `align-items: flex-end;`;
				}
				else if (currentProp.alignItems === 'center') {
					style += `align-items: center;`;
				}
				else if (currentProp.alignItems === 'space-between') {
					style += `align-items: space-between;`;
				}
			}
			else {
				/*
					정리
						align-items: 한 줄 아이템 단위의 정렬을 지정함.
						align-content: 줄 묶음 단위의 정렬을 지정함.

					"align-items: flex-start"를 지정하는 이유
						- wrap인 경우 각 줄에 있는 아이템은 수직방향(=교차축)으로 높이가 가장 큰 아이템 높이에 맞춰짐.
						- 이를 방지하기 위해 align-items를 flex-start로 설정.
						- align-items의 기본값은 stretch이기 때문임.
				*/
				style += `align-items: flex-start;`;

				// align-content은 "줄 묶음" 단위의 정렬을 지정함.
				if (currentProp.alignItems === 'start') {
					style += `align-content: flex-start;`;
				}
				else if (currentProp.alignItems === 'end') {
					style += `align-content: flex-end;`;
				}
				else if (currentProp.alignItems === 'center') {
					style += `align-content: center;`;
				}
				else if (currentProp.alignItems === 'space-between') {
					style += `align-content: space-between;`;
				}
			}

			// padding
			style += `padding-left: ${currentProp.paddingLeft}px; padding-right: ${currentProp.paddingRight}px; padding-top: ${currentProp.paddingTop}px; padding-bottom: ${currentProp.paddingBottom}px;`;
		}


		return style;
	}

	export function getWidth() : number {
		if (!element) return 0;
		
		let w = window.getComputedStyle(element).width;
		return util.getNumberPart(w);
	}
    export function getHeight() : number {
		if (!element) return 0;
		
		let h = window.getComputedStyle(element).height;
		return util.getNumberPart(h);
	}    

</script>

<div 
	bind:this={element}
    class={getFrameClasses(isActive)}
    style={getCurrentStyle()}
    onmousedown={(e) => handleMoutdown(e as MouseEvent)}
    role="button"
    tabindex="0"
    onkeydown={handleKeyDown}
>
    <div class="relative h-full" style={getLayoutStyle()}>
        <WidgetRenderer widgets={data.children} />
    </div>

    {#if isActive}
        <SizeTip prop={{width: computedVal.width.toString(), height: computedVal.height.toString()}} />
    {/if}    
</div>


