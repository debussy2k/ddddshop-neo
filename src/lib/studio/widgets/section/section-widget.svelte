<script lang="ts">
    import type { Section } from "./section-actions";
    import { SandboxWidget } from "$lib/studio/widgets/sandbox";
    import { cmdSection } from "$lib/studio/command";
    import { SimpleImageWidget } from "$lib/studio/widgets/simple-image";
    import type { Sandbox } from "$lib/studio/widgets/sandbox";
    import type { SimpleImage } from "$lib/studio/widgets/simple-image";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { setupMouseDetection, setupDragResize, parsePixelValue, toPixelValue } from "$lib/utils/drag-resize";
    import { onMount } from "svelte";

    let { section }: { section: Section } = $props();

    let sectionElement: HTMLElement;
    let resizeHandle = $state<HTMLElement>();
    let showResizeHandle = $state(false);
    let isDragging = $state(false);

    function handleClick() {
        studioDoc.activeId = section.id;
    }

    // 현재 섹션이 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === section.id);

    // Section의 child 위젯들 가져오기
    let childWidgets = $derived(() => {
        return section.children || [];
    });

    // 드래그 리사이즈 클린업 함수
    let cleanupDragResize: (() => void) | null = null;

    onMount(() => {
        // 마우스 감지 설정
        const cleanupMouseDetection = setupMouseDetection({
            element: sectionElement,
            threshold: 10,
            direction: 'bottom',
            onEnter: () => {
                showResizeHandle = true;
            },
            onLeave: () => {
                // 드래그 중이 아닐 때만 핸들 숨김
                if (!isDragging) {
                    showResizeHandle = false;
                }
            }
        });

        return () => {
            cleanupMouseDetection();
            cleanupDragResize?.();
        };
    });

    // resizeHandle이 생성되면 드래그 기능 설정
    $effect(() => {
        if (resizeHandle) {
            // 기존 리스너 정리
            cleanupDragResize?.();
            
            cleanupDragResize = setupDragResize({
                element: sectionElement,
                handle: resizeHandle,
                direction: 'vertical',
                minSize: 50,
                maxSize: 800,
                onStart: () => {
                    isDragging = true;
                },
                onResize: (newHeight) => {
                    console.log('newHeight', newHeight);
                    // section.height = toPixelValue(newHeight);
                    cmdSection.updateSection(section.id, { height: toPixelValue(newHeight) });
                },
                onEnd: () => {
                    isDragging = false;
                }
            });
        } else {
            // resizeHandle이 없으면 클린업
            cleanupDragResize?.();
            cleanupDragResize = null;
        }
    });
</script>

<div 
    bind:this={sectionElement}
    class={`relative border-b border-blue-500 border-dotted cursor-pointer ${
        isActive 
            ? 'bg-blue-200 hover:bg-blue-300 border-solid' 
            : 'bg-red-100 hover:bg-red-200'
    }`}
    style:height={section.height}
    onclick={handleClick}
    role="button"
    tabindex="0"
    onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    }}
>
    <div class="p-2">
        <!-- Child 위젯들 렌더링 -->
        {#if childWidgets().length > 0}
            <div class="flex gap-x-2 w-full flex-wrap">
                {#each childWidgets() as widgetData (widgetData.id)}
                    {#if (widgetData as any).type === 'sandbox'}
                        <SandboxWidget data={widgetData as Sandbox} />
                    {:else if (widgetData as any).type === 'simple-image'}
                        {#key widgetData.id + (widgetData as SimpleImage).url}
                            <SimpleImageWidget simpleImage={widgetData as SimpleImage} />
                        {/key}
                    {/if}
                {/each}
            </div>
        {/if}
    </div>

    <!-- 리사이즈 핸들 -->
    {#if showResizeHandle || isDragging}
        <div 
            bind:this={resizeHandle}
            class="absolute bottom-0 left-1/6 w-2/3 h-1 bg-blue-600 cursor-ns-resize flex items-center justify-center group z-50"
            style="transform: translateY(50%);"
        >
            <!-- 리사이즈 아이콘 -->
            <div class="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 opacity-80 group-hover:opacity-100">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <!-- 상하 화살표 아이콘 -->
                    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                </svg>
                <span>크기조절</span>
            </div>
        </div>
    {/if}
</div>
