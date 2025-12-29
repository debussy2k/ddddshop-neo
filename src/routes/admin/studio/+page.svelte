<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Studio from '$lib/studio/studio.svelte';
	
	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	onMount(async () => {
	});

</script>

<Studio>
	{#snippet impl(id: string)}
		<div>Studio {id}</div>
	{/snippet}
</Studio>
