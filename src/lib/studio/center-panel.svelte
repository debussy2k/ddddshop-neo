<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { studioDoc } from "./studio-doc.svelte";
    import { onMount } from "svelte";

    import { JsonView } from "@zerodevx/svelte-json-view";

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
        <div class='border-b border-blue-500 border-dotted'>{section.name}</div>
    {/each}

    <JsonView json={doc} />

</div>
