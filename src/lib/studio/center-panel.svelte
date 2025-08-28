<script lang="ts">
    import { onMount } from "svelte";
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { studioDoc } from "./studio-doc.svelte";
    import { JsonView } from "@zerodevx/svelte-json-view";
    import SectionWidget from "./widgets/section-widget.svelte";

	interface Props {
		class?: ClassValue;
	}

	let { class: className }: Props = $props(); 

    let doc = $derived(studioDoc.document);

    onMount(() => {
    });
</script>

<div class={cn('bg-gray-50', className || '')}>
	<!-- Workspace 내용이 여기에 들어갑니다 -->

    {#each doc.sections as section}
        <SectionWidget section={section} />
    {/each}


    <div class="text-xs">
        <JsonView json={doc} />
    </div>

</div>
