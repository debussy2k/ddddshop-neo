<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { onMount } from "svelte";

	interface Props {
		class?: ClassValue;
		isOpen: boolean;
		imageUrls: string[];
		currentIndex: number;
		title: string;
		selectedThumbnails: number[];
		onClose: () => void;
		onIndexChange?: (newIndex: number) => void;
		onThumbnailToggle?: (index: number) => void;
	}

	let { class: className, isOpen, imageUrls, currentIndex, title, selectedThumbnails, onClose, onIndexChange, onThumbnailToggle }: Props = $props();

	// 현재 이미지 URL과 페이지 번호 계산
	let currentImageUrl = $derived(imageUrls[currentIndex] || '');
	let currentPageNumber = $derived(currentIndex + 1);
	
	// 현재 썸네일이 선택되어 있는지 확인
	let isCurrentThumbnailSelected = $derived(selectedThumbnails.includes(currentIndex));

	let dialogElement: HTMLDialogElement;

	// 키보드 이벤트 핸들러
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		} else if (event.key === 'ArrowLeft') {
			navigateToPrevious();
		} else if (event.key === 'ArrowRight') {
			navigateToNext();
		}
	}

	// 이전 썸네일로 이동
	function navigateToPrevious(event?: Event) {
		event?.preventDefault();
		if (currentIndex > 0 && onIndexChange) {
			onIndexChange(currentIndex - 1);
		}
	}

	// 다음 썸네일로 이동
	function navigateToNext(event?: Event) {
		event?.preventDefault();
		if (currentIndex < imageUrls.length - 1 && onIndexChange) {
			onIndexChange(currentIndex + 1);
		}
	}

	// 현재 썸네일 선택/해제 토글
	function toggleCurrentThumbnail() {
		if (onThumbnailToggle) {
			onThumbnailToggle(currentIndex);
		}
	}

	// 팝업 외부 클릭 핸들러
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === dialogElement) {
			onClose();
		}
	}

	// 팝업 열기/닫기 상태 관리
	$effect(() => {
		if (isOpen) {
			dialogElement?.showModal();
			document.addEventListener('keydown', handleKeydown);
		} else {
			dialogElement?.close();
			document.removeEventListener('keydown', handleKeydown);
		}

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialogElement}
	class={cn('modal p-0', className || '')}
	onclick={handleBackdropClick}
>
	<div class="bg-white rounded-lg p-6 w-[570px] h-auto max-w-[90vw] max-h-[90vh] overflow-hidden shadow-2xl mx-4 my-4">
		<!-- 헤더 -->
		<div class="flex justify-between items-start mb-4">
			<div class="flex-1">
				<div class="flex items-center gap-2">
					<h3 class="text-lg font-semibold text-gray-900">{title}</h3>
					<button
						type="button"
						class={cn(
							"flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border",
							isCurrentThumbnailSelected 
								? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200" 
								: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
						)}
						onclick={toggleCurrentThumbnail}
						aria-label={isCurrentThumbnailSelected ? "선택 해제" : "선택"}
					>
						{#if isCurrentThumbnailSelected}
							<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
							선택됨
						{:else}
							<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
							</svg>
							선택하기
						{/if}
					</button>
				</div>
				<p class="text-sm text-gray-600 mt-1">페이지 {currentPageNumber} / {imageUrls.length}</p>
			</div>
			<button
				type="button"
				class="text-gray-400 hover:text-gray-600 transition-colors"
				onclick={onClose}
				aria-label="닫기"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
				</svg>
			</button>
		</div>

		<!-- 이미지 -->
		<div class="relative flex justify-center items-center bg-gray-50 rounded-lg p-4">
			<!-- 이전 버튼 -->
			{#if currentIndex > 0}
				<button
					type="button"
					class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10 select-none"
					onclick={(e) => navigateToPrevious(e)}
					onmousedown={(e) => e.preventDefault()}
					aria-label="이전 이미지"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
					</svg>
				</button>
			{/if}

			<div class="relative">
				<img 
					src={currentImageUrl} 
					alt={`${title} - 페이지 {currentPageNumber}`}
					class="max-w-[480px] max-h-[480px] w-auto h-auto object-contain rounded-md shadow-sm"
					style="max-width: min(480px, 70vw); max-height: min(480px, 60vh);"
				/>
				<button
					type="button"
					class={cn(
						"absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-all duration-200 border-2",
						isCurrentThumbnailSelected 
							? "bg-blue-500 text-white border-blue-600 hover:bg-blue-600" 
							: "bg-white text-gray-400 border-gray-300 hover:bg-gray-50 hover:text-gray-600"
					)}
					onclick={toggleCurrentThumbnail}
					aria-label={isCurrentThumbnailSelected ? "선택 해제" : "선택"}
				>
					{#if isCurrentThumbnailSelected}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
						</svg>
					{:else}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
						</svg>
					{/if}
				</button>
			</div>

			<!-- 다음 버튼 -->
			{#if currentIndex < imageUrls.length - 1}
				<button
					type="button"
					class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10 select-none"
					onclick={(e) => navigateToNext(e)}
					onmousedown={(e) => e.preventDefault()}
					aria-label="다음 이미지"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
					</svg>
				</button>
			{/if}
		</div>

		<!-- 푸터 -->
		<div class="flex justify-center mt-4 pt-4 border-t border-gray-200">
			<button
				type="button"
				class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
				onclick={onClose}
			>
				닫기
			</button>
		</div>
	</div>
</dialog>

<style>
	dialog {
		border: none;
		outline: none;
		padding: 0;
		margin: 0;
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: transparent;
		overflow: hidden;
	}
	
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}
	
	dialog[open] {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	/* 브라우저별 스크롤바 숨김 */
	dialog::-webkit-scrollbar {
		display: none;
	}
	
	dialog {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	/* 텍스트 선택 방지 */
	.select-none {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-touch-callout: none;
		-webkit-tap-highlight-color: transparent;
	}

	/* 버튼 요소 전체에 텍스트 선택 방지 */
	button {
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>
