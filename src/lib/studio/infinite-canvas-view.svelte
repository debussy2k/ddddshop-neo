<script lang="ts">
    import { onMount } from "svelte";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import PageWidget from "./widgets/section/page-widget.svelte";
    import SectionWidget from "./widgets/section/section-widget.svelte";

    let doc = $derived(studioDoc.document);

    onMount(() => {
    });
</script>

<div class="flex-1 relative bg-gray-100" style="box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.15);">
    <div class='absolute inset-0 overflow-y-scroll' >
        <PageWidget doc={doc} />
    </div>
</div>