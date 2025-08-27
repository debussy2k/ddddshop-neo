<script lang="ts">
    import LeftPanel from './left-panel.svelte';
    import RightPanel from './right-panel.svelte';
    import Workspace from './workspace.svelte';
</script>

<div class="flex flex-col h-screen">
    <div class='w-full h-10 bg-gray-100 border-b border-gray-200'>
        header
    </div>
    <div class="flex flex-1">
        <LeftPanel width="240px" />
        <Workspace class="flex-1" />
        <RightPanel width="200px" />
    </div>
</div>