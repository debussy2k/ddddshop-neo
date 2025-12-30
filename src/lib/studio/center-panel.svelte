<script lang="ts">
    import { onMount } from "svelte";
    import { leftPanelTabManager } from './left-panel-tab-manager.svelte';
    import type { ImplSnippet } from './impl-snippet';
    import BreakpointView from "./breakpoint-view.svelte";
    import { canvasManager } from "./canvas-manager.svelte";
    import InfiniteCanvasView from "./infinite-canvas-view.svelte";
    import InfiniteComponentsView from "./infinite-components-view.svelte";

    interface Props {
        class?: string;
        impl: ImplSnippet;
    }

    let { class: className, impl }: Props = $props();

    let activeTab = $derived(leftPanelTabManager.activeTab);

</script>

{#if canvasManager.mode === 'infinite-canvas'}
    {#if activeTab === 'pages' || activeTab === 'layers'}
        <InfiniteCanvasView {impl} />
    {:else if activeTab === 'assets'}
        <InfiniteComponentsView />
    {/if}

{/if}
{#if canvasManager.mode === 'fixed-canvas'}
    <BreakpointView {impl} />
{/if}

