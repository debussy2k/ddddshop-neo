<script lang="ts">
    import type { Sandbox } from "./sandbox.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
	import { wui } from "$lib/studio/widgets/common/wui";
    import { onMount } from "svelte";
    import { cmdSandbox } from "$lib/studio/command";

    
	let element: HTMLElement;
    let { data: data }: { data: Sandbox } = $props();
    let isActive = $derived(studioDoc.activeId === data.id);

    let currentProp = $derived(data.prop?.[bpm.current] || data.prop?.desktop || {
        left: '10px',
        top: '10px',
        width: '200px',
        height: '100px',
    });

    onMount(() => {
		setupDraggable();
		setupResizable();
    });

	function setupDraggable() {
		wui.setupDraggable({
			id: data.id,
			element: element,
            getCurrentProp: () => currentProp,
			updateCallback: (id, position) => {
                console.log('position', position);
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

    function getSandboxClasses(isActive: boolean): string {
        const baseClasses = `border border-green-400 rounded-lg p-4 cursor-pointer w-[200px] h-[100px]`;
        const activeClasses = 'bg-green-100 hover:bg-green-200 border-green-600';
        const inactiveClasses = 'bg-green-50 hover:bg-green-100';

        return `${baseClasses}  ${isActive ? activeClasses : inactiveClasses} `;
    }

    function getCurrentStyle() {
        console.log('currentProp', currentProp);
        let style = `
            position: absolute;
            left: ${currentProp.left};
            top: ${currentProp.top};
            width: ${currentProp.width};
            height: ${currentProp.height};
        `;

        return style;
    }

</script>

<div 
    bind:this={element}
    class={getSandboxClasses(isActive)}
    style={getCurrentStyle()}
    onclick={(e) => handleClick(e as MouseEvent)}
    role="button"
    tabindex="0"
    onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as any);
        }
    }}
>
    <div class="flex flex-col items-center justify-center ">
        <div class="text-center text-gray-700 font-medium">
            {data.text}
        </div>
    </div>
</div>
