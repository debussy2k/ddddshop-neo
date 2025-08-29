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

    onMount(() => {
    });
</script>

<div class={cn('relative bg-gray-50', className || '')}>
    <div class='absolute bg-white border border-gray-300 inset-2 overflow-y-auto'>
        {#each doc.sections as section}
            <SectionWidget section={section} />
        {/each}
    
    
        <div class="text-xs">
            <JsonView json={doc} />
        </div>
    </div>
</div>
