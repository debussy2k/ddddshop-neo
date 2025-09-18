<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import ComboBox from "$lib/components/ui/combo-box/index.js";

	interface Props {
		value: string;
		onChange: (value: string) => void;
		class?: ClassValue;
	}
	let { value, onChange, class: className }: Props = $props();

	const iconSvg = "<svg width='24' height='24' fill='none' viewBox='0 0 24 24'><path fill='currentColor' fill-rule='evenodd' d='M16.5 8.5a.5.5 0 0 1 .5.5v5a.5.5 0 1 1-1 0v-2H7v2a.5.5 0 0 1-1 0V9a.5.5 0 0 1 1 0v2h9V9a.5.5 0 0 1 .5-.5' clip-rule='evenodd'></path></svg>";
	
	const options = [
		{ label: 'Left', value: 'Left' },
		{ label: 'Right', value: 'Right' },
		{ label: 'Left + Right', value: 'Left + Right' },
		{ label: 'Scale', value: 'Scale' },
	];
</script>

<ComboBox 
	{value} 
	{options} 
	{onChange} 
	icon={iconSvg}
	class={className}
/>