<script lang="ts">
    import type { Sandbox } from "./sandbox.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
	import { setupDraggable, unsetup as unsetupDraggable } from "$lib/studio/widgets/common/draggable";
	import { setupResizable } from "$lib/studio/widgets/common/resizable";
    import { onMount } from "svelte";
    import { cmdSandbox } from "$lib/studio/command";
    import * as du from "$lib/studio/widgets/common/doc-util";
    import SizeTip from "$lib/studio/widgets/common/size-tip.svelte";
    import { canvasManager } from "../../canvas-manager.svelte";
    import { getComputedVal } from "$lib/studio/widgets/common/computed-value-util";
    import { ChangeTracker } from "$lib/studio/widgets/common/change-tracker";
    
	let element: HTMLElement | undefined = $state();
    let { data: data }: { data: Sandbox } = $props();
    let isActive = $derived(studioDoc.activeId === data.id);
    let currentProp = $derived(data.prop?.[bpm.current]);
    let parent = $derived(studioDoc.getParentByChildId(data.id));
	let refreshTrigger = $state(0);
    let computedVal = $derived.by(() => {
        canvasManager.currentWidth; // 의존성만 추가. canvas크기가 변경되어도 반응하도록 함.
        canvasManager.needUpdate;   // 의존성만 추가. 
		refreshTrigger;
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
		setupDraggableWidget();
		setupResizableWidget();
		refreshTrigger++;
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
        let parentComp = studioDoc.getWidgetSvelteComponent<any>(data.parentId);
		return { width: parentComp.getWidth(), height: parentComp.getHeight() };
	}


    function handleClick(event: MouseEvent) {
        studioDoc.activeId = data.id;

		// 포커스 설정 추가 - 키보드 이벤트를 받기 위해 필요
		element.focus();		
		
        // 이벤트 버블링 방지
        event.stopPropagation();
        event.preventDefault();
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Delete') {
            cmdSandbox.remove(data.id);
            event.preventDefault();
            event.stopPropagation();
        }
    }

    function getSandboxClasses(isActive: boolean): string {
        const baseClasses = `border border-green-400 cursor-pointer`;
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

    {#if isActive && element}
        <SizeTip prop={{width: computedVal.width.toString(), height: computedVal.height.toString()}} />
    {/if}
</div>

