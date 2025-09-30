<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import DropdownBox from "$lib/components/ui/dropdown-box/index.js";
	import type { VerticalAlign } from "$lib/studio/types";
	interface Props {
		value: VerticalAlign;
		onChange: (value: VerticalAlign) => void;
		class?: ClassValue;
	}
	let { value, onChange, class: className }: Props = $props();

	const iconSvg = "<svg width='24' height='24' fill='none' viewBox='0 0 24 24'><path fill='currentColor' fill-rule='evenodd' d='M8.5 6.5a.5.5 0 0 1 .5-.5h5a.5.5 0 1 1 0 1h-2v9h2a.5.5 0 0 1 0 1H9a.5.5 0 0 1 0-1h2V7H9a.5.5 0 0 1-.5-.5' clip-rule='evenodd'></path></svg>";
	
	const options = [
		{ label: 'Top', value: 'top' },
		{ label: 'Bottom', value: 'bottom' },
		{ label: 'Top + Bottom', value: 'both' },
		{ label: 'Center', value: 'center' },
		{ label: 'Scale', value: 'scale' },
	];
</script>

<DropdownBox 
	{value} 
	{options} 
	onChange={(value) => onChange(value as VerticalAlign)} 
	icon={iconSvg}
	class={className}
/>
