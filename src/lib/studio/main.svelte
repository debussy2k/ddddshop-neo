<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { studioDoc } from './studio-doc.svelte';
    import TopPanel from './top-panel.svelte';
    import LeftPanel from './left-panel.svelte';
    import RightPanel from './right-panel.svelte';
    import CenterPanel from './center-panel.svelte';

    onMount(() => {
        
    });

    onDestroy(() => {
        studioDoc.destroy();
    });
</script>

<div class="flex flex-col h-screen">
    <TopPanel />
    <div class="flex flex-1">
        <LeftPanel width="240px" />
        <CenterPanel class="flex-1" />
        <RightPanel width="200px" />
    </div>
</div>