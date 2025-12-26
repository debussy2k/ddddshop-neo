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
	<hr>
	<button class="border p-2 mx-4" onclick={() => {}}>preview</button>
	<button class="border p-2 mx-4" onclick={() => {}}>editor</button>
</div>

<hr>
<div>Home Component</div>

<a href="./about">About</a>
