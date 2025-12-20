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
<div>About Component</div>
<!-- <a href="./{data.tenantSiteKey}/">Home</a> -->
<a href="./">Home</a>
