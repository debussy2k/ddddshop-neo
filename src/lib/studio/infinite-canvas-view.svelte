<script lang="ts">
    import { onMount } from "svelte";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import PageWidget from "./widgets/section/page-widget.svelte";
	import { Context } from "./context.svelte";

    let doc = $derived(studioDoc.document);
	let desktopContext = new Context('desktop');
	let tabletContext = new Context('tablet');
	let mobileContext = new Context('mobile');

    onMount(() => {
    });
</script>

<div class="flex-1 relative bg-gray-100" style="box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.15);">
    <div class='absolute inset-0 overflow-y-scroll' >
        <PageWidget doc={doc} context={desktopContext} />
        <PageWidget doc={doc} context={tabletContext} />
        <PageWidget doc={doc} context={mobileContext} />
    </div>
</div>