<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageEnvData } from '@pages/types';
    import { JsonView } from '@zerodevx/svelte-json-view';
	import { Studio, type Widget, type Context } from '$lib/studio';
	import type { Sandbox } from '$lib/studio/widgets/sandbox';
	import Showcase from '$lib/studio/comps/showcase/showcase.comp.svelte';

	let { data }: { data: PageEnvData } = $props();

	onMount(() => {
		console.log('### Home data:', data);
	});
</script>

<Studio>
	{#snippet impl(widget: Widget, context: Context)}
		<div class="text-center font-medium text-gray-700">
			{#if widget.type === 'sandbox' && widget.componentId === 'showcase1'}
				{@render impl_showcase1(widget, context)}
			{:else}
				{widget.name}
			{/if}
		</div>
	{/snippet}
</Studio>

{#snippet impl_showcase1(widget: Sandbox, context: Context)}
	<Showcase data={widget} {context}/>
{/snippet}