<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import Button from '$lib/components/ui/button/button.svelte';
	import { bpm, type BreakPoint } from "../breakpoint-man.svelte";

	interface Props {
		class?: ClassValue;
	}

	let { class: className }: Props = $props();

	function handleBreakPointClick(breakPoint: BreakPoint) {
		bpm.breakPoint = breakPoint;
	}

</script>

<div class={cn('w-1/3 flex justify-center items-center gap-1 px-2', className || '')}>
	<!-- 중앙 영역 내용 - 추후 확장 가능 -->
	<div class="text-sm text-gray-600">
		<div class="flex gap-x-2">
			<Button variant="outline" size="sm" 
				class={cn("h-6 w-8 p-0", bpm.isDesktop ? 'bg-gray-300' : '')} 
				title="Desktop" 
				onclick={() => handleBreakPointClick('desktop')}>
				<div class="w-4 h-4"><svg data-wf-icon="DesktopStarBreakpointIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.36602L10.1519 6.43301L9.65192 5.56699L11.5 4.5L9.65193 3.43301L10.1519 2.56699L12 3.63397V1.5H13V3.63397L14.8481 2.56699L15.3481 3.43301L13.5 4.5L15.3481 5.56699L14.8481 6.43301L13 5.36602V7.5H12V5.36602ZM3 4H8V5H3V12H13V9H14V12H16V13H0V12H2V5C2 4.44772 2.44772 4 3 4Z" fill="currentColor"></path></svg></div>
			</Button>

			<Button variant="outline" size="sm" 
				class={cn("h-6 w-8 p-0", bpm.isTablet ? 'bg-gray-300' : '')} 
				title="Tablet : 991 이하" 
				onclick={() => handleBreakPointClick('tablet')}>
				<div class="w-4 h-4"><svg data-wf-icon="TabletPortraitBreakpointIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 3H12V13H4V3ZM3 3C3 2.44772 3.44772 2 4 2H12C12.5523 2 13 2.44772 13 3V13C13 13.5523 12.5523 14 12 14H4C3.44772 14 3 13.5523 3 13V3ZM9.5 11H6.5V12H9.5V11Z" fill="currentColor"></path></svg></div>
			</Button>

			<Button variant="outline" size="sm"
				class={cn("h-6 w-8 p-0", bpm.isMobile ? 'bg-gray-300' : '')} 
				title="Mobile : 767px 이하" 
				onclick={() => handleBreakPointClick('mobile')}>
				<div class="w-4 h-4"><svg data-wf-icon="MobileBreakpointIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 12H9V11H7V12Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4 4C4 2.89543 4.89543 2 6 2H10C11.1046 2 12 2.89543 12 4V12C12 13.1046 11.1046 14 10 14H6C4.89543 14 4 13.1046 4 12V4ZM6 3H10C10.5523 3 11 3.44772 11 4V12C11 12.5523 10.5523 13 10 13H6C5.44772 13 5 12.5523 5 12V4C5 3.44772 5.44772 3 6 3Z" fill="currentColor"></path></svg></div>
			</Button>

		</div>
	</div>
</div>
