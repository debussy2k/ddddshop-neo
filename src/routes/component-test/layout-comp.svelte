<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		impl: Snippet<[string, string]>;
	}

	let { impl }: Props = $props();

	onMount(() => {
	});

</script>


<div class='m-8 space-y-4'>
	<div class='w-[400px] h-[200px] border'>
		{@render impl?.('alpha', 'frame')}
	</div>

	<div class='w-[200px] h-[200px] border'>
		{@render impl?.('beta', 'sandbox')}
	</div>

	<div class='w-[200px] h-[200px] border'>
		{@render impl?.('genova', 'showcase')}
	</div>

</div>