<script lang="ts">
    import type { SimpleImage } from "./simple-image.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { setupDraggable } from "$lib/studio/widgets/common/draggable";
    import { setupResizable } from "$lib/studio/widgets/common/resizable";
    import { onMount } from "svelte";
    import { cmdSimpleImage } from "$lib/studio/command";
    import * as du from "$lib/studio/widgets/common/doc-util";
	import type { Context } from "$lib/studio/context.svelte";

    let element: HTMLElement;
    let { data, context }: { data: SimpleImage; context?: Context } = $props();

    let isActive = $derived(studioDoc.activeId === data.id);
    let parent = $derived(studioDoc.getParentByChildId(data.id));

    let currentProp = $derived(data.prop?.[context?.break || 'desktop']);

    onMount(() => {
        setupDraggableWidget();
        setupResizableWidget();
    });

    function setupDraggableWidget() {
        setupDraggable({
            id: data.id,
            element: element,
            getCurrentProp: () => currentProp,
            getParentSize: () => getParentSize(),
            updateCallback: (id, updatedProps) => {
                cmdSimpleImage.updateProp(id, updatedProps, context?.break || 'desktop');
            }
        });
    }

    function setupResizableWidget() {
        setupResizable({
            id: data.id,
            element: element,
            getCurrentProp: () => currentProp,
            getParentSize: () => getParentSize(),
            updateCallback: (id, updatedProps) => {
                cmdSimpleImage.updateProp(id, updatedProps, context?.break || 'desktop');
            },
			getBreakPoint: () => context?.break || 'desktop'
        });
    }

    function getParentSize() {
        const parentEl = studioDoc.getElement(data.parentId);
        if (parentEl === null) {
            console.error(`parentEl is null (id: ${data.parentId})`);
            return { width: 0, height: 0 };
        }
        return { width: du.getElementWidth(parentEl), height: du.getElementHeight(parentEl) };
    }

    function handleMoutdown(event: MouseEvent) {
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
        // currentProp을 BaseWidgetProp 타입으로 확장
        const extendedProp = {
            ...currentProp,
            right: 'auto',
            centerOffsetX: 0,
            bottom: 'auto',
            centerOffsetY: 0,
            horzAlign: 'left' as const,
            vertAlign: 'top' as const
        };
        let style = du.getBaseStyleOfLeafWidget(extendedProp, parent?.prop[context?.break || 'desktop'].layout || 'block');
        return style;
    }
</script>

<div 
    bind:this={element}
    class={getSimpleImageClasses(isActive)}
    style={getCurrentStyle()}
    onmousedown={(e) => handleMoutdown(e as MouseEvent)}
    role="button"
    tabindex="0"
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
                    class="max-w-full max-h-full object-contain rounded select-none"
                    onerror={handleImageError}
                    onload={handleImageLoad}
                />
            </div>
        {/if}
        <div class="text-center text-gray-700 font-medium text-xs mt-2 truncate w-full select-none">
            {data.name}
        </div>
    </div>
</div>
