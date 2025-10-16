<script lang="ts">
    import type { DocState } from "../../types";
    import SectionWidget from "./section-widget.svelte";

    let { doc }: { doc: DocState } = $props();

</script>


<!-- desktop -->
<div class='page @container absolute shadow-lg shadow-gray-400 mt-4 ' style="width:992px;"
>
    {#each doc.sections as section (section.id)}
        <SectionWidget data={section} />
    {/each}
</div>

<!-- mobile -->
<div class='page @container absolute shadow-lg shadow-gray-400 mt-4 ' style="left:1024px; width:480px;">
    {#each doc.sections as section (section.id)}
        <SectionWidget data={section} />
    {/each}
</div>
