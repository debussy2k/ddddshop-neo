<script lang="ts">
    import { onMount } from "svelte";
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { studioDoc } from "./studio-doc.svelte";
    import { JsonView } from "@zerodevx/svelte-json-view";
    import SectionWidget from "./widgets/section/section-widget.svelte";
    import { ResizableDiv } from "$lib/components/ui/resizable-div";

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
        switch (studioDoc.breakPoint) {
            case 'mobile':
                return {
					initialWidth: 320,
					minWidth: 320,
					maxWidth: 767,
				};
            case 'tablet':
                return {
					initialWidth: 768,
					minWidth: 768,
					maxWidth: 991,
				};
            case 'desktop':
                return {
					initialWidth: 992,
					minWidth: 992,
					maxWidth: 2200,
				}
            default:
                return {
					initialWidth: 320,
					minWidth: 320,
					maxWidth: 767,
				}
        }
    });

    onMount(() => {
    });

    function handleWidthChange(newWidth: number) {
        currentResizableWidth = newWidth;
        console.log('Resizable width changed to:', newWidth);
    }

</script>

<div class={cn('relative bg-gray-50', className || '')}>
    <div class='absolute bg-white border border-gray-300 inset-2 overflow-y-scroll flex justify-center'>
        <div class='absolute top-[0px] bottom-[0px] pointer-events-none'>
            <ResizableDiv 
				class='h-full'
                initialWidth={screenInfo().initialWidth} 
                minWidth={screenInfo().minWidth} 
                maxWidth={screenInfo().maxWidth}
                doubleResize={true}
                onWidthChange={handleWidthChange}
            >
                {#snippet children()}
                    <div class="h-full flex items-center justify-center flex-col border border-gray-300 pointer-events-none">
                        <span class="text-lg font-semibold text-gray-700">
                            Resizable Content
                        </span>
                        <span class="text-sm text-gray-500 mt-2">
                            Width: {currentResizableWidth}px<br>
							Min: {screenInfo().minWidth}px
                        </span>
                    </div>
                {/snippet}
            </ResizableDiv>
        </div>        

        <div class='@container' style="width:{currentResizableWidth}px;">
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
