<script lang="ts">
	import { onMount } from 'svelte';
	import LayoutComp from './layout-comp.svelte';

	onMount(() => {
	});

</script>

<div>
	Component Test
</div>

<!-- 실제 구현은 이런 식으로 따로 구현 -->
{#snippet impl_beta(spec:string)}
	<p>Beta : {spec}</p>
{/snippet}

<LayoutComp>
	{#snippet impl(id: string, spec:string)}
		{#if id === 'alpha'}
			<p>Alpha : {spec}</p>
		{:else if id === 'beta'}
			{@render impl_beta(spec)}
		{:else}
			<p>Unknown : {spec}</p>
		{/if}
	{/snippet}
</LayoutComp>

