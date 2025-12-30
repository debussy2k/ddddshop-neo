<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageEnvData } from '@pages/types';
    import { JsonView } from '@zerodevx/svelte-json-view';
	import { Studio, type Widget, type Context } from '$lib/studio';


	let { data }: { data: PageEnvData } = $props();

	onMount(() => {
		console.log('### Home data:', data);
	});
</script>

<Studio>
	{#snippet impl(widget: Widget, context: Context)}
		<div class="text-center font-medium text-gray-700">
			{widget.name} / {context.breakPoint}
		</div>
	{/snippet}
</Studio>
