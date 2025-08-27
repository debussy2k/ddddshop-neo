<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface Props {
		class?: ClassValue;
	}

	let { class: className }: Props = $props(); 
</script>

<div class={cn('bg-gray-50', className || '')}>
	<!-- Workspace 내용이 여기에 들어갑니다 -->
</div>
