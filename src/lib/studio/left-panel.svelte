<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
    import { onMount } from 'svelte';
    import { cmdSection } from './command';
    import LayoutBrowser from './layout-browser.svelte';

    let { width }: { width: string } = $props();

    let style = `width: ${width}`;

    onMount(() => {
        console.log('LeftPanel mounted');
        addSampleSection();
    });

    function addSampleSection() {
        cmdSection.addSection({
            height: '160px'
        });
    }
</script>

<div class="bg-white text-sm h-full flex flex-col" style={style}>
    <Button variant="outline" onclick={addSampleSection}>Add Section</Button>

    <div class='p-2 mt-4'>
        레이아웃
    </div>
    <LayoutBrowser />
</div>