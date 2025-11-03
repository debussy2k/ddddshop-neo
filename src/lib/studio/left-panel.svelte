<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
    import { onMount } from 'svelte';
    import { studioDoc } from './studio-doc.svelte';
    import { cmdSection, cmdFrame, cmdSandbox, cmdSimpleImage, cmdShowcase } from './command';
    import LayoutBrowser from './layout-browser.svelte';
    import { leftPanelTabManager } from './left-panel-tab-manager.svelte';
    let { width }: { width: string } = $props();

    let style = `width: ${width}`;
    
    let activeTab = $derived(leftPanelTabManager.activeTab);

    onMount(() => {
        console.log('LeftPanel mounted');
        addSection();
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

<div class="bg-white text-sm h-full flex flex-col" style={style}>
    <div class="flex border-b border-gray-200">
        <button
            class="flex-1 px-4 py-2 text-center transition-colors {activeTab === 'pages' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}"
            onclick={() => leftPanelTabManager.setActiveTab('pages')}
        >
            Pages
        </button>
        <button
            class="flex-1 px-4 py-2 text-center transition-colors {activeTab === 'layers' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}"
            onclick={() => leftPanelTabManager.setActiveTab('layers')}
        >
            Layers
        </button>
        <button
            class="flex-1 px-4 py-2 text-center transition-colors {activeTab === 'assets' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}"
            onclick={() => leftPanelTabManager.setActiveTab('assets')}
        >
            Assets
        </button>
    </div>
    <div class='p-2'>
        <Button variant="outline" onclick={addSection}>Section</Button>
        <Button variant="outline" onclick={addFrame}>Frame</Button>
        <Button variant="outline" onclick={addSandbox}>Sandbox</Button>
        <Button variant="outline" onclick={addSimpleImage}>Image</Button>
		<Button variant="outline" onclick={addShowcase}>Showcase</Button>
    </div>

    <div class='p-2 mt-4'>
        레이아웃
    </div>
    <LayoutBrowser />
</div>