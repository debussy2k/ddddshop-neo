<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { PageData } from './$types';
	
	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();


	onMount(async () => {

	});
	onDestroy(() => {

	});

</script>

<div>
	Home
</div>