<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
    import { onMount } from 'svelte';
    import { cmdSection } from './command';
    import LayoutBrowser from './layout-browser.svelte';

    let { width }: { width: string } = $props();

    let style = `width: ${width}`;

    onMount(() => {
        console.log('LeftPanel mounted');
        cmdSection.addSection({
            name: 'Section 1',
            type: 'content',
            height: 'auto'
        });

    });

    function addSampleSection() {
        cmdSection.addSection({
            name: 'Section 1',
            type: 'content',
            height: '48px'
        });
    }
</script>

<div class="bg-gray-100" style={style}>
    <Button variant="outline" onclick={addSampleSection}>Add Section</Button>

    <LayoutBrowser />
</div>