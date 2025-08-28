<script lang="ts">
    import { studioDoc } from './studio-doc.svelte';
    import Button from '$lib/components/ui/button/button.svelte';

    // 히스토리 정보를 반응적으로 가져오기
    let historyInfo = $derived(studioDoc.historyInfo);
</script>

<div class="w-full h-8 bg-gray-100 border-b border-gray-200 flex items-center px-2 gap-1">
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
    </div>
    
    <!-- 히스토리 정보 표시 (선택사항) -->
    <div class="text-xs text-gray-500 ml-2">
        {historyInfo.pastCount}/{historyInfo.pastCount + historyInfo.futureCount}
    </div>
</div>