<script lang="ts">
    import { onMount } from 'svelte';
    import { leftPanelTabManager } from './left-panel-tab-manager.svelte';
    import LayersPanel from './left-panel/layers-panel.svelte';
    import AssetsPanel from './left-panel/assets-panel.svelte';
    let { width }: { width: string } = $props();

    let style = `width: ${width}`;
    
    let activeTab = $derived(leftPanelTabManager.activeTab);

    onMount(() => {
    });
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

    {#if activeTab === 'layers'}
        <LayersPanel />
    {:else if activeTab === 'assets'}
        <AssetsPanel />
    {/if}
</div>