<script lang="ts">
    import type { SimpleImage } from "./simple-image-actions";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";

    let { simpleImage }: { simpleImage: SimpleImage } = $props();

    function handleClick(event: MouseEvent) {
        studioDoc.activeId = simpleImage.id;
        // 이벤트 버블링 방지
        event.stopPropagation();
    }

    // 현재 이미지가 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === simpleImage.id);

    // 이미지 로드 오류 상태
    let imageError = $state(false);
    
    // 이미지 URL이 변경될 때마다 에러 상태 초기화
    $effect(() => {
        imageError = false;
    });

    function handleImageError() {
        imageError = true;
    }

    function handleImageLoad() {
        imageError = false;
    }
</script>

<div 
    class={`border border-blue-400 rounded-lg p-2 cursor-pointer min-w-[200px] min-h-[120px] ${
        isActive 
            ? 'bg-blue-100 hover:bg-blue-200 border-blue-600' 
            : 'bg-blue-50 hover:bg-blue-100'
    }`}
    onclick={(e) => handleClick(e as MouseEvent)}
    role="button"
    tabindex="0"
    onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as any);
        }
    }}
>
    <div class="flex flex-col items-center">
        {#if !simpleImage.url || simpleImage.url.trim() === ''}
            <div class="flex flex-col items-center justify-center text-gray-400 p-4">
                <svg class="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm font-medium">이미지 없음</span>
                <!-- <span class="text-xs">URL을 입력하세요</span> -->
            </div>
        {:else if imageError}
            <div class="flex flex-col items-center justify-center text-gray-500 p-4">
                <svg class="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs">이미지 로드 실패</span>
            </div>
        {:else}
            <!-- {#key simpleImage.url} -->
                <img 
                    src={simpleImage.url} 
                    alt={simpleImage.alt || '이미지'}
                    class="max-w-full max-h-full object-contain rounded"
                    style="width: {simpleImage.width || '100%'}; height: {simpleImage.height || 'auto'};"
                    onerror={handleImageError}
                    onload={handleImageLoad}
                />
            <!-- {/key} -->
        {/if}
        <div class="text-center text-gray-700 font-medium text-xs mt-2 truncate w-full">
            {simpleImage.name}
        </div>
    </div>
</div>
