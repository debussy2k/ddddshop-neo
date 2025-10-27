<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Studio2 } from '$lib/studio2';
	
	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	onMount(async () => {
	});

</script>

<Studio2 />

