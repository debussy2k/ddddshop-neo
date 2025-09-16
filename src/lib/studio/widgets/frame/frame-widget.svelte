<script lang="ts">
	import { onMount } from "svelte";
    import type { Frame } from "./frame.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
	import interact from 'interactjs'
	import type { DragEvent, ResizeEvent } from '@interactjs/types'
	import { cmdFrame } from "$lib/studio/command";
	import { util } from "$lib/studio/util";

	let element: HTMLElement;
    let { data: data }: { data: Frame } = $props();

	onMount(() => {
		setupDraggable();
		setupResizable();
	});

	function setupDraggable() {
		let position = {x:0, y:0};
		interact(element).draggable({
			listeners: {
				start: (event: DragEvent) => {
					position.x = util.getNumberPart(currentProp.left);
					position.y = util.getNumberPart(currentProp.top);
					studioDoc.historyManager.setBatchMode();
				},
				move: (event: DragEvent) => {
					position.x += event.dx;
					position.y += event.dy;
					cmdFrame.updateFrameProp(data.id, { 
							left: position.x + 'px', 
							top: position.y + 'px' 
						}
						, bpm.current);
				},
				end: (event: DragEvent) => {
					studioDoc.historyManager.commitBatch();
				}
			}
		});
	}

	function setupResizable() {
		let rect = { width: 0, height: 0, left: 0, top: 0 };

		interact(element).resizable({
			edges: { top: true, left: true, bottom: true, right: true },
			listeners: {
				start: (event: ResizeEvent) => {
					studioDoc.historyManager.setBatchMode();
					rect.width = util.getNumberPart(currentProp.width);
					rect.height = util.getNumberPart(currentProp.height);
					rect.left = util.getNumberPart(currentProp.left);
					rect.top = util.getNumberPart(currentProp.top);
				},
				move: (event: ResizeEvent) => {
					rect.width += event.deltaRect?.width || 0;
					rect.height += event.deltaRect?.height || 0;
					rect.left += event.deltaRect?.left || 0;
					rect.top += event.deltaRect?.top || 0;
					cmdFrame.updateFrameProp(data.id, {
						width: rect.width + 'px',
						height: rect.height + 'px',
						left: rect.left + 'px',
						top: rect.top + 'px'
					}, bpm.current);
				},
				end: (event: ResizeEvent) => {
					studioDoc.historyManager.commitBatch();
				}
			},
			modifiers: [
				interact.modifiers.restrictSize({
					min: { width: 50, height: 50 }
				})
			]
		});
	}

    function handleClick(event: MouseEvent) {
        studioDoc.activeId = data.id;
        // 이벤트 버블링 방지
        event.stopPropagation();
    }

    // 현재 프레임이 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === data.id);
    function getFrameClasses(isActive: boolean): string {
        const baseClasses = `es-frame-widget cursor-pointer bg-white`;
        const activeClasses = 'ring-2 ring-blue-500 ring-offset-2';
        const inactiveClasses = 'hover:ring-1 hover:ring-gray-300';

        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    }

    // 현재 breakpoint에 맞는 스타일 가져오기
    let currentProp = $derived(data.prop?.[bpm.current] || data.prop?.desktop || {
        width: '200px',
        height: '150px',
        padding: '16px'
    });

    function getCurrentStyle() {
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
    onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as unknown as MouseEvent);
        }
    }}
>
    <div class="flex flex-col items-center justify-center h-full">
        <div class="text-center text-gray-600 font-medium text-sm">
            {data.name}
        </div>
        <div class="text-center text-gray-400 text-xs mt-1">
            Frame
        </div>
    </div>
</div>
