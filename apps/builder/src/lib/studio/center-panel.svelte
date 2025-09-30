<script lang="ts">
    import { onMount } from "svelte";
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { studioDoc } from "./studio-doc.svelte";
    import { JsonView } from "@zerodevx/svelte-json-view";
    import SectionWidget from "./widgets/section/section-widget.svelte";
    import { ResizableDiv } from "$lib/components/ui/resizable-div";
    import { getScreenInfo, type BreakPoint } from "$lib/config/screen-info.config";
    import { bpm } from "./breakpoint-man.svelte";
    import { canvasManager } from "./canvas-manager.svelte"; // 추가

	interface Props {
		class?: ClassValue;
	}

	let { class: className }: Props = $props(); 

    let doc = $derived(studioDoc.document);
    let currentResizableWidth = $state(300);
    let currentActiveItem = $derived(studioDoc.activeItem);
    
    let screenInfo = $derived(getScreenInfo(bpm.current as BreakPoint));

    onMount(() => {
    });

    function handleWidthChange(newWidth: number) {
        currentResizableWidth = newWidth;
        canvasManager.updateWidth(newWidth); // 스토어 업데이트 추가
        // console.log('Resizable width changed to:', newWidth);
    }

</script>

<div class={cn('relative bg-gray-100', className || '')} style="box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.15);">
    <div class='absolute inset-0 overflow-y-scroll flex justify-center' >
        <div class='canvas @container absolute shadow-lg shadow-gray-400 mt-4 ' style="width:{currentResizableWidth}px;">
            {#each doc.sections as section (section.id)}
                <SectionWidget data={section} 
                    bind:this={studioDoc.widgetMap[section.id]}
                />
            {/each}
            <!-- <div class="text-xs pt-4 border-t border-gray-200">
                <JsonView json={currentActiveItem} />
            </div> -->
        </div>

        <div class='sticky top-0 h-full inset-0 flex justify-center pointer-events-none '>
            <ResizableDiv 
				class='h-full'
                initialWidth={screenInfo.initialWidth} 
                minWidth={screenInfo.minWidth} 
                maxWidth={screenInfo.maxWidth}
                doubleResize={true}
                onWidthChange={handleWidthChange}
                snapTo={screenInfo.snapTo}
            >
                {#snippet children()}
                    <!-- 빈 스니펫 - 리사이즈 핸들만 사용 -->
                {/snippet}
            </ResizableDiv>
        </div>            
    </div>
</div>

<style>

/* 캔버스 아래에 shadow가 잘리지 않도록 빈 공간 마련*/
.canvas::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -16px;        /* 원래 박스 바깥으로 밀어냄 */
    height: 16px;         /* 추가 높이 */
}    
</style>