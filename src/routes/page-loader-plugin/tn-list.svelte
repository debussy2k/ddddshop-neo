<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface Props {
		class?: ClassValue;
		project: any;
		selectedThumbnails?: number[];
		hoveredThumbnailIndex?: number;
		onThumbnailClick?: (index: number) => void;
		onThumbnailMouseEnter?: (index: number) => void;
		onThumbnailMouseLeave?: () => void;
		onViewThumbnail?: (index: number) => void;
		isInnerPageSize?: (edicusPsCode: string) => boolean;
	}

	let { 
		class: className, 
		project, 
		selectedThumbnails = [], 
		hoveredThumbnailIndex = -1,
		onThumbnailClick,
		onThumbnailMouseEnter,
		onThumbnailMouseLeave,
		onViewThumbnail,
		isInnerPageSize
	}: Props = $props();

	function isThumbnailSelected(index: number): boolean {
		return selectedThumbnails.includes(index);
	}

	function handleThumbnailClick(index: number) {
		if (onThumbnailClick) {
			onThumbnailClick(index);
		}
	}

	function handleThumbnailMouseEnter(index: number) {
		if (onThumbnailMouseEnter) {
			onThumbnailMouseEnter(index);
		}
	}

	function handleThumbnailMouseLeave() {
		if (onThumbnailMouseLeave) {
			onThumbnailMouseLeave();
		}
	}

	function handleViewThumbnail(index: number) {
		if (onViewThumbnail) {
			onViewThumbnail(index);
		}
	}
</script>

{#if project.tnUrls && project.tnUrls.length > 0}
	<div class={cn('flex gap-2 mt-2 overflow-x-auto p-4', className || '')}>
		{#each project.tnUrls as tnUrl, index}
			<div class="flex flex-col items-center">
				<div 
					class="relative"
					onmouseenter={() => handleThumbnailMouseEnter(index)}
					onmouseleave={handleThumbnailMouseLeave}
					role="group"
					aria-label={`썸네일 ${index + 1} 컨테이너`}
				>
					<button 
						type="button"
						class={cn(
							'relative border-2 rounded-md transition-all duration-200 p-0 bg-transparent',
							isInnerPageSize && isInnerPageSize(project.edicusPsCode)
								? 'cursor-pointer hover:scale-105' 
								: 'cursor-not-allowed opacity-60',
							isThumbnailSelected(index) 
								? 'border-blue-500 bg-blue-50 shadow-md' 
								: 'border-gray-200 hover:border-gray-400'
						)}
						onclick={() => handleThumbnailClick(index)}
						disabled={isInnerPageSize ? !isInnerPageSize(project.edicusPsCode) : false}
						aria-label={`썸네일 ${index + 1} ${isThumbnailSelected(index) ? '선택됨' : '선택하기'}`}
					>
						<img 
							src={tnUrl} 
							alt={project.title} 
							class='w-26 h-26 object-contain max-w-[200px] max-h-[200px] rounded-sm' 
						/>
						{#if isThumbnailSelected(index)}
							<div class="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
								✓
							</div>
						{/if}
					</button>
					
					<!-- 호버 시 보기 버튼 -->
					{#if hoveredThumbnailIndex === index}
						<button
							type="button"
							class="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs hover:bg-opacity-90 transition-all duration-200"
							onclick={(e) => {
								e.stopPropagation();
								handleViewThumbnail(index);
							}}
							aria-label={`썸네일 ${index + 1} 크게 보기`}
						>
							보기
						</button>
					{/if}
				</div>
				<div class={cn(
					'text-sm mt-1',
					isThumbnailSelected(index) ? 'text-blue-600 font-semibold' : 'text-gray-600'
				)}>
					{index + 1}
				</div>
			</div>
		{/each}
	</div>
{/if}
