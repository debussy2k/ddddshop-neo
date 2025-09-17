<script lang="ts">
	import { onMount } from "svelte";
    import type { Frame } from "./frame.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
	import { cmdFrame } from "$lib/studio/command";
	import { wui } from "$lib/studio/widgets/common/wui";
    import WidgetRenderer from "$lib/studio/widgets/common/WidgetRenderer.svelte";


	let element: HTMLElement;
    let { data: data }: { data: Frame } = $props();
    // 현재 프레임이 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === data.id);
    // 현재 breakpoint에 맞는 스타일 가져오기
    let currentProp = $derived(data.prop?.[bpm.current] || data.prop?.desktop || {
        width: '200px',
        height: '150px',
        padding: '16px'
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
				cmdFrame.updateFrameProp(id, position, bpm.current);
			}
		});
	}

	function setupResizable() {
		wui.setupResizable({
			id: data.id,
			element: element,
			getCurrentProp: () => currentProp,
			updateCallback: (id, dimensions) => {
				cmdFrame.updateFrameProp(id, dimensions, bpm.current);
			}
		});
	}

    function handleClick(event: MouseEvent) {
        studioDoc.activeId = data.id;
        // 이벤트 버블링 방지
        event.stopPropagation();
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Delete') {
            e.preventDefault();
            e.stopPropagation();
            cmdFrame.removeFrame(data.id);
        }
    }

    function getFrameClasses(isActive: boolean): string {
        const baseClasses = `es-frame-widget cursor-pointer bg-white`;
        const activeClasses = 'ring-2 ring-blue-500 ring-offset-2';
        const inactiveClasses = 'hover:ring-1 hover:ring-gray-300';

        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    }


    function getCurrentStyle() {
        console.log('currentProp', currentProp);
        let style = `
            position: absolute;
            left: ${currentProp.left};
            top: ${currentProp.top};
            width: ${currentProp.width};
            height: ${currentProp.height};
            padding: ${currentProp.padding};
        `;

        return style;
    }

</script>

<div 
	bind:this={element}
    class={getFrameClasses(isActive)}
    style={getCurrentStyle()}
    onclick={(e) => handleClick(e as MouseEvent)}
    role="button"
    tabindex="0"
    onkeydown={handleKeyDown}
>
    <div class="flex flex-col items-center justify-center h-full">
        <WidgetRenderer widgets={data.children} />
    </div>
</div>
