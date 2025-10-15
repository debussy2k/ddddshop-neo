<script lang="ts">
	let { wrapper = $bindable(), isOpen, isDialog, children } = $props();
	
	let wrapperEl: HTMLElement | undefined = $state(undefined);
	
	$effect(() => {
		if (wrapperEl && isOpen && isDialog) {
			// 트리거 버튼 찾기 (ColorPicker 내부 button)
			const container = wrapperEl.parentElement;
			
			if (container) {
				const rect = container.getBoundingClientRect();
				const pickerWidth = wrapperEl.offsetWidth || 300;
				
				wrapperEl.style.left = `${rect.left - pickerWidth - 10}px`;
				wrapperEl.style.top = `${rect.top}px`;
			}
		}
	});

	// 내부 클릭 시 이벤트 전파 방지 (outside click 방지)
	function handleClick(event: MouseEvent) {
        console.log("handleClick", event);
		event.stopPropagation();
	}
</script>

<div
	bind:this={wrapperEl}
	class="wrapper"
	class:is-open={isOpen}
	role={isDialog ? 'dialog' : undefined}
	aria-label="color picker"
    onmousedown={handleClick}
>
	{@render children()}
</div>

<style>
	div {
		padding: 8px;
		background-color: var(--cp-bg-color, white);
		margin: 0;
		border: 1px solid var(--cp-border-color, #e5e7eb);
		border-radius: 12px;
		display: none;
		width: 220px;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}
	.is-open {
		display: inline-block;
	}
	[role='dialog'] {
		position: fixed;
		z-index: 1000;
	}
</style>