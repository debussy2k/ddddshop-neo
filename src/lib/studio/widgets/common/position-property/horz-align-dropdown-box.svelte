<script lang="ts">
	import type { BaseWidgetProp, HorizontalAlign } from "../../../types";
	import type { FramePropValue } from "../../frame/frame.type";
	import type { ClassValue } from "svelte/elements";
	import DropdownBox from "$lib/components/ui/dropdown-box/index.js";

	type Props = {
		value: HorizontalAlign;
		readonly currentProp: BaseWidgetProp | FramePropValue;
		onChange: (value: HorizontalAlign) => void;
		class?: ClassValue;
	}
	let { value, currentProp, onChange, class: className }: Props = $props();

	const iconSvg = "<svg width='24' height='24' fill='none' viewBox='0 0 24 24'><path fill='currentColor' fill-rule='evenodd' d='M16.5 8.5a.5.5 0 0 1 .5.5v5a.5.5 0 1 1-1 0v-2H7v2a.5.5 0 0 1-1 0V9a.5.5 0 0 1 1 0v2h9V9a.5.5 0 0 1 .5-.5' clip-rule='evenodd'></path></svg>";

	// hasMinWidth, hasMaxWidth가 있는 경우 비활성화
	let disabled:boolean = $derived(currentProp && "hasMinWidth" in currentProp && "hasMaxWidth" in currentProp && (currentProp.hasMinWidth || currentProp.hasMaxWidth));

	const options = $derived([
		{ label: 'Left', value: 'left' },
		{ label: 'Right', value: 'right' },
		{ label: 'Left + Right', value: 'both', disabled: disabled },
		{ label: 'Center', value: 'center' },
		{ label: 'Scale', value: 'scale', disabled: disabled },
	]);
</script>

<DropdownBox 
	{value} 
	{options} 
	onChange={(value) => onChange(value as HorizontalAlign)} 
	icon={iconSvg}
	class={className}
/>