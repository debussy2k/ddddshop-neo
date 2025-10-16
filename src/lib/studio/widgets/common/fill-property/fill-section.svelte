<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import { studioDoc } from '../../../studio-doc.svelte';
	import type { Widget, BaseWidgetProp } from '../../../types';
	import type { FramePropValue } from '../../frame/frame.type';
	import type { SectionPropValue } from '../../section/section.type';
	import ColorPicker, { ChromeVariant, type HsvaColor, type RgbaColor } from 'svelte-awesome-color-picker';
	import Wrapper from './wrapper.svelte';

	interface Props {
		class?: ClassValue;
		data: Widget;
		currentProp: BaseWidgetProp | FramePropValue;
		updateProp: (newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) => void;
	}

	let { class: className, data, currentProp, updateProp }: Props = $props();

	let isColorPickerOpen = $state(false);
	$effect(() => {
		// console.log('isColorPickerOpen', isColorPickerOpen);
		if (isColorPickerOpen) {
			onColorPickerOpen();
		} else {
			onColorPickerClose();
		}
	});

	let hex = $state(currentProp.backgroundColor || '#ffffff');

	function onColorPickerOpen() {
		studioDoc.historyManager.setBatchMode();
	}

	function onColorPickerClose() {
		studioDoc.historyManager.commitBatch();
	}

	function handleInput(color: { hsv: HsvaColor | null; rgb: RgbaColor | null; hex: string | null; color: any; }) {
		// console.log(`handleInput (isOpen: ${isColorPickerOpen})`, color);
		updateProp({ backgroundColor: color.hex || '#ffffff' });
	}

</script>

<div class={cn('border-b border-gray-200 px-3 py-4 text-xs', className || '')}>
	<div class="mb-3">배경 색상</div>

	<div class='bg-gray-100 rounded-sm'>
		<ColorPicker bind:hex 
			components={{wrapper: Wrapper}} 
			sliderDirection="horizontal"
			label={`${hex}`}
			--input-size="20px"
			position="responsive"
			onInput={handleInput}
			bind:isOpen={isColorPickerOpen}
		/>
	</div>
</div>