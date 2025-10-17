<script lang="ts">
	import type { Sandbox } from './sandbox.type';
	import { studioDoc } from '$lib/studio/studio-doc.svelte';
	import { onMount } from 'svelte';
	import { cmdSandbox } from '$lib/studio/command';
	import * as du from '$lib/studio/widgets/common/doc-util';
	import SizeTip from '$lib/studio/widgets/common/size-tip.svelte';
	import { canvasManager } from '../../canvas-manager.svelte';
	import { getComputedVal } from '$lib/studio/widgets/common/computed-value-util';
	import { BaseWidgetController } from '../common/base-widget-controller.svelte';
	import type { BaseWidgetProp, BaseContainerProp } from '$lib/studio/types';
	import type { Context } from '$lib/studio/context.svelte';
	import { bpm } from '$lib/studio/breakpoint-man.svelte';

	let { data, context }: { data: Sandbox; context: Context } = $props();

	// 현재 breakpoint에 맞는 속성 가져오기
	let currentProp = $derived.by(() => {
		return data.prop?.[context.break];
	});
	$effect(() => {
		controller.setCurrentProp(data.prop?.[context.break]);
	});

	// parentProp은 부모 위젯의 속성을 가져옴
	let parentProp = $derived.by(() => {
		let parent = studioDoc.getParentByChildId(data.id);
		return parent?.prop?.[context.break] as Readonly<BaseWidgetProp & BaseContainerProp>;
	});
	$effect(() => {
		controller.setParentProp(parentProp);
	});

	let isActive = $derived(studioDoc.activeId === data.id);

	// computedVal은 위젯의 계산된 값을 가져옴
	let computedVal = $derived.by(() => {
		canvasManager.currentWidth; // 의존성만 추가. canvas크기가 변경되어도 반응하도록 함.
		canvasManager.needUpdate; // 의존성만 추가.
		controller.refreshTrigger;
		isActive; // 선택 상태 변경에 반응하도록 함
		// console.log('(B)Sandbox computedVal', data.id);
		return getComputedVal(data, context.break);
	});
	$effect(() => {
		controller.setComputedVal(computedVal);
	});

	const controller = new BaseWidgetController(data, context, {
		updateProp: (id, updatedProps) => {
			cmdSandbox.updateProp(id, updatedProps, context.break);
		},
		remove: (id) => {
			cmdSandbox.remove(id);
		},
		getBreakPoint: () => context.break
	});

	// 뷰 데이터 - $derived로 자동 업데이트
	const viewData = $derived(controller.getViewData());

	/////////////////////////

	onMount(() => {
		controller.setupDraggableWidget();
		controller.setupResizableWidget();
		controller.refreshTrigger++;
	});

	function getSandboxClasses(): string {
		const baseClasses = `es-sandbox-widget`;
		const activeClasses = 'outline outline-blue-400';
		const inactiveClasses = 'hover:outline hover:outline-blue-300';
		const panningClasses = context.isPanning ? 'pointer-events-none' : '';

		return `${baseClasses} ${viewData.isActive ? activeClasses : inactiveClasses} ${panningClasses}`;
	}

	/*
        du.getBaseStyleOfLeafWidget()가 studioDoc.doc에 의존하고 있는 관계로 모든 변화에 반응하게 됨
        그러나 currentStyle의 값이 동일하면 $effect()가 실행되지 않음.
    */
	let positionStyle = $derived.by(() => {
		// console.log('(A)Sandbox currentStyle', data.id);
		let parentLayout = parentProp?.layout || 'block';
		return du.getBaseStyleOfLeafWidget(currentProp, parentLayout);
	});
	$effect(() => {
		positionStyle;
		// style 변경 후 computedVal을 다시 계산되도록 하기 위해 refreshTrigger를 증가시킴
		requestAnimationFrame(() => {
			controller.refreshTrigger++;
		});
	});
</script>

<div
	id={`${data.id}-${context.break}`}
	bind:this={controller.element}
	class={getSandboxClasses()}
	style={positionStyle}
	role="button"
	tabindex="0"
	onmousedown={(e) => controller.handleMousedown(e as MouseEvent)}
	onkeydown={(e) => controller.handleKeyDown(e as KeyboardEvent)}
>
	<div class="flex flex-col items-center justify-center select-none">
		<div class="text-center font-medium text-gray-700">
			{data.name}
		</div>
	</div>

	{#if viewData.isActive && context.break === bpm.current}
		<SizeTip
			prop={{
				width: computedVal.width.toString(),
				height: computedVal.height.toString(),
				sizeConstraints: currentProp.sizeConstraints
			}}
		/>
	{/if}
</div>
