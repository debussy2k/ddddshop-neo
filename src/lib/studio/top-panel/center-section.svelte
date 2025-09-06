<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import Button from '$lib/components/ui/button/button.svelte';
	import type { BreakPoint } from "../studio-doc.svelte";
	import { studioDoc } from "../studio-doc.svelte";

	interface Props {
		class?: ClassValue;
	}

	let { class: className }: Props = $props();

	function handleBreakPointClick(breakPoint: BreakPoint) {
		studioDoc.breakPoint = breakPoint;
	}

</script>

<div class={cn('w-1/3 flex justify-center items-center gap-1 px-2', className || '')}>
	<!-- 중앙 영역 내용 - 추후 확장 가능 -->
	<div class="text-sm text-gray-600">
		<div class="flex gap-x-1">
			<Button variant="outline" size="sm" 
				class={cn("h-6 w-6 p-0", studioDoc.breakPoint === 'mobile' ? 'bg-gray-300' : '')} 
				title="Mobile" 
				onclick={() => handleBreakPointClick('mobile')}>
				M
			</Button>

			<Button variant="outline" size="sm" 
				class={cn("h-6 w-6 p-0", studioDoc.breakPoint === 'tablet' ? 'bg-gray-300' : '')} 
				title="Tablet" 
				onclick={() => handleBreakPointClick('tablet')}>
				T
			</Button>

			<Button variant="outline" size="sm" 
				class={cn("h-6 w-6 p-0", studioDoc.breakPoint === 'desktop' ? 'bg-gray-300' : '')} 
				title="Desktop" 
				onclick={() => handleBreakPointClick('desktop')}>
				P
			</Button>

		</div>
	</div>
</div>
