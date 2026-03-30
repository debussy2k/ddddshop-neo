<script lang="ts">
    import TestPanel from './test-panel.svelte';
    import PageLoaderPlugin from './page-loader-plugin.svelte';

</script>

<TestPanel />

<div class='flex justify-center'>
    <PageLoaderPlugin class='w-[920px] h-[800px] overflow-hidden border border-blue-300' />
</div>
