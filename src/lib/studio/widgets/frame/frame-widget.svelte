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
        style += `
        `;
        return style;
    }

    function getLayoutClasses(): string {
        let cls = "";
        if (currentProp.layout === 'block') {
            cls += "block";
        }
        else if (currentProp.layout === 'flex-row') {
            cls += "flex flex-row";
        }
        else if (currentProp.layout === 'flex-col') {
            cls += "flex flex-col";
        }
        else if (currentProp.layout === 'grid') {
            cls += "grid";
        }

        return cls;
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
    <div class={cn(getLayoutClasses(), "relative h-full")}>
        <WidgetRenderer widgets={data.children} />
    </div>

    {#if isActive}
        <SizeTip prop={{width: computedVal.width.toString(), height: computedVal.height.toString()}} />
    {/if}    
</div>


