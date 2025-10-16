<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { SandboxWidget } from "$lib/studio/widgets/sandbox";
	import { SimpleImageWidget } from "$lib/studio/widgets/simple-image";
	import { FrameWidget } from "$lib/studio/widgets/frame";
	import { ShowcaseWidget } from "$lib/studio/widgets/showcase";
	import type { Sandbox } from "$lib/studio/widgets/sandbox";
	import type { SimpleImage } from "$lib/studio/widgets/simple-image";
	import type { Frame } from "$lib/studio/widgets/frame";
	import type { Showcase } from "$lib/studio/widgets/showcase";
	import { studioDoc } from "$lib/studio/studio-doc.svelte";
	import type { Widget } from "$lib/studio/types";
	import type { Context } from "$lib/studio/context.svelte";
	
	interface Props {
		widgets: Widget[] | undefined;
		context?: Context;
		class?: ClassValue;
	}

	let { widgets, context, class: className }: Props = $props();
</script>

{#each widgets || [] as widgetData (widgetData.id)}
	{#if (widgetData as any).type === 'frame'}
		<FrameWidget 
			data={widgetData as Frame}
			{context}
		/>
	{:else if (widgetData as any).type === 'sandbox'}
		<SandboxWidget 
			data={widgetData as Sandbox}
			{context}
		/>
	{:else if (widgetData as any).type === 'simple-image'}
		{#key widgetData.id + (widgetData as SimpleImage).url}
			<SimpleImageWidget 
				data={widgetData as SimpleImage}
				{context}
			/>
		{/key}
	{:else if (widgetData as any).type === 'showcase'}
		<ShowcaseWidget 
			data={widgetData as Showcase}
			{context}
		/>
	{/if}
{/each}
