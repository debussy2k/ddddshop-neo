<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
	// import { showDebugInfo } from '$lib/service/app.service';
	import { cn } from '$lib/utils';
	import { JsonView } from '@zerodevx/svelte-json-view';
	import toast from 'svelte-french-toast';
	import type { ClassValue } from 'svelte/elements';
	interface Props {
		data: any;
		title?: string;
		depth?: any;
		class?: ClassValue;
	}

	let { data, title = '', depth = -1, class: className }: Props = $props();

	function handleCopy() {
		navigator.clipboard.writeText(JSON.stringify(data, null, 2));
		toast.success('Copied to clipboard');
	}
</script>

<!-- {#if $showDebugInfo} -->
	<div class={cn('dataview font-mono text-xs', className)}>
		{#if title.length > 0}
			<button onclick={handleCopy} class="inline rounded-lg border bg-gray-100 px-1 py-0.5 text-red-700">{title}</button>
		{/if}
		<JsonView json={data} {depth} />
	</div>
<!-- {/if} -->

<style lang="postcss">
	.dataview :global(ul) {
		padding-left: 1rem;
	}
</style>