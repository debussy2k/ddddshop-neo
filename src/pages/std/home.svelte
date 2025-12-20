<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageEnvData } from '@pages/types';
    import { JsonView } from '@zerodevx/svelte-json-view';

	let { data }: { data: PageEnvData } = $props();

	onMount(() => {
		console.log('### data:', data);
	});
</script>

<div class="">
	<JsonView json={data} />
</div>

<hr>
<div>Home Component</div>

<a href="./{data.tenantSiteKey}/about">About</a>
