<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface Option<T = string> {
		id: T;
		label: string;
		icon?: string;
	}

	interface Props<T = string> {
		class?: ClassValue;
		options: Option<T>[];
		value: T;
		name?: string;
		onChange?: (value: T) => void;
	}

	let { class: className, options, value, name = "segmented-control", onChange }: Props = $props();
</script>

<div role="radiogroup" class={cn("flex gap-2 w-full bg-gray-100 rounded-sm", className)}>
	{#each options as option}
		<label
			class="flex items-center justify-center flex-1 cursor-pointer transition-colors
				bg-gray-100 relative rounded-sm box-border
				[&.selected]:bg-white border border-gray-100 [&.selected]:border-gray-200"
			class:selected={value === option.id}
			title={option.label}
		>
			<input
				type="radio"
				{name}
				bind:group={value}
				value={option.id}
				class="sr-only h-8"
				aria-checked={value === option.id}
				onchange={() => onChange?.(option.id)}
			/>
			{#if option.icon}
				<span class="w-6 h-6 flex items-center justify-center" aria-hidden="true">
					{@html option.icon}
				</span>
			{:else}
				<span class="px-3 py-2 text-sm">
					{option.label}
				</span>
			{/if}
			<span class="sr-only">{option.label}</span>
		</label>
	{/each}
</div>
