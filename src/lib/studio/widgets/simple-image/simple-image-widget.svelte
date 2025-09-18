<script lang="ts">
    import type { SimpleImage } from "./simple-image.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
    import { wui } from "$lib/studio/widgets/common/wui";
    import { onMount } from "svelte";
    import { cmdSimpleImage } from "$lib/studio/command";
    import { du } from "$lib/studio/widgets/common/doc-util";

    let element: HTMLElement;
    let { data: data }: { data: SimpleImage } = $props();

    let isActive = $derived(studioDoc.activeId === data.id);
    let parent = $derived(studioDoc.getParentById(data.id));

    let currentProp = $derived(data.prop?.[bpm.current]);

    onMount(() => {
        setupDraggable();
        setupResizable();
    });

    function setupDraggable() {
        wui.setupDraggable({
            id: data.id,
            element: element,
            getCurrentProp: () => currentProp,
            updateCallback: (id, position) => {
                console.log('position', position);
                cmdSimpleImage.updateSimpleImageProp(id, position, bpm.current);
            }
        });
    }

    function setupResizable() {
        wui.setupResizable({
            id: data.id,
            element: element,
            getCurrentProp: () => currentProp,
            updateCallback: (id, dimensions) => {
                cmdSimpleImage.updateSimpleImageProp(id, dimensions, bpm.current);
            }
        });
    }

    function handleClick(event: MouseEvent) {
        studioDoc.activeId = data.id;
        // 이벤트 버블링 방지
        event.stopPropagation();
    }

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

    function getSimpleImageClasses(isActive: boolean): string {
        const baseClasses = `border border-blue-400 rounded-lg p-2 cursor-pointer min-w-[200px] min-h-[120px]`;
        const activeClasses = 'bg-blue-100 hover:bg-blue-200 border-blue-600';
        const inactiveClasses = 'bg-blue-50 hover:bg-blue-100';

        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    }

    function getCurrentStyle() {
        let style = du.getBaseStyleOfLeafWidget(currentProp, parent?.prop[bpm.current].layout || 'block');
        return style;
    }
</script>

<div 
    bind:this={element}
    class={getSimpleImageClasses(isActive)}
    style={getCurrentStyle()}
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
    <div class="flex flex-col items-center h-full">
        {#if !data.url || data.url.trim() === ''}
            <div class="flex flex-col items-center justify-center text-gray-400 p-4 flex-1">
                <svg class="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm font-medium">이미지 없음</span>
                <!-- <span class="text-xs">URL을 입력하세요</span> -->
            </div>
        {:else if imageError}
            <div class="flex flex-col items-center justify-center text-gray-500 p-4 flex-1">
                <svg class="w-8 h-8 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs">이미지 로드 실패</span>
            </div>
        {:else}
            <div class="flex-1 flex items-center justify-center w-full">
                <img 
                    src={data.url} 
                    alt={data.alt || '이미지'}
                    class="max-w-full max-h-full object-contain rounded user-select-none"
                    onerror={handleImageError}
                    onload={handleImageLoad}
                />
            </div>
        {/if}
        <div class="text-center text-gray-700 font-medium text-xs mt-2 truncate w-full user-select-none">
            {data.name}
        </div>
    </div>
</div>
