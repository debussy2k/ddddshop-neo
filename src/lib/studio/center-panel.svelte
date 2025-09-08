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

    onMount(() => {
    });

    function handleWidthChange(newWidth: number) {
        currentResizableWidth = newWidth;
        console.log('Resizable width changed to:', newWidth);
    }

</script>

<div class={cn('relative bg-gray-50', className || '')}>
    <div class='absolute bg-white border border-gray-300 inset-2 overflow-y-scroll flex justify-center'>
        <div>
            {studioDoc.breakPoint} / {containerWidth()}
        </div>

        <div class='@container {containerWidth()}'>
            {#each doc.sections as section (section.id)}
                <SectionWidget section={section} 
					bind:this={studioDoc.widgetMap[section.id]}
				/>
            {/each}
        </div>
    
        <div class='absolute top-[50px]'>
            <ResizableDiv 
                initialWidth={300} 
                minWidth={150} 
                maxWidth={600}
                doubleResize={true}
                onWidthChange={handleWidthChange}
            >
                {#snippet children()}
                    <div class="h-full flex items-center justify-center flex-col">
                        <span class="text-lg font-semibold text-gray-700">
                            Resizable Content
                        </span>
                        <span class="text-sm text-gray-500 mt-2">
                            Width: {currentResizableWidth}px
                        </span>
                    </div>
                {/snippet}
            </ResizableDiv>
        </div>

		<!-- <div class="text-xs">
			<JsonView json={doc} />
		</div> -->
    </div>
</div>
