<script lang="ts">
	import { onMount } from 'svelte';
	import LayoutComp from './layout-comp.svelte';

	let count = $state(0);

	onMount(() => {
	});

</script>

<div>
	Component Test
</div>

<!-- 실제 구현은 이런 식으로 따로 구현 -->
{#snippet impl_beta(spec:string)}
	<p>Beta : {spec}</p>
	<button class='border p-2 mx-4' onclick={() => count++}>
		count:{count}
	</button>
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

