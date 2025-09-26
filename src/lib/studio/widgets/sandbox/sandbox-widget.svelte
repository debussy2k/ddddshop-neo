<script lang="ts">
    import type { Sandbox, SandboxPropValue } from "./sandbox.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
	import { setupDraggable } from "$lib/studio/widgets/common/draggable";
	import { setupResizable } from "$lib/studio/widgets/common/resizable";
    import { onMount } from "svelte";
    import { cmdSandbox } from "$lib/studio/command";
    import { du } from "$lib/studio/widgets/common/doc-util";
    import SizeTip from "$lib/studio/widgets/common/size-tip.svelte";
    import { canvasManager } from "../../canvas-manager.svelte";
    import { getComputedVal } from "$lib/studio/widgets/common/computed-value-util";
    
	let element: HTMLElement;
    let { data: data }: { data: Sandbox } = $props();
    let isActive = $derived(studioDoc.activeId === data.id);
    let currentProp = $derived(data.prop?.[bpm.current]);
    let parent = $derived(studioDoc.getParentByChildId(data.id));
    let computedVal = $derived.by(() => {
        canvasManager.currentWidth; // 의존성만 추가. canvas크기가 변경되어도 반응하도록 함.
        canvasManager.needUpdate;   // 의존성만 추가. 
        return getComputedVal(data, currentProp);
    })

    onMount(() => {
        
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
				cmdSandbox.updateProp(id, updatedProps, bpm.current);
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
				cmdSandbox.updateProp(id, updatedProps, bpm.current);
			}
		});
	}

    function getParentSize() {
        let parentComp = studioDoc.getWidget<any>(data.parentId);
		return { width: parentComp.getWidth(), height: parentComp.getHeight() };
	}


    function handleClick(event: MouseEvent) {
        studioDoc.activeId = data.id;
        // 이벤트 버블링 방지
        event.stopPropagation();
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Delete') {
            cmdSandbox.remove(data.id);
            event.preventDefault();
            event.stopPropagation();
        }
    }

    function getSandboxClasses(isActive: boolean): string {
        const baseClasses = `border border-green-400 p-4 cursor-pointer`;
        const activeClasses = 'bg-green-100 hover:bg-green-200 border-green-600';
        const inactiveClasses = 'bg-green-50 hover:bg-green-100';

        return `${baseClasses}  ${isActive ? activeClasses : inactiveClasses} `;
    }

    function getCurrentStyle() {
		let parentLayout = parent?.prop[bpm.current].layout || 'block';
        let style = du.getBaseStyleOfLeafWidget(currentProp, parentLayout);
        return style;
    }

</script>

<div 
    bind:this={element}
    class={getSandboxClasses(isActive)}
    style={getCurrentStyle()}
    onmousedown={(e) => handleClick(e as MouseEvent)}
    onkeydown={(e) => handleKeyDown(e as KeyboardEvent)}
    role="button"
    tabindex="0"
>
    <div class="flex flex-col items-center justify-center select-none">
        <div class="text-center text-gray-700 font-medium">
            {data.name}
        </div>
    </div>

    {#if isActive}
        <SizeTip prop={{width: computedVal.width.toString(), height: computedVal.height.toString()}} />
    {/if}
</div>

