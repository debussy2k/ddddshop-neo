<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
    import { onMount } from 'svelte';
    import { studioDoc } from './studio-doc.svelte';
    import { cmdSection } from './command';
    import { cmdSandbox } from './command';
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

    function addSandbox() {
        if (studioDoc.activeId) {
            cmdSandbox.addSandbox({
                parentId: studioDoc.activeId,
                text: 'Sandbox One'
            });
        }
    }
</script>

<div class="bg-white text-sm h-full flex flex-col" style={style}>
    <div>
        <Button variant="outline" onclick={addSampleSection}>Add Section</Button>
        <Button variant="outline" onclick={addSandbox}>Add Sandbox</Button>
    </div>

    <div class='p-2 mt-4'>
        레이아웃
    </div>
    <LayoutBrowser />
</div>