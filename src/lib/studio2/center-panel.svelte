<script lang="ts">
    import { onMount } from "svelte";
    // import BreakpointView from "./breakpoint-view.svelte";
    import InfiniteCanvasView from "./infinite-canvas-view.svelte";
    import { canvasManager } from "./canvas-manager.svelte";

</script>

{#if canvasManager.mode === 'infinite-canvas'}
    <InfiniteCanvasView />
{/if}
{#if canvasManager.mode === 'fixed-canvas'}
    <!-- <BreakpointView /> -->
{/if}

