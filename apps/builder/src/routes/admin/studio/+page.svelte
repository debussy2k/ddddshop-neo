<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Studio from '$lib/studio/main.svelte';
	
	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	onMount(async () => {
	});

</script>

<Studio />

