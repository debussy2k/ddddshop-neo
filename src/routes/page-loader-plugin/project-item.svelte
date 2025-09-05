<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import ThumbnailPopup from "./thumbnail-popup.svelte";
	import TnList from "./tn-list.svelte";
	import { pluginStore } from "./plugin.store.svelte";
	import { isInnerPageSize } from "./util";

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
	let popupCurrentIndex = $state(0);
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
		// 내지 사이즈가 일치하지 않으면 선택 불가
		if (!isInnerPageSize(project.edicusPsCode)) {
			return;
		}
		
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
		// 내지 사이즈가 일치하지 않으면 선택 불가
		if (!isInnerPageSize(project.edicusPsCode)) {
			return;
		}
		
		if (onThumbnailSelect) {
			onThumbnailSelect(project.edicusProjectId, index);
		}
	}


	function handleViewThumbnail(index: number) {
		popupCurrentIndex = index;
		isPopupOpen = true;
	}

	function closePopup() {
		isPopupOpen = false;
		popupCurrentIndex = 0;
	}

	function handleIndexChange(newIndex: number) {
		popupCurrentIndex = newIndex;
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
		<div class="relative">
			<img 
				src={project.thumbnailUrl} 
				alt={project.title} 
				class='w-26 h-26 object-contain border border-gray-200' 
			/>
			{#if !isInnerPageSize(project.edicusPsCode)}
				<div class="absolute inset-0 flex items-center justify-center rounded bg-gray-500/70">
					<div class=" text-white text-xs font-bold text-center px-2 py-1 rounded">
						내지 사이즈가<br/>일치하지 않습니다
					</div>
				</div>
			{/if}
		</div>

		<!-- 상세정보 -->
		<div class='flex flex-1'>
			<!-- 왼쪽 상세정보 -->
			<div class='flex flex-col gap-1 flex-1'>
				<div class="text-lg font-bold">{project.title}</div>
				<div>
					초대 계정(ID): {project.childUserLoginId} | {project.childUserDisplayName} | 구분정보: {project.userMemo}
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
							disabled={!isInnerPageSize(project.edicusPsCode)}
						/>
						<label
							for="selectAll-{project.edicusProjectId}"
							class={cn(
								"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2",
								isInnerPageSize(project.edicusPsCode) ? "cursor-pointer" : "cursor-not-allowed opacity-50"
							)}
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
	
	<TnList 
		{project}
		selectedThumbnails={selectedThumbnails}
		hoveredThumbnailIndex={hoveredThumbnailIndex}
		onThumbnailClick={handleThumbnailClick}
		onThumbnailMouseEnter={handleThumbnailMouseEnter}
		onThumbnailMouseLeave={handleThumbnailMouseLeave}
		onViewThumbnail={handleViewThumbnail}
		isInnerPageSize={isInnerPageSize}
	/>
</div>

<!-- 썸네일 미리보기 팝업 -->
<ThumbnailPopup 
	isOpen={isPopupOpen}
	imageUrls={project.tnUrls || []}
	currentIndex={popupCurrentIndex}
	title={project.title}
	selectedThumbnails={selectedThumbnails}
	onClose={closePopup}
	onIndexChange={handleIndexChange}
	onThumbnailToggle={onThumbnailSelect ? (index) => onThumbnailSelect(project.edicusProjectId, index) : undefined}
	project={project}
	isInnerPageSize={isInnerPageSize}
/>
