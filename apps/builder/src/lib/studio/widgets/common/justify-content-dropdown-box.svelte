<script lang="ts">
	import type { JustifyContent } from "../../types";
	import type { ClassValue } from "svelte/elements";
	import DropdownBox from "$lib/components/ui/dropdown-box/index.js";

	interface Props {
		value: JustifyContent;
		onChange?: (value: JustifyContent) => void;
		class?: ClassValue;
	}
	let { value, onChange, class: className }: Props = $props();

	const iconSvg = "<svg width='24' height='24' fill='none' viewBox='0 0 24 24'><path fill='currentColor' fill-rule='evenodd' d='M16.5 8.5a.5.5 0 0 1 .5.5v5a.5.5 0 1 1-1 0v-2H7v2a.5.5 0 0 1-1 0V9a.5.5 0 0 1 1 0v2h9V9a.5.5 0 0 1 .5-.5' clip-rule='evenodd'></path></svg>";
	
	const options = [
		{ label: 'start', value: 'start' },
		{ label: 'center', value: 'center' },
		{ label: 'end', value: 'end' },
		{ label: 'space-between', value: 'space-between' },
	];
</script>

<DropdownBox 
	{value} 
	{options} 
	onChange={(value) => onChange && onChange(value as JustifyContent)} 
	icon={iconSvg}
	class={className}
/>