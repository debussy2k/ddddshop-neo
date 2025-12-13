<script lang="ts">
	import { onMount } from 'svelte';
	import LayoutComp from './layout-comp.svelte';

	onMount(() => {
	});

</script>

<div>
	Component Test
</div>

<LayoutComp>
	{#snippet impl(id: string, spec:string)}
		{#if id === 'alpha'}
			<p>Alpha : {spec}</p>
		{:else if id === 'beta'}
			<p>Beta : {spec}</p>
		{:else}
			<p>Unknown : {spec}</p>
		{/if}
	{/snippet}
</LayoutComp>

