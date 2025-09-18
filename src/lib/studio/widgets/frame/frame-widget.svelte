<script lang="ts">
	import { onMount } from "svelte";
    import type { Frame } from "./frame.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
	import { cmdFrame } from "$lib/studio/command";
	import { wui } from "$lib/studio/widgets/common/wui";
    import WidgetRenderer from "$lib/studio/widgets/common/WidgetRenderer.svelte";
    import { du } from "$lib/studio/widgets/common/doc-util";
	import { cn } from "$lib/utils";


	let element: HTMLElement;
    let { data: data }: { data: Frame } = $props();
    // 현재 프레임이 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === data.id);
    // 현재 breakpoint에 맞는 스타일 가져오기
    let currentProp = $derived(data.prop?.[bpm.current]);
    let parent = $derived(studioDoc.getParentById(data.id));

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

    function handleMoutdown(event: MouseEvent) {
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
        const baseClasses = `es-frame-widget cursor-pointer bg-white `;
        const activeClasses = 'outline outline-blue-400';
        const inactiveClasses = 'hover:outline hover:outline-gray-200';

        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    }

    function getCurrentStyle() {
        let style = du.getBaseStyleOfLeafWidget(currentProp, parent?.prop[bpm.current].layout || 'block');
        style += `
            padding: ${currentProp.padding};
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
</div>
