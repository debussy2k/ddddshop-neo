<script lang="ts">
	import type { BaseWidgetProp, VerticalAlign } from "$lib/studio/types";
	import type { FramePropValue } from "../../frame/frame.type";
	import type { ClassValue } from "svelte/elements";
	import DropdownBox from "$lib/components/ui/dropdown-box/index.js";
	type Props ={
		value: VerticalAlign;
		readonly currentProp: BaseWidgetProp | FramePropValue;
		onChange: (value: VerticalAlign) => void;
		class?: ClassValue;
	}
	let { value, currentProp, onChange, class: className }: Props = $props();

	const iconSvg = "<svg width='24' height='24' fill='none' viewBox='0 0 24 24'><path fill='currentColor' fill-rule='evenodd' d='M8.5 6.5a.5.5 0 0 1 .5-.5h5a.5.5 0 1 1 0 1h-2v9h2a.5.5 0 0 1 0 1H9a.5.5 0 0 1 0-1h2V7H9a.5.5 0 0 1-.5-.5' clip-rule='evenodd'></path></svg>";

	// hasMinHeight, hasMaxHeight가 있는 경우 비활성화
	let disabled:boolean = $derived(currentProp && "hasMinHeight" in currentProp && "hasMaxHeight" in currentProp && (currentProp.hasMinHeight || currentProp.hasMaxHeight));

	const options = $derived([
		{ label: 'Top', value: 'top' },
		{ label: 'Bottom', value: 'bottom' },
		{ label: 'Top + Bottom', value: 'both', disabled: disabled },
		{ label: 'Center', value: 'center' },
		{ label: 'Scale', value: 'scale', disabled: disabled },
	]);
</script>

<DropdownBox 
	{value} 
	{options} 
	onChange={(value) => onChange(value as VerticalAlign)} 
	icon={iconSvg}
	class={className}
/>
