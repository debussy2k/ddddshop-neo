<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { studioDoc } from '../studio-doc.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/stores';

	interface Props {
		class?: ClassValue;
	}

	let { class: className }: Props = $props();

	// 히스토리 정보를 반응적으로 가져오기
	let historyInfo = $derived(studioDoc.historyInfo);

	// docKey 정보 가져오기 (서버에서 전달받은 값 사용)
	let docKey = $derived($page.data.docKey);
	
	// 저장된 문서가 있는지 확인
	let hasSavedDoc = $state(false);
	
	// 브라우저 환경에서만 localStorage 확인
	$effect(() => {
		if (typeof window !== 'undefined' && docKey) {
			hasSavedDoc = studioDoc.hasSavedDocument(docKey);
		}
	});
	
	// 저장 버튼 클릭 핸들러
	function handleSave() {
		const success = studioDoc.saveToLocalStorage(docKey);
		if (success) {
			hasSavedDoc = true;
			// 사용자에게 피드백 제공 (선택사항)
			console.log(`문서가 ${docKey}에 저장되었습니다.`);
		} else {
			console.error('문서 저장에 실패했습니다.');
		}
	}
	
	// 불러오기 버튼 클릭 핸들러  
	function handleLoad() {
		const success = studioDoc.loadFromLocalStorage(docKey);
		if (success) {
			console.log(`문서가 ${docKey}에 불러와졌습니다.`);
		} else {
			console.error('문서 불러오기에 실패했습니다.');
		}
	}
</script>

<div class={cn('w-1/3 flex items-center gap-1 px-2', className || '')}>
	<div class="flex items-center gap-1">
		<Button 
			variant="ghost" 
			size="sm"
			class="h-6 w-6 p-0"
			onclick={studioDoc.undo}
			disabled={!studioDoc.historyInfo.canUndo}
			title="실행 취소 (Ctrl+Z)"
		>
			<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7H14C17.3137 7 20 9.68629 20 13C20 16.3137 17.3137 19 14 19H4M4 7L8 3M4 7L8 11" stroke="currentColor" stroke-width="1.2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"></path></svg>
		</Button>
		
		<Button 
			variant="ghost" 
			size="sm"
			class="h-6 w-6 p-0"
			onclick={studioDoc.redo}
			disabled={!historyInfo.canRedo}
			title="다시 실행 (Ctrl+Y)"
		>
			<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 7H10C6.68629 7 4 9.68629 4 13C4 16.3137 6.68629 19 10 19H20M20 7L16 3M20 7L16 11" stroke="currentColor" stroke-width="1.2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"></path></svg>
		</Button>

		<!-- 히스토리 정보 표시 (선택사항) -->
		<div class="text-xs text-gray-500 ml-2">
			{historyInfo.pastCount}/{historyInfo.pastCount + historyInfo.futureCount}/{historyInfo.currentMode}
		</div>        
	</div>
	
	<!-- 구분선 -->
	<div class="w-px h-4 bg-gray-300 mx-1"></div>
	
	<!-- 저장/불러오기 버튼 그룹 -->
	<div class="flex items-center gap-1">
		<Button 
			variant="ghost" 
			size="sm"
			class="h-6 px-2 text-xs"
			onclick={handleSave}
			title="문서 저장 (Ctrl+S)"
		>
			<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-1">
				<path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16L21 8V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M17 21V13H7V21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M7 3V8H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			저장
		</Button>
		
		<Button 
			variant="ghost" 
			size="sm"
			class="h-6 px-2 text-xs"
			onclick={handleLoad}
			disabled={!hasSavedDoc}
			title="문서 불러오기 (Ctrl+O)"
		>
			<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-1">
				<path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M14 2V8H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M16 13H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M16 17H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M10 9H9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			불러오기
		</Button>
	</div>
</div>