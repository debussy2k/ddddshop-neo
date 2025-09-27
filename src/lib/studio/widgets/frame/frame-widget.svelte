<script lang="ts">
	import { onMount } from "svelte";
    import type { Frame } from "./frame.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
	import { cmdFrame } from "$lib/studio/command";
	import { setupDraggable } from "$lib/studio/widgets/common/draggable";
	import { setupResizable } from "$lib/studio/widgets/common/resizable";
    import WidgetRenderer from "$lib/studio/widgets/common/WidgetRenderer.svelte";
    import { du } from "$lib/studio/widgets/common/doc-util";
	import { cn } from "$lib/utils";
	import { util } from "$lib/studio/util";
    import SizeTip from "$lib/studio/widgets/common/size-tip.svelte";
    import { canvasManager } from "../../canvas-manager.svelte";
    import { getComputedVal } from "$lib/studio/widgets/common/computed-value-util";


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
        return getComputedVal(data, currentProp);
    })

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
		let parentComp  = studioDoc.getParentWidgetComponent<any>(data.id);
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
			let crossAxisAlignment = (currentProp.wrap) ? "align-content" : "align-items";
			if (currentProp.alignItems === 'start') {
				style += `${crossAxisAlignment}: flex-start;`;
			}
			else if (currentProp.alignItems === 'end') {
				style += `${crossAxisAlignment}: flex-end;`;
			}
			else if (currentProp.alignItems === 'center') {
				style += `${crossAxisAlignment}: center;`;
			}
			else if (currentProp.alignItems === 'space-between') {
				style += `${crossAxisAlignment}: space-between;`;
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


