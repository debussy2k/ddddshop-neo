<script lang="ts">
	import { cn } from "$lib/utils";
	import * as Popover from "$lib/components/ui/popover/index.js";

	interface Props {
		value: string;
		onChange: (value: string) => void;
		class?: string;
	}
	let { value, onChange, class: className }: Props = $props();

	const  iconSvg = "<svg width='24' height='24' fill='none' viewBox='0 0 24 24'><path fill='currentColor' fill-rule='evenodd' d='M16.5 8.5a.5.5 0 0 1 .5.5v5a.5.5 0 1 1-1 0v-2H7v2a.5.5 0 0 1-1 0V9a.5.5 0 0 1 1 0v2h9V9a.5.5 0 0 1 .5-.5' clip-rule='evenodd'></path></svg>";
	const options = [
		{ label: 'Left', value: 'Left' },
		{ label: 'Right', value: 'Right' },
		{ label: 'Left + Right',  label_short: 'L+R', value: 'Left + Right' },
	];

	let isOpen = $state(false);

	function handleSelectOption(selectedValue: string) {
		onChange(selectedValue);
		isOpen = false;
	}
</script>

<div class='h-6'>
	<Popover.Root bind:open={isOpen}>
		<Popover.Trigger class='w-full'>
			<div class={cn('flex items-center text-xs bg-white rounded-sm w-full border border-gray-200', className)}>
				<div class='w-6 text-gray-600 flex-shrink-0'>
					{@html iconSvg}
				</div>
				<div class='flex-1 min-w-0 text-left text-gray-800 flex-shrink-0 select-none'>
					{value}
				</div>
				<div class='w-6 text-gray-800 flex-shrink-0'>
					<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M9.146 11.146a.5.5 0 0 1 .708 0l1.646 1.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708" clip-rule="evenodd"></path></svg>
				</div>	
			</div>
		</Popover.Trigger>
		<Popover.Content class='w-full px-2 py-0' side='bottom' align='start' >
			<div class='flex flex-col text-xs'>
				{#each options as option}
					<button 
						type="button"
						class='p-2 hover:bg-gray-100 cursor-pointer text-left' 
						onclick={() => handleSelectOption(option.value)}
					>
						{option.label}
					</button>
				{/each}
			</div>
		</Popover.Content>
	</Popover.Root>
</div>