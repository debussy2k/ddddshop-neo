<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	
	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();


	onMount(async () => {

	});

</script>

<div class='p-2 border-b border-gray-200 flex gap-4'>
	<a href="/admin" class='text-sm text-gray-500'>admin</a>
	<a href="/admin/studio" class='text-sm text-gray-500'>studio</a>
	<a href="/admin/site-test" class='text-sm text-gray-500'>site-test</a>
	<a href="/dnd-test" class='text-sm text-gray-500'>dnd-test</a>
</div>


