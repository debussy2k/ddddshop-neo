<script lang="ts">
	import { page } from '$app/state';
    import { JsonView } from '@zerodevx/svelte-json-view';
    import { goto } from '$app/navigation';
    
	let pageData = $derived(page.data);

    let pathList = $derived.by(() => {
        return Object.keys(pageData.pathMap || {}).map(key => {
            return {
                path: key,
                data: pageData.pathMap[key]
            }
        });
    });

    function handlePathClick(path: string) {
        let url = `/site/${pageData.tenantSiteKey}${path}`;
        goto(url);
    }

</script>

<div class='px-4 py-2 space-y-2'>
    {#each pathList as path}
        {@const pathName = path.path === '/' ? 'Home' : path.path}
        <div class='text-blue-500 font-bold cursor-pointer hover:text-blue-500' onclick={() => handlePathClick(path.path)}>{pathName}</div>
    {/each}
</div>