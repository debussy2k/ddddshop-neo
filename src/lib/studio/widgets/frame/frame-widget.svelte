<script lang="ts">
	import { onMount } from "svelte";
    import type { BaseWidgetProp, BaseContainerProp } from "$lib/studio/types";
    import type { Frame } from "./frame.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
	import { cmdFrame } from "$lib/studio/command";
    import WidgetRenderer from "$lib/studio/widgets/common/WidgetRenderer.svelte";
    import * as du from "$lib/studio/widgets/common/doc-util";
    import SizeTip from "$lib/studio/widgets/common/size-tip.svelte";
    import { canvasManager } from "../../canvas-manager.svelte";
    import { getComputedVal } from "$lib/studio/widgets/common/computed-value-util";
    import { BaseWidgetController } from "../common/base-widget-controller.svelte";
    import { getFrameCurrentStyle, getFrameLayoutStyle } from "./frame-style-util";

    let { data }: { data: Frame } = $props();

    // 현재 breakpoint에 맞는 스타일 가져오기
    let currentProp = $derived.by(() => {
		return data.prop?.[bpm.current]
	});
	$effect(() => {
		controller.setCurrentProp(data.prop?.[bpm.current]);		
	});

	let parentProp = $derived.by(() => {
		let parent = studioDoc.getParentByChildId(data.id);
		return parent?.prop?.[bpm.current] as Readonly<BaseWidgetProp&BaseContainerProp>;
	});
	$effect(() => {
		controller.setParentProp(parentProp);
	});

    let computedVal = $derived.by(() => {
        canvasManager.currentWidth; // 의존성만 추가. canvas크기가 변경되어도 반응하도록 함.
        canvasManager.needUpdate;   // 의존성만 추가. 
        controller.refreshTrigger;
		// console.log('Frame computedVal', data.id);
		return getComputedVal(data);
    })
	$effect(() => {
		controller.setComputedVal(computedVal);
	});


	const controller = new BaseWidgetController(data, {
		updateCallback: (id, updatedProps) => {
			cmdFrame.updateProp(id, updatedProps, bpm.current);
		},
		removeCallback: (id) => {
			cmdFrame.remove(id);
		}
	});

	// 뷰 데이터 - $derived로 자동 업데이트
    const viewData = $derived(controller.getViewData());


	onMount(() => {
		controller.setupDraggableWidget();
		controller.setupResizableWidget();
		controller.refreshTrigger++;
	});


    function getFrameClasses(): string {
        const baseClasses = `es-frame-widget cursor-pointer bg-white `;
        const activeClasses = 'outline outline-blue-400';
        const inactiveClasses = 'hover:outline hover:outline-gray-200';
        return `${baseClasses} ${viewData.isActive ? activeClasses : inactiveClasses}`;
    }

    function getCurrentStyle() {
		let style = getFrameCurrentStyle(currentProp, parentProp);
		requestAnimationFrame(() => controller.refreshTrigger++); // style 변경 후 computedVal을 다시 계산되도록 하기 위해 콜백 실행
        return style;
    }

	function getLayoutStyle() {
		return getFrameLayoutStyle(currentProp);
	}

	export function getElement() {
		return controller.element;
	}

	export function getWidth() : number {
		return controller.getWidth();
	}

    export function getHeight() : number {
		return controller.getHeight();
	}    

</script>

<div 
	bind:this={controller.element}
    class={getFrameClasses()}
    style={getCurrentStyle()}
    onmousedown={(e) => controller.handleMousedown(e as MouseEvent)}
    role="button"
    tabindex="0"
    onkeydown={(e) => controller.handleKeyDown(e as KeyboardEvent)}
>
    <div class="relative h-full" style={getLayoutStyle()}>
        <WidgetRenderer widgets={data.children} />
    </div>

    {#if viewData.isActive}
        <SizeTip prop={{width: computedVal.width.toString(), height: computedVal.height.toString()}} />
    {/if}    
</div>


