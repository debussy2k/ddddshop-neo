<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
    import { onMount } from 'svelte';
    import { studioDoc } from './studio-doc.svelte';
    import { cmdSection, /* cmdFrame, cmdSandbox, cmdSimpleImage, cmdShowcase */ } from './command';
    // import LayoutBrowser from './layout-browser.svelte';
    let { width }: { width: string } = $props();

    let style = `width: ${width}`;

    onMount(() => {
        console.log('LeftPanel mounted');
        addSection();
    });

    function addSection() {
        const { id } = cmdSection.add({});
        studioDoc.activeId = id;

        console.log("studioDoc.document", studioDoc.document)
    }

    // function addFrame() {
    //     if (studioDoc.activeId) {
    //         let parentId = studioDoc.getAddableParentId(studioDoc.activeId);
    //         const { id } = cmdFrame.add({
    //             parentId: parentId,
    //         });
    //         studioDoc.activeId = id;
    //     }
    // }

    // function addSandbox() {
    //     if (studioDoc.activeId) {
    //         let parentId = studioDoc.getAddableParentId(studioDoc.activeId);
    //         const { id } = cmdSandbox.add({
    //             parentId: parentId,
    //             text: 'Sandbox One',
    //         });
    //         studioDoc.activeId = id;
    //     }
    // }
</script>

<div class="bg-white text-sm h-full flex flex-col" style={style}>
    <div>
        생성
    </div>
    <div>
        <Button variant="outline" onclick={addSection}>Section</Button>
        <!-- <Button variant="outline" onclick={addFrame}>Frame</Button> -->
        <!-- <Button variant="outline" onclick={addSandbox}>Sandbox</Button> -->
    </div>

    <div class='p-2 mt-4'>
        레이아웃
    </div>
    <!-- <LayoutBrowser /> -->
</div>