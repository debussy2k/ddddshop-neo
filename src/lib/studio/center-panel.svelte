<script lang="ts">
    import { onMount } from "svelte";
    import { leftPanelTabManager } from './left-panel-tab-manager.svelte';
    import BreakpointView from "./breakpoint-view.svelte";
    import { canvasManager } from "./canvas-manager.svelte";
    import InfiniteCanvasView from "./infinite-canvas-view.svelte";
    import InfiniteComponentsView from "./infinite-components-view.svelte";

    let activeTab = $derived(leftPanelTabManager.activeTab);

</script>

{#if canvasManager.mode === 'infinite-canvas'}
    {#if activeTab === 'layers'}
        <InfiniteCanvasView />
    {:else if activeTab === 'assets'}
        <InfiniteComponentsView />
    {/if}

{/if}
{#if canvasManager.mode === 'fixed-canvas'}
    <BreakpointView />
{/if}

