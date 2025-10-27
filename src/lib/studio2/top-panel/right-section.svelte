<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface Props {
		class?: ClassValue;
	}

	let { class: className }: Props = $props();
</script>

<div class={cn('w-1/3 flex items-center gap-1 px-2', className || '')}>
	<!-- 오른쪽 영역 내용 - 추후 확장 가능 -->
	<div class="text-sm text-gray-600">
	</div>
</div>
