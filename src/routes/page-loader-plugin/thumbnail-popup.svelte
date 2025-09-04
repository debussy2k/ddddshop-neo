<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { onMount } from "svelte";

	interface Props {
		class?: ClassValue;
		isOpen: boolean;
		imageUrl: string;
		title: string;
		pageNumber: number;
		onClose: () => void;
	}

	let { class: className, isOpen, imageUrl, title, pageNumber, onClose }: Props = $props();

	let dialogElement: HTMLDialogElement;

	// ESC 키 이벤트 핸들러
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
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
	<div class="bg-white rounded-lg p-6 w-auto h-auto max-w-[90vw] max-h-[90vh] overflow-hidden shadow-2xl mx-4 my-4">
		<!-- 헤더 -->
		<div class="flex justify-between items-start mb-4">
			<div>
				<h3 class="text-lg font-semibold text-gray-900">{title}</h3>
				<p class="text-sm text-gray-600">페이지 {pageNumber}</p>
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
		<div class="flex justify-center items-center bg-gray-50 rounded-lg p-4">
			<img 
				src={imageUrl} 
				alt={`${title} - 페이지 ${pageNumber}`}
				class="max-w-[480px] max-h-[480px] w-auto h-auto object-contain rounded-md shadow-sm"
				style="max-width: min(480px, 70vw); max-height: min(480px, 60vh);"
			/>
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
</style>
