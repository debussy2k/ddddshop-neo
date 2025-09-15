<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
    import { onMount } from 'svelte';
    import { studioDoc } from './studio-doc.svelte';
    import { cmdSection } from './command';
    import { cmdSandbox } from './command';
    import { cmdSimpleImage } from './command';
    import { cmdShowcase } from './command';
    import LayoutBrowser from './layout-browser.svelte';
    let { width }: { width: string } = $props();

    let style = `width: ${width}`;

    onMount(() => {
        console.log('LeftPanel mounted');
        addSampleSection();
    });

    function addSampleSection() {
        const { id } = cmdSection.addSection({
			prop: {
				mobile: {
					height: '260px'
				},
				tablet: {
					height: '360px'
				},
				desktop: {
					height: '460px'
				}
			}
        });
        studioDoc.activeId = id;
    }

    function addSandbox() {
        if (studioDoc.activeId) {
            const { id } = cmdSandbox.addSandbox({
                parentId: studioDoc.activeId,
                text: 'Sandbox One'
            });
            studioDoc.activeId = id;
        }
    }

    function addSimpleImage() {
        if (studioDoc.activeId) {
            const { id } = cmdSimpleImage.addSimpleImage({
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
            const { id } = cmdShowcase.addShowcase({
                parentId: studioDoc.activeId,
                showcaseCode: "for_teacher",
            });
            studioDoc.activeId = id;
        }
    }
</script>

<div class="bg-white text-sm h-full flex flex-col" style={style}>
    <div>
        <Button variant="outline" onclick={addSampleSection}>Add Section</Button>
        <Button variant="outline" onclick={addSandbox}>Add Sandbox</Button>
        <Button variant="outline" onclick={addSimpleImage}>Add SimpleImage</Button>
		<Button variant="outline" onclick={addShowcase}>Add Showcase</Button>
    </div>

    <div class='p-2 mt-4'>
        레이아웃
    </div>
    <LayoutBrowser />
</div>