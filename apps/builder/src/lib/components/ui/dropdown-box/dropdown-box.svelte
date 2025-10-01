<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import * as Popover from "$lib/components/ui/popover/index.js";

	interface Option {
		label: string;
		value: string;
		icon?: string;
	}

	interface Props {
		value: string;
		options: Option[];
		onChange: (value: string) => void;
		class?: ClassValue;
		placeholder?: string;
		disabled?: boolean;
		icon?: string;
	}

	let { 
		value, 
		options, 
		onChange, 
		class: className,
		placeholder = "선택하세요",
		disabled = false,
		icon
	}: Props = $props();

	let isOpen = $state(false);

	function handleSelectOption(selectedValue: string) {
		onChange(selectedValue);
		isOpen = false;
	}

	// 선택된 옵션 찾기
	let selectedOption = $derived(options.find(option => option.value === value));
	let displayText = $derived(selectedOption?.label || placeholder);
</script>

<div class='h-6'>
	<Popover.Root bind:open={isOpen}>
		<Popover.Trigger class='w-full' {disabled}>
			<div class={cn(
				'flex items-center text-xs bg-white rounded-sm w-full border border-gray-200',
				disabled && 'opacity-50 cursor-not-allowed',
				className
			)}>
				{#if icon}
					<div class='w-6 text-gray-600 flex-shrink-0'>
						{@html icon}
					</div>
				{/if}
				<div class='flex-1 min-w-0 text-left text-gray-800 flex-shrink-0 select-none overflow-x-hidden'>
					<span class='truncate'>{displayText}</span>
				</div>
				<div class='w-6 text-gray-800 flex-shrink-0'>
					<svg width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path fill="currentColor" fill-rule="evenodd" d="M9.146 11.146a.5.5 0 0 1 .708 0l1.646 1.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708" clip-rule="evenodd"></path>
					</svg>
				</div>	
			</div>
		</Popover.Trigger>
		<Popover.Content class='w-full px-2 py-2' side='bottom' align='start'>
			<div class='flex flex-col text-xs'>
				{#each options as option}
					<button 
						type="button"
						class={cn(
							'p-2 hover:bg-gray-100 cursor-pointer text-left flex items-center gap-2',
							option.value === value && 'bg-gray-100'
						)}
						onclick={() => handleSelectOption(option.value)}
					>
						{#if option.icon}
							<div class='w-4 h-4 text-gray-600 flex-shrink-0'>
								{@html option.icon}
							</div>
						{/if}
						{option.label}
					</button>
				{/each}
			</div>
		</Popover.Content>
	</Popover.Root>
</div>
