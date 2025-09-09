<script lang="ts">
    import { onMount } from "svelte";
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { studioDoc } from "./studio-doc.svelte";
    import { JsonView } from "@zerodevx/svelte-json-view";
    import SectionWidget from "./widgets/section/section-widget.svelte";
    import { ResizableDiv } from "$lib/components/ui/resizable-div";
    import { getScreenInfo, type BreakPoint } from "$lib/config/screen-info.config";

	interface Props {
		class?: ClassValue;
	}

	let { class: className }: Props = $props(); 

    let doc = $derived(studioDoc.document);
    let currentResizableWidth = $state(300);
    
    // breakpoint에 따른 width 계산
    let containerWidth = $derived(() => {
        switch (studioDoc.breakPoint) {
            case 'mobile':
                return 'w-[375px]';
            case 'tablet':
                return 'w-[768px]';
            case 'desktop':
                return 'w-[1200px]';
            default:
                return 'w-[1200px]';
        }
    });

	let screenInfo = $derived(() => {
        return getScreenInfo(studioDoc.breakPoint as BreakPoint);
    });

    onMount(() => {
    });

    function handleWidthChange(newWidth: number) {
        currentResizableWidth = newWidth;
        // console.log('Resizable width changed to:', newWidth);
    }

</script>

<div class={cn('relative bg-gray-50', className || '')}>
    <div class='absolute bg-gray-200 border border-gray-300 inset-2 overflow-y-scroll flex justify-center'>
        <div class='absolute top-[0px] bottom-[0px] pointer-events-none'>
            <ResizableDiv 
				class='h-full'
                initialWidth={screenInfo().initialWidth} 
                minWidth={screenInfo().minWidth} 
                maxWidth={screenInfo().maxWidth}
                doubleResize={true}
                onWidthChange={handleWidthChange}
                snapTo={screenInfo().snapTo}
            >
                {#snippet children()}
                    <!-- 빈 스니펫 - 리사이즈 핸들만 사용 -->
                {/snippet}
            </ResizableDiv>
        </div>        

        <div class='@container shadow-lg shadow-gray-400' style="width:{currentResizableWidth}px;">
            {#each doc.sections as section (section.id)}
                <SectionWidget section={section} 
					bind:this={studioDoc.widgetMap[section.id]}
				/>
            {/each}
			<!-- <div class="text-xs">
				<JsonView json={doc} />
			</div> -->
        </div>

    </div>
</div>
