<script lang="ts">
    import type { Section } from "../actions/section-actions";
    let { section }: { section: Section } = $props();

</script>

<div class='border-b border-blue-500 border-dotted'>{section.name}</div>
