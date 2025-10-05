<script lang="ts">
	import { studioDoc } from '../../../studio-doc.svelte';
	import ComboBox, { type ComboBoxItem } from '../combo-box.svelte';
	import type { BaseWidgetProp, ContainerPropValue } from '../../../types';
	import type { FramePropValue } from '../../frame/frame.type';
	import type { SectionPropValue } from '../../section/section.type';
	import * as constraintsUtilVert from '../constraints-util-vert';
	import type { ComputedValue } from '../computed-value-util';
	import * as du from '../doc-util';

	export type HeightComboBoxItemChangeValue =
		| 'select-fixed-height'
		| 'hug-contents'
		| 'fill-container'
		| 'select-min-height'
		| 'add-min-height'
		| 'select-max-height'
		| 'add-max-height'
		| 'delete-min-max';

	type Props = {
		icon?: string; // svg 문자열을 받음
		class?: string;
		value: number;
		currentProp: BaseWidgetProp;
		parentProp: ContainerPropValue;
		min?: number;
		max?: number;
		updateProp: (newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) => void;
		computedVal: ComputedValue;
		displayStatus: {
			showMinHeight: boolean;
			showMaxHeight: boolean;
		};
	};
	let {
		class: className,
		icon,
		value,
		currentProp,
		parentProp,
		min,
		max,
		updateProp,
		computedVal,
		displayStatus = $bindable()
	}: Props = $props();

	let comboBoxItems: ComboBoxItem[] = $derived.by(() => {
		let arr: ComboBoxItem[] = [];

		arr.push({
			type: 'item',
			label: `고정 높이 (${value})`,
			value: 'select-fixed-height',
			onChange: (value: string) => {
				handleComboBoxItemChange(value as HeightComboBoxItemChangeValue);
			}
		});
		if (du.isFlexbox(currentProp)) {
			arr.push({
				type: 'item',
				label: `Hug contents`,
				value: 'hug-contents',
				onChange: (value: string) => {
					handleComboBoxItemChange(value as HeightComboBoxItemChangeValue);
				}
			});
		}
		if (du.isFlexbox(parentProp)) {
			arr.push({
				type: 'item',
				label: `Fill container`,
				value: 'fill-container',
				onChange: (value: string) => {
					handleComboBoxItemChange(value as HeightComboBoxItemChangeValue);
				}
			});
		}

		arr.push(
			{ type: 'divider' },
			{
				type: 'item',
				label: currentProp.sizeConstraints?.hasMinHeight
					? `최소 높이: ${currentProp.sizeConstraints.minHeight}`
					: `최소 높이 추가`,
				value: currentProp.sizeConstraints?.hasMinHeight ? 'select-min-height' : 'add-min-height',
				onChange: (value: string) => {
					handleComboBoxItemChange(value as HeightComboBoxItemChangeValue);
				}
			},
			{
				type: 'item',
				label: currentProp.sizeConstraints?.hasMaxHeight
					? `최대 높이: ${currentProp.sizeConstraints.maxHeight}`
					: `최대 높이 추가`,
				value: currentProp.sizeConstraints?.hasMaxHeight ? 'select-max-height' : 'add-max-height',
				onChange: (value: string) => {
					handleComboBoxItemChange(value as HeightComboBoxItemChangeValue);
				}
			},
			{ type: 'divider' },
			{
				type: 'item',
				label: `최소/최대값 삭제`,
				value: 'delete-min-max',
				onChange: (value: string) => {
					handleComboBoxItemChange(value as HeightComboBoxItemChangeValue);
				}
			}
		);

		return arr;
	});

	function handleValueChange(value: number) {
		const updatedProps = constraintsUtilVert.updateHeightConstraints(
			value,
			currentProp,
			computedVal
		);

		// height가 변경되었을 때 fullHeight 속성이 있으면 fullHeight를 false로 설정
		if (currentProp.sizeConstraints?.fullHeight) {
			updateProp({
				...updatedProps,
				sizeConstraints: {
					...currentProp.sizeConstraints,
					fullHeight: false
				}
			});
		} else {
			updateProp(updatedProps);
		}
	}

	function handleComboBoxItemChange(value: HeightComboBoxItemChangeValue) {
		console.log('onHeightComboBoxItemChange', value);
		if (!currentProp.sizeConstraints) {
			console.error('currentProp.sizeConstraints is undefined');
			return;
		}

		if (value === 'select-fixed-height') {
			console.log('select-fixed-height');
			updateProp({
				sizeConstraints: {
					...currentProp.sizeConstraints,
					fullHeight: false,
				}
			});
		} else if (value === 'hug-contents') {
			console.log('hug-contents');
		} else if (value === 'fill-container') {
			console.log('fill-container');
			updateProp({
				sizeConstraints: {
					...currentProp.sizeConstraints,
					fullHeight: true
				}
			});
		} else if (value === 'select-min-height' || value === 'add-min-height') {
			displayStatus.showMinHeight = true;
		} else if (value === 'select-max-height' || value === 'add-max-height') {
			displayStatus.showMaxHeight = true;
		} else if (value === 'delete-min-max') {
			displayStatus.showMinHeight = false;
			displayStatus.showMaxHeight = false;
			updateProp({
				sizeConstraints: {
					...currentProp.sizeConstraints,
					hasMinHeight: false,
					minHeight: 0,
					hasMaxHeight: false,
					maxHeight: 0
				}
			});
		}
	}

	function onDragStart() {
		studioDoc.setBatchMode();
	}

	function onDragEnd() {
		studioDoc.commitBatch();
	}
</script>

<ComboBox
	class={className}
	name="H"
	{icon}
	{value}
	{comboBoxItems}
	{min}
	{max}
	showFill={currentProp.sizeConstraints?.fullHeight ?? false}
	onChange={handleValueChange}
	{onDragStart}
	{onDragEnd}
/>
