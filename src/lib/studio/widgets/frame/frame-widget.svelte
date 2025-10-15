<script lang="ts">
	import { onMount } from "svelte";
    import type { BaseWidgetProp, BaseContainerProp } from "$lib/studio/types";
    import type { Frame } from "./frame.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
	import { cmdFrame } from "$lib/studio/command";
    import WidgetRenderer from "$lib/studio/widgets/common/WidgetRenderer.svelte";
    import SizeTip from "$lib/studio/widgets/common/size-tip.svelte";
    import { canvasManager } from "../../canvas-manager.svelte";
    import { getComputedVal } from "$lib/studio/widgets/common/computed-value-util";
    import { BaseWidgetController } from "../common/base-widget-controller.svelte";
    import { getFramePositionStyle, getFrameChildrenLayoutStyle } from "./frame-style-util";

    let { data }: { data: Frame } = $props();

    // 현재 breakpoint에 맞는 스타일 가져오기
    let currentProp = $derived.by(() => {
		return data.prop?.[bpm.current]
	});
	$effect(() => {
		controller.setCurrentProp(data.prop?.[bpm.current]);		
	});

	// parentProp은 부모 위젯의 속성을 가져옴
	let parentProp = $derived.by(() => {
		let parent = studioDoc.getParentByChildId(data.id);
		return parent?.prop?.[bpm.current] as Readonly<BaseWidgetProp & BaseContainerProp>;
	});
	$effect(() => {
		controller.setParentProp(parentProp);
	});

	// computedVal은 위젯의 계산된 값을 가져옴
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

	export const getElement = () => controller.element; 
	export const getWidth = () => controller.getWidth();
    export const getHeight = () => controller.getHeight();

	const controller = new BaseWidgetController(data, {
		updateProp: (id, updatedProps) => {
			cmdFrame.updateProp(id, updatedProps, bpm.current);
		},
		remove: (id) => {
			cmdFrame.remove(id);
		}
	});

	// 뷰 데이터 - $derived로 자동 업데이트
    const viewData = $derived(controller.getViewData());

	/////////////////////////

	onMount(() => {
		controller.setupDraggableWidget();
		controller.setupResizableWidget();
		controller.refreshTrigger++;
	});

    function getStateClasses(): string {
        const baseClasses = `es-frame-widget cursor-pointer bg-white `;
        const activeClasses = 'outline outline-blue-400';
        const inactiveClasses = 'hover:outline hover:outline-gray-200';
        return `${baseClasses} ${viewData.isActive ? activeClasses : inactiveClasses}`;
    }

    function getPositionStyle() {
		let style = getFramePositionStyle(currentProp, parentProp);
		requestAnimationFrame(() => controller.refreshTrigger++); // style 변경 후 computedVal을 다시 계산되도록 하기 위함
        return style;
    }

	function getChildrenLayoutStyle() {
		return getFrameChildrenLayoutStyle(currentProp);
	}

</script>

<div 
	bind:this={controller.element}
    class={getStateClasses()}
    style={getPositionStyle()}
    role="button"
    tabindex="0"
    onmousedown={(e) => controller.handleMousedown(e as MouseEvent)}
    onkeydown={(e) => controller.handleKeyDown(e as KeyboardEvent)}
>
    <div class="relative h-full" style={getChildrenLayoutStyle()}>
        <WidgetRenderer widgets={data.children} />
    </div>

    {#if viewData.isActive}
        <SizeTip prop={{width: computedVal.width.toString(), height: computedVal.height.toString()}} />
    {/if}    
</div>


