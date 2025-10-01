<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface Props {
		icon: string; // SVG 파일 URL
		toggled: boolean;
		onToggle?: (toggled: boolean) => void;
		title?: string;
		alt?: string;
		class?: ClassValue;
	}
	
	let { toggled = $bindable(), onToggle, icon, title = "", alt = "icon", class: className }: Props = $props();
	
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

	function handleClick() {
		toggled = !toggled;
		if (onToggle) {
			onToggle(toggled);
		}
	}
</script>

<button 
	type="button"
	class={cn(
		"w-6 h-6 rounded-sm cursor-pointer transition-colors flex items-center justify-center",
		isPressed ? "bg-gray-300" : 
		toggled ? "bg-blue-100 text-blue-600" :
		isHovered ? "bg-gray-100" : "",
		className
	)}
	onmousedown={() => { isPressed = true; }}
	onmouseenter={() => { isHovered = true; }}
	onmouseleave={() => { isHovered = false; }}
	tabindex="0"
	title={title}
	onclick={handleClick}
>
	{@html icon}
</button>
