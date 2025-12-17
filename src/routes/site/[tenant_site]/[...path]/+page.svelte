<script lang="ts">
    import type { PageData } from './$types';
	import { onMount } from 'svelte';
    import { page } from '$app/state';
    
    let { data }: { data: PageData } = $props();
    let path = $derived(page.params.path);

</script>

<div class="">
	<h1 class="">path: {path}</h1>
    <div>tenant_id: {data.site?.tenant_id}</div>
    <div>site_id: {data.site?.site_id}</div>
</div>

<hr>

Link: <a href="my-link">my-link</a>