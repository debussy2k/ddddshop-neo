<script lang="ts">
    import type { Section } from "./section-actions";
    import { SandboxWidget } from "$lib/studio/widgets/sandbox";
    import { cmdSection } from "$lib/studio/command";
    import { SimpleImageWidget } from "$lib/studio/widgets/simple-image";
    import type { Sandbox } from "$lib/studio/widgets/sandbox";
    import type { SimpleImage } from "$lib/studio/widgets/simple-image";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { HistoryMode } from "$lib/studio/history-manager";
    import { ResizeHandle } from "$lib/components/ui/resize-handle";
    import { toPixelValue } from "$lib/utils/drag-resize";

    let { section }: { section: Section } = $props();

    let sectionElement = $state<HTMLElement>();

    function handleClick() {
        studioDoc.activeId = section.id;
    }

	function  keydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}

    // 현재 섹션이 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === section.id);

    // Section의 child 위젯들 가져오기
    let childWidgets = $derived(() => {
        return section.children || [];
    });

</script>

<div 
    bind:this={sectionElement}
    class={`relative border-b border-blue-500 border-dotted cursor-pointer overflow-visible ${
        isActive 
            ? 'bg-blue-200 hover:bg-blue-300 border-solid' 
            : 'bg-red-100 hover:bg-red-200'
    }`}
    style:height={section.height}
    onclick={handleClick}
    role="button"
    tabindex="0"
    onkeydown={keydown}
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
    <ResizeHandle 
        targetElement={sectionElement}
        direction="vertical"
        detectionDirection="bottom"
        threshold={10}
        minSize={50}
        maxSize={800}
        onStart={(newHeight) => {
            studioDoc.historyManager.setBatchMode();
            cmdSection.updateSection(section.id, { height: toPixelValue(newHeight) });
        }}
        onResize={(newHeight) => {
            cmdSection.updateSection(section.id, { height: toPixelValue(newHeight) });
        }}
        onEnd={(newHeight) => {
            cmdSection.updateSection(section.id, { height: toPixelValue(newHeight) });
            studioDoc.historyManager.commitBatch();
            studioDoc.historyManager.setRecordMode();
        }}
    />
</div>
