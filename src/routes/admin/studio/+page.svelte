<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SiteTest from './site-test.svelte';
	
	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	onMount(async () => {
	});

</script>

<SiteTest />