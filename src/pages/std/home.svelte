<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageEnvData } from '@pages/types';
    import { JsonView } from '@zerodevx/svelte-json-view';
	import { Studio, type Widget, type Context } from '$lib/studio';


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

<Studio>
	{#snippet impl(widget: Widget, context: Context)}
		<div class="text-center font-medium text-gray-700">
			{widget.name} / {context.breakPoint}
		</div>
	{/snippet}
</Studio>


<a href="./about">About</a>
