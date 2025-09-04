<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import ThumbnailPopup from "./thumbnail-popup.svelte";

	interface Props {
		class?: ClassValue;
		project: any;
		selectedThumbnails?: number[];
		onSelectAll?: (project: any) => void;
		onSelectPartial?: (project: any) => void;
		onThumbnailSelect?: (projectId: string, thumbnailIndex: number) => void;
	}

	let { class: className, project, selectedThumbnails = [], onSelectAll, onSelectPartial, onThumbnailSelect }: Props = $props();

	// 전체 선택 체크박스 상태 계산
	let isAllSelected = $derived.by(() => {
		if (!project.tnUrls || project.tnUrls.length === 0) return false;
		return selectedThumbnails.length === project.tnUrls.length;
	});

	// 체크박스 상태를 바인딩용 변수로 분리
	let checkboxChecked = $state(false);

	// isAllSelected가 변경될 때 checkboxChecked도 업데이트
	$effect(() => {
		checkboxChecked = isAllSelected;
	});

	// checkboxChecked가 변경될 때 핸들러 실행
	$effect(() => {
		// 초기 로드 시에는 실행하지 않음
		if (checkboxChecked !== isAllSelected) {
			handleSelectAll();
		}
	});

	// 팝업 상태 관리
	let isPopupOpen = $state(false);
	let popupImageUrl = $state('');
	let popupPageNumber = $state(0);
	let hoveredThumbnailIndex = $state(-1);

	function getProductOptionName(productOptions: any[], optionName: string) {
		return productOptions.find((option) => option.displayName === optionName)?.displayValue;
	}

	function getDateTime(date: string) {
		return new Date(date).toLocaleDateString('ko-KR', { 
			year: 'numeric', 
			month: '2-digit', 
			day: '2-digit', 
			hour: '2-digit', 
			minute: '2-digit' 
		});
	}

	function handleSelectAll(event?: Event) {
		console.log('handleSelectAll 호출됨:', project.edicusProjectId);
		// 이벤트가 있다면 기본 동작을 막지 않고 우리 로직을 실행
		if (onSelectAll) {
			onSelectAll(project);
		}
	}

	function handleSelectPartial() {
		if (onSelectPartial) {
			onSelectPartial(project);
		}
	}

	function handleThumbnailClick(index: number) {
		if (onThumbnailSelect) {
			onThumbnailSelect(project.edicusProjectId, index);
		}
	}

	function isThumbnailSelected(index: number): boolean {
		return selectedThumbnails.includes(index);
	}

	function handleViewThumbnail(imageUrl: string, index: number) {
		popupImageUrl = imageUrl;
		popupPageNumber = index + 1;
		isPopupOpen = true;
	}

	function closePopup() {
		isPopupOpen = false;
		popupImageUrl = '';
		popupPageNumber = 0;
	}

	function handleThumbnailMouseEnter(index: number) {
		hoveredThumbnailIndex = index;
	}

	function handleThumbnailMouseLeave() {
		hoveredThumbnailIndex = -1;
	}
</script>

<div class={cn('border border-gray-200', className || '')}>
	<div class='flex gap-x-4 p-4'>
		<!-- 썸네일 -->
		<div>
			<img 
				src={project.thumbnailUrl} 
				alt={project.title} 
				class='w-26 h-26 object-contain border border-gray-200' 
			/>
		</div>

		<!-- 상세정보 -->
		<div class='flex flex-1'>
			<!-- 왼쪽 상세정보 -->
			<div class='flex flex-col gap-1 flex-1'>
				<div class="text-lg font-bold">{project.title}</div>
				<div>
					초대 계정(ID): {project.childUserLoginId} | {project.childUserDisplayName}
				</div>
				<div class='flex'>
					<div class='bg-gray-200 border border-gray-300 px-1 rounded-xs mr-2'>판형</div>
					{getProductOptionName(project.productOptions, '판형')}
				</div>
				<div>
					수정 : {getDateTime(project.modificationDate)}
				</div>
			</div>

			<!-- 오른쪽 액션 버튼들 -->
			<div class='w-[120px] flex-shrink-0 flex items-center'>
				<div class="flex flex-col gap-2">
					<div class="flex justify-start items-center">
						<Checkbox 
							id="selectAll-{project.edicusProjectId}" 
							bind:checked={checkboxChecked}
						/>
						<label
							for="selectAll-{project.edicusProjectId}"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2 cursor-pointer"
						>
							전체 선택
						</label>
					</div>
					<!-- <div>
						<Button variant="outline" onclick={handleSelectPartial}>
							일부만 선택
						</Button>
					</div> -->
				</div>
			</div>
		</div>
	</div>

	<div class="h-[1px] bg-gray-200 my-2"></div>
	
	{#if project.tnUrls && project.tnUrls.length > 0}
		<div class='flex gap-2 mt-2 overflow-x-auto p-4'>
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
								'relative cursor-pointer border-2 rounded-md transition-all duration-200 hover:scale-105 p-0 bg-transparent',
								isThumbnailSelected(index) 
									? 'border-blue-500 bg-blue-50 shadow-md' 
									: 'border-gray-200 hover:border-gray-400'
							)}
							onclick={() => handleThumbnailClick(index)}
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
									handleViewThumbnail(tnUrl, index);
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
</div>

<!-- 썸네일 미리보기 팝업 -->
<ThumbnailPopup 
	isOpen={isPopupOpen}
	imageUrl={popupImageUrl}
	title={project.title}
	pageNumber={popupPageNumber}
	onClose={closePopup}
/>
