<script lang="ts">
    import type { Sandbox } from "./sandbox.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
	import { wui } from "$lib/studio/widgets/common/wui";
    import { onMount } from "svelte";
    import { cmdSandbox } from "$lib/studio/command";
    import { du } from "$lib/studio/widgets/common/doc-util";
    import SizeTip from "$lib/studio/widgets/common/size-tip.svelte";
    
	let element: HTMLElement;
    let { data: data }: { data: Sandbox } = $props();
    let isActive = $derived(studioDoc.activeId === data.id);
    let parent = $derived(studioDoc.getParentById(data.id));

    let currentProp = $derived(data.prop?.[bpm.current]);

    onMount(() => {
        if (!parent) {
            console.error('parent not found', data.id);
        }
        
		setupDraggable();
		setupResizable();
    });

	function setupDraggable() {
		wui.setupDraggable({
			id: data.id,
			element: element,
            getCurrentProp: () => currentProp,
			updateCallback: (id, position) => {
				cmdSandbox.updateSandboxProp(id, position, bpm.current);
			}
		});
	}

	function setupResizable() {
		wui.setupResizable({
			id: data.id,
			element: element,
			getCurrentProp: () => currentProp,
			updateCallback: (id, dimensions) => {
				cmdSandbox.updateSandboxProp(id, dimensions, bpm.current);
			}
		});
	}


    function handleClick(event: MouseEvent) {
        studioDoc.activeId = data.id;
        // 이벤트 버블링 방지
        event.stopPropagation();
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Delete') {
            event.preventDefault();
            cmdSandbox.removeSandbox(data.id);
        }
    }

    function getSandboxClasses(isActive: boolean): string {
        const baseClasses = `border border-green-400 p-4 cursor-pointer w-[200px] h-[100px]`;
        const activeClasses = 'bg-green-100 hover:bg-green-200 border-green-600';
        const inactiveClasses = 'bg-green-50 hover:bg-green-100';

        return `${baseClasses}  ${isActive ? activeClasses : inactiveClasses} `;
    }

    function getCurrentStyle() {
        let style = du.getBaseStyleOfLeafWidget(currentProp, parent?.prop[bpm.current].layout || 'block');
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
            {data.text}
        </div>
    </div>

    {#if isActive}
        <SizeTip prop={currentProp} />
    {/if}
</div>

