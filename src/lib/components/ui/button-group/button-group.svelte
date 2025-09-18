<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface Option<T = string> {
		id: T;
		label: string;
		icon?: string;
		disabled?: boolean;
	}

	interface Props<T = string> {
		class?: ClassValue;
		options: Option<T>[];
		onClick?: (value: T) => void;
		variant?: "default" | "outline" | "secondary" | "ghost";
		size?: "sm" | "default" | "lg";
	}

	let { 
		class: className, 
		options, 
		onClick,
	}: Props = $props();

	function handleClick(option: Option) {
		if (!option.disabled) {
			onClick?.(option.id);
		}
	}
</script>

<div class={cn("flex gap-x-[1px]", className)}>
	{#each options as option, index}
		<button
			type="button"
			class={cn(
				"flex items-center justify-center flex-1 cursor-pointer",
				"bg-gray-100 relative box-border",
                "hover:bg-gray-200",
				// 첫 번째 버튼
				index === 0 && "rounded-l-sm",
				// 마지막 버튼
				index === options.length - 1 && "rounded-r-sm",
				// 중간 버튼들은 모서리 없음
				index > 0 && index < options.length - 1 && "rounded-none",
			)}
			disabled={option.disabled}
			onclick={() => handleClick(option)}
			title={option.label}
		>
			{#if option.icon}
				<span class="w-6 h-6 flex items-center justify-center" aria-hidden="true">
					{@html option.icon}
				</span>
			{/if}
		</button>
	{/each}
</div>
