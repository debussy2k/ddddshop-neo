<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { studioDoc } from "./doc.svelte";
    import { onMount } from "svelte";

	interface Props {
		class?: ClassValue;
	}

	let { class: className }: Props = $props(); 

    let doc = $derived(studioDoc.document);

    onMount(() => {
        studioDoc.setSample();
    });
</script>

<div class={cn('bg-gray-50', className || '')}>
	<!-- Workspace 내용이 여기에 들어갑니다 -->

    {#each doc.sections as section}
        <div>{section.name}</div>
    {/each}
</div>
