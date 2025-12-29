<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Studio from '$lib/studio/studio.svelte';
	import type { Widget } from '$lib/studio/types';
	import type { Context } from '$lib/studio/context.svelte';
	
	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	onMount(async () => {
	});

</script>

<Studio>
	{#snippet impl(widget: Widget, context: Context)}
		<div class="text-center font-medium text-gray-700">
			{widget.name} / {context.breakPoint}
		</div>
	{/snippet}
</Studio>
