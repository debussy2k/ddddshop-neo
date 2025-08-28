<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
    import { onMount } from 'svelte';
    import { studioDoc } from './studio-doc.svelte';
    import { cmdSection } from './command';

    let { width }: { width: string } = $props();

    let style = `width: ${width}`;

    onMount(() => {
        console.log('LeftPanel mounted');
        cmdSection.addSampleSection();

    });

    function addSampleSection() {
        cmdSection.addSampleSection();
    }
</script>

<div class="bg-gray-100" style={style}>
    <Button variant="outline" onclick={addSampleSection}>Add Section</Button>
</div>