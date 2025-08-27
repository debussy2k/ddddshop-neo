<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
    import { onMount } from 'svelte';
    import { studioDoc } from './doc.svelte';

    let { width }: { width: string } = $props();

    let style = `width: ${width}`;

    onMount(() => {
        console.log('LeftPanel mounted');
    });

    function addSampleSection() {
        studioDoc.addSampleSection();
    }
</script>

<div class="bg-gray-100" style={style}>
    <Button variant="outline" onclick={addSampleSection}>Add Section</Button>
</div>