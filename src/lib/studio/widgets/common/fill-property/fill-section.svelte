<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import { studioDoc } from '../../../studio-doc.svelte';
	import type { Widget, BaseWidgetProp } from '../../../types';
	import type { FramePropValue } from '../../frame/frame.type';
	import type { SectionPropValue } from '../../section/section.type';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	import Wrapper from './wrapper.svelte';

	interface Props {
		class?: ClassValue;
		data: Widget;
		currentProp: BaseWidgetProp | FramePropValue;
		updateProp: (newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) => void;
	}

	let { class: className, data, currentProp, updateProp }: Props = $props();

	let hex = $state('#3e959c');

	let rgb = $state({
		r: 62,
		g: 149,
		b: 156,
		a: 1
	});

	let hsv = $state({
		h: 184,
		s: 60,
		v: 61,
		a: 1
	});

</script>

<div class={cn('border-b border-gray-200 px-3 py-4 text-xs', className || '')}>
	<div class="mb-3">배경 색상</div>

	<ColorPicker bind:rgb bind:hsv bind:hex 
        components={{wrapper: Wrapper}} 
        sliderDirection="horizontal"
        label={`${hex}`}
        position="responsive"
    />
</div>