<script lang="ts">
    import { onMount } from "svelte";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import SectionWidget from "./widgets/section/section-widget.svelte";

    let doc = $derived(studioDoc.document);

    onMount(() => {
    });
</script>

<div class="flex-1 relative bg-gray-100" style="box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.15);">
    <div class='absolute inset-0 overflow-y-scroll' >
        <!-- desktop -->
        <div class='page @container absolute shadow-lg shadow-gray-400 mt-4 ' style="width:992px;">
            {#each doc.sections as section (section.id)}
                <SectionWidget data={section} />
            {/each}
            <!-- <div class="text-xs pt-4 border-t border-gray-200">
                <JsonView json={currentActiveItem} />
            </div> -->
        </div>

        <!-- mobile -->
        <div class='page @container absolute shadow-lg shadow-gray-400 mt-4 ' style="left:1024px; width:480px;">
            {#each doc.sections as section (section.id)}
                <SectionWidget data={section} />
            {/each}
            <!-- <div class="text-xs pt-4 border-t border-gray-200">
                <JsonView json={currentActiveItem} />
            </div> -->
        </div>

    </div>
</div>