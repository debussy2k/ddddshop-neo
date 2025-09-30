<script lang="ts">
	import type { AlignItems } from "../../../types";
	import type { ClassValue } from "svelte/elements";
	import DropdownBox from "$lib/components/ui/dropdown-box/index.js";

	interface Props {
		value: AlignItems;
		onChange?: (value: AlignItems) => void;
		class?: ClassValue;
	}
	let { value, onChange, class: className }: Props = $props();

	const iconSvg = "<svg width='24' height='24' fill='none' viewBox='0 0 24 24'><path fill='currentColor' fill-rule='evenodd' d='M8.5 6.5a.5.5 0 0 1 .5-.5h5a.5.5 0 1 1 0 1h-2v9h2a.5.5 0 0 1 0 1H9a.5.5 0 0 1 0-1h2V7H9a.5.5 0 0 1-.5-.5' clip-rule='evenodd'></path></svg>";
	
	const options = [
		{ label: 'start', value: 'start' },
		{ label: 'center', value: 'center' },
		{ label: 'end', value: 'end' },
	];
</script>

<DropdownBox 
	{value} 
	{options} 
	onChange={(value) => onChange && onChange(value as AlignItems)} 
	icon={iconSvg}
	class={className}
/>