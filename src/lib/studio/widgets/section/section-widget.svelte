<script lang="ts">
    import type { Section } from "./section-actions";
    import { SandboxWidget } from "$lib/studio/widgets/sandbox";
    import { SimpleImageWidget } from "$lib/studio/widgets/simple-image";
    import type { Sandbox } from "$lib/studio/widgets/sandbox";
    import type { SimpleImage } from "$lib/studio/widgets/simple-image";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";


    let { section }: { section: Section } = $props();

    function handleClick() {
        studioDoc.activeId = section.id;
    }

    // 현재 섹션이 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === section.id);

    // Section의 child 위젯들 가져오기
    let childWidgets = $derived(() => {
        return section.children || [];
    });
</script>

<div 
    class={`border-b border-blue-500 border-dotted cursor-pointer ${
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
        <div class="font-medium mb-2">{section.name}</div>
        
        <!-- Child 위젯들 렌더링 -->
        {#if childWidgets().length > 0}
            <div class="space-y-2 flex gap-2 w-full flex-wrap">
                {#each childWidgets() as widgetData (widgetData.id)}
                    {#if (widgetData as any).type === 'sandbox'}
                        <SandboxWidget data={widgetData as Sandbox} />
                    {:else if (widgetData as any).type === 'simple-image'}
                        <SimpleImageWidget simpleImage={widgetData as SimpleImage} />
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
</div>
