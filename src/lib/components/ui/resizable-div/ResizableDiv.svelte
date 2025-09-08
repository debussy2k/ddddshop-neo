<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { onMount, onDestroy } from "svelte";

	interface Props {
		class?: ClassValue;
		initialWidth?: number;
		minWidth?: number;
		maxWidth?: number;
		children?: any;
		doubleResize?: boolean; // 마우스 움직임의 2배로 리사이즈하는 옵션
		onWidthChange?: (width: number) => void; // 너비 변경 시 호출되는 콜백
	}

	let { 
		class: className, 
		initialWidth = 300, 
		minWidth = 100, 
		maxWidth = 800,
		doubleResize = false,
		onWidthChange,
		children
	}: Props = $props();

	let containerRef: HTMLDivElement;
	let currentWidth = $state(initialWidth);
	let isResizing = $state(false);
	let startX = $state(0);
	let startWidth = $state(0);
	let resizeDirection = $state<'left' | 'right' | null>(null);
	let showHandles = $state(false);

	// initialWidth 변경 시 currentWidth 업데이트
	$effect(() => {
		currentWidth = initialWidth;
		if (containerRef) {
			containerRef.style.width = initialWidth + 'px';
		}
		if (onWidthChange) {
			onWidthChange(initialWidth);
		}
	});

	// maxWidth 변경 시 현재 너비가 maxWidth를 초과하면 조정
	$effect(() => {
		if (currentWidth > maxWidth) {
			currentWidth = maxWidth;
			if (containerRef) {
				containerRef.style.width = maxWidth + 'px';
			}
			if (onWidthChange) {
				onWidthChange(maxWidth);
			}
		}
	});

	// minWidth 변경 시 현재 너비가 minWidth보다 작으면 조정
	$effect(() => {
		if (currentWidth < minWidth) {
			currentWidth = minWidth;
			if (containerRef) {
				containerRef.style.width = minWidth + 'px';
			}
			if (onWidthChange) {
				onWidthChange(minWidth);
			}
		}
	});

	function handleMouseDown(event: MouseEvent, direction: 'left' | 'right') {
		event.preventDefault();
		isResizing = true;
		resizeDirection = direction;
		startX = event.clientX;
		startWidth = currentWidth;
		
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		document.body.style.cursor = 'ew-resize';
		document.body.style.userSelect = 'none';
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isResizing || !resizeDirection) return;
		
		const deltaX = event.clientX - startX;
		// doubleResize 옵션이 활성화되면 마우스 움직임의 2배로 리사이즈
		const multiplier = doubleResize ? 2 : 1;
		const adjustedDeltaX = deltaX * multiplier;
		
		let newWidth = startWidth;
		
		if (resizeDirection === 'right') {
			newWidth = startWidth + adjustedDeltaX;
		} else if (resizeDirection === 'left') {
			newWidth = startWidth - adjustedDeltaX;
		}
		
		// 최소/최대 값 제한
		newWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);
		currentWidth = newWidth;
		
		if (containerRef) {
			containerRef.style.width = newWidth + 'px';
		}
		
		// 너비 변경 콜백 호출
		if (onWidthChange) {
			onWidthChange(newWidth);
		}
	}

	function handleMouseUp() {
		isResizing = false;
		resizeDirection = null;
		
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
		document.body.style.cursor = '';
		document.body.style.userSelect = '';
	}

	function handleHandleMouseEnter() {
		showHandles = true;
	}

	function handleHandleMouseLeave() {
		showHandles = false;
	}

	onDestroy(() => {
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
		document.body.style.cursor = '';
		document.body.style.userSelect = '';
	});
</script>

<div 
	bind:this={containerRef}
	class={cn('relative', className || '')}
	style="width: {currentWidth}px;"
>
	<!-- 왼쪽 리사이즈 핸들 (박스 바깥쪽) -->
	<div 
		class="pointer-events-auto resize-handle-left absolute -left-1 top-0 w-1 h-full bg-blue-400 cursor-col-resize transition-opacity duration-200 {showHandles ? 'opacity-100' : 'opacity-0'}"
		onmousedown={(e) => handleMouseDown(e, 'left')}
		onmouseenter={handleHandleMouseEnter}
		onmouseleave={handleHandleMouseLeave}
		role="button"
		tabindex="0"
	>
	</div>

	<!-- 오른쪽 리사이즈 핸들 (박스 바깥쪽, 왼쪽과 동일) -->
	<div 
		class="pointer-events-auto resize-handle-right-bar absolute -right-1 top-0 w-1 h-full bg-blue-400 cursor-col-resize transition-opacity duration-200 {showHandles ? 'opacity-100' : 'opacity-0'}"
		onmousedown={(e) => handleMouseDown(e, 'right')}
		onmouseenter={handleHandleMouseEnter}
		onmouseleave={handleHandleMouseLeave}
		role="button"
		tabindex="0"
	>
	</div>

	<!-- 오른쪽 튀어나온 핸들 (추가 핸들) -->
	<div 
		class="pointer-events-auto resize-handle-right-knob absolute -right-4 top-5/12 transform -translate-y-1/2 w-4 h-12 bg-blue-500 rounded-sm cursor-col-resize hover:bg-blue-600 transition-all duration-200 shadow-md {showHandles ? 'opacity-100' : 'opacity-0'}"
		onmousedown={(e) => handleMouseDown(e, 'right')}
		onmouseenter={handleHandleMouseEnter}
		onmouseleave={handleHandleMouseLeave}
		role="button"
		tabindex="0"
	>
		<div class="flex items-center justify-center h-full">
			<div class="w-0.5 h-4 bg-white rounded-full"></div>
		</div>
	</div>

	<!-- 컨텐츠 영역 -->
	<div class="h-full overflow-hidden">
		{@render children?.()}
	</div>

	<!-- 너비 표시 박스 (드래그 중에만 표시) -->
	{#if isResizing}
		<div class="absolute bottom-2 right-2 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg z-20 pointer-events-none">
			{currentWidth}px
		</div>
	{/if}
</div>

<style>
	.resize-handle-left,
	.resize-handle-right-bar,
	.resize-handle-right-knob {
		z-index: 10;
	}
</style>
