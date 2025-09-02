<script lang="ts">
    import { onMount } from "svelte";
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { studioDoc } from "./studio-doc.svelte";
    import { JsonView } from "@zerodevx/svelte-json-view";
    import SectionWidget from "./widgets/section/section-widget.svelte";

	interface Props {
		class?: ClassValue;
	}

	let { class: className }: Props = $props(); 

    let doc = $derived(studioDoc.document);
    
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
</script>

<div class={cn('relative bg-gray-50', className || '')}>
    <div class='absolute bg-white border border-gray-300 inset-2 overflow-y-scroll flex justify-center'>
        
        <div class={containerWidth()}>
            <div>
                {studioDoc.breakPoint} / {containerWidth()}
            </div>
            {#each doc.sections as section}
                <SectionWidget section={section} />
            {/each}
        </div>
    
    
        <!-- <div class="text-xs">
            <JsonView json={doc} />
        </div> -->
    </div>
</div>
