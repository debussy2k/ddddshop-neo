<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
    import { onMount } from 'svelte';
    import { studioDoc } from '../studio-doc.svelte';
    import { cmdSection, cmdFrame, cmdSandbox, cmdSimpleImage, cmdShowcase } from '../command';
    import LayoutBrowser from './layout-browser.svelte';

    onMount(() => {
        console.log('LeftPanel mounted');
        if (studioDoc.isEmpty()) {
            addSection();
        }
    });

    function addSection() {
        const { id } = cmdSection.add({});
        studioDoc.activeId = id;
    }

    function addFrame() {
        if (studioDoc.activeId) {
            let parentId = studioDoc.getAddableParentId(studioDoc.activeId);
            const { id } = cmdFrame.add({
                parentId: parentId,
            });
            studioDoc.activeId = id;
        }
    }

    function addSandbox() {
        if (studioDoc.activeId) {
            let parentId = studioDoc.getAddableParentId(studioDoc.activeId);
            const { id } = cmdSandbox.add({
                parentId: parentId,
                text: 'Sandbox One',
                componentId: ""
            });
            studioDoc.activeId = id;
        }
    }

	function addShowcase1() {
        if (studioDoc.activeId) {
            let parentId = studioDoc.getAddableParentId(studioDoc.activeId);
            const { id } = cmdSandbox.add({
                parentId: parentId,
                text: 'showcase1',
				componentId: "showcase1",
                compProp: {
                    desktop: {
                        columns: 6,
                    },
                    tablet: {},
                    mobile: {},
                }
            });
            studioDoc.activeId = id;
        }
	}

    function addSimpleImage() {
        if (studioDoc.activeId) {
            const { id } = cmdSimpleImage.add({
                parentId: studioDoc.activeId,
                url: '',
                prop: {
                    mobile: {
                        width: '160px',
                        height: '160px'
                    },
                    tablet: {
                        width: '160px',
                        height: '160px'
                    },
                    desktop: {
                        width: '160px',
                        height: '160px'
                    }
                }
            });
            studioDoc.activeId = id;
        }
    }

    function addShowcase() {
        if (studioDoc.activeId) {
            const { id } = cmdShowcase.add({
                parentId: studioDoc.activeId,
                showcaseCode: "for_teacher",
            });
            studioDoc.activeId = id;
        }
    }
</script>


<div class='p-2'>
    <Button variant="outline" size="sm" onclick={addSection}>Section</Button>
    <Button variant="outline" size="sm" onclick={addFrame}>Frame</Button>
	<hr class="my-2">
    <Button variant="outline" size="sm" onclick={addSandbox}>Sandbox</Button>
	<Button variant="outline" size="sm" onclick={addShowcase1}>Showcase1</Button>
	<hr class="my-2">
    <Button variant="outline" size="sm" onclick={addSimpleImage}>Image</Button>
    <Button variant="outline" size="sm" onclick={addShowcase}>Showcase</Button>
</div>

<div class='p-2 mt-4'>
    레이아웃
</div>
<LayoutBrowser />