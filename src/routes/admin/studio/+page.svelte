<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Studio, type Widget, type Context } from '$lib/studio';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();


</script>

<Studio>
	{#snippet impl(widget: Widget, context: Context)}
		<div class="text-center font-medium text-gray-700">
			{widget.name} / {context.breakPoint}
		</div>
	{/snippet}
</Studio>
