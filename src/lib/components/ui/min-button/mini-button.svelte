<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface Props {
		onClick: () => void;
		icon: string; // SVG 파일 URL
        title?: string;
		alt?: string;
		class?: ClassValue;
	}
	
	let { onClick, icon, title = "", alt = "icon", class: className }: Props = $props();
	
	let isPressed = $state(false);
	let isHovered = $state(false);

	// 외부 mouseup 이벤트 감지하여 상태 리셋
	$effect(() => {
		function handleGlobalMouseUp() {
			isPressed = false;
		}

		document.addEventListener('mouseup', handleGlobalMouseUp);
		
		return () => {
			document.removeEventListener('mouseup', handleGlobalMouseUp);
		};
	});
</script>

<button 
	type="button"
	class={cn(
		"w-6 h-6 rounded-sm cursor-pointer transition-colors",
		isPressed ? "bg-gray-300" : 
		isHovered ? "bg-gray-100" : "",
		className
	)}
	onmousedown={() => { isPressed = true; }}
	onmouseenter={() => { isHovered = true; }}
	onmouseleave={() => { isHovered = false; }}
	tabindex="0"
	title={title}
	onclick={onClick}
>
	{@html icon}
</button>