<script lang="ts">
    import type { Section } from "./section-actions";
    let { section }: { section: Section } = $props();

</script>

<div class='border-b border-blue-500 border-dotted bg-red-100' style:height={section.height}>
    {section.name}
</div>
