<script lang="ts">
	import { studioDoc } from '../../../studio-doc.svelte';
	import ComboBox, { type ComboBoxItem } from '../combo-box.svelte';
	import type { BaseWidgetProp, ContainerPropValue } from '../../../types';
	import type { Frame, FramePropValue } from '../../frame/frame.type';
	import type { SectionPropValue } from '../../section/section.type';
	import * as constraintsUtilVert from '../constraints-util-vert';
	import type { ComputedValue } from '../computed-value-util';
	import * as du from '../doc-util';
	import { bpm } from '../../../breakpoint-man.svelte';
	import * as cmd from '../../../command';
	import { getComputedVal } from '$lib/studio/widgets/common/computed-value-util';

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
		widgetId: string; // 추가
		parentId: string; // 추가
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
		widgetId,
		parentId,
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
		const updatedProps = constraintsUtilVert.calculateHeightConstraints(
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

	function handleHugContents() {
		console.log('hug-contents');
		
		// hug-contents될 정확한 height를 계산함
		const widget = du.findById(widgetId, studioDoc.current) as Frame;
		const calculatedHeight = du.calcFrameHeight(widget, bpm.current);
		
		const baseUpdates: Partial<FramePropValue> = {
			sizeConstraints: {
				...currentProp.sizeConstraints!,
				fullHeight: false,
				hugContentsHeight: true,
			}
		};

		const needsCenterAlign = ['center', 'both', 'scale'].includes(currentProp.vertAlign ?? '');
		if (needsCenterAlign) {
			/*
				both, scale 경우 화면에 따라 height가 결정되는 특성상 hug-contents와 상충하므로 가운데 정렬로 변경함
				center 경우 hug-contents가 지정되는 시점에 height를 한 번만 결정해 주고 centerOffsetY가 다시 계산되어야 함.
			*/
			const adjustedComputedVal = { ...computedVal, height: calculatedHeight };
			const alignProps = constraintsUtilVert.createVertAlignProps("center", currentProp, adjustedComputedVal);
			updateProp({ ...baseUpdates, ...alignProps });
		} else {
			updateProp({ ...baseUpdates, height: calculatedHeight + 'px' });
		}
	}

	function handleFillContainer() {
		console.log('fill-container height');
		
		studioDoc.setBatchMode();
		// 부모의 hugContentsHeight가 true이면 이것을 false로 해제하고, 부모의 height를 고정높이로 설정
		if ("sizeConstraints" in parentProp && parentProp.sizeConstraints?.hugContentsHeight) {
			console.log('부모의 hugContentsHeight를 해제합니다');
			const parent = du.findById(parentId, studioDoc.current);
			if (parent && parent.type === 'frame') {
				let parentComputedVal = getComputedVal(parent as any);
				cmd.cmdFrame.updateProp(parentId, {
					sizeConstraints: {
						...parentProp.sizeConstraints!,
						hugContentsHeight: false,
					},
					height: parentComputedVal.height + 'px',
				}, bpm.current);
			}
		}
		// hugContentsHeight를 해제
		updateProp({
			sizeConstraints: {
				...currentProp.sizeConstraints!,
				fullHeight: true,
				hugContentsHeight: false,
			}
		});
		studioDoc.commitBatch();
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
					hugContentsHeight: false,
				},
				height: computedVal.height + 'px',
			});
		} else if (value === 'hug-contents') {
			handleHugContents();
		} else if (value === 'fill-container') {
			handleFillContainer();
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
	showNameSideBar={currentProp.sizeConstraints?.hasMinHeight || currentProp.sizeConstraints?.hasMaxHeight}
	{icon}
	{value}
	{comboBoxItems}
	{min}
	{max}
	showFill={currentProp.sizeConstraints?.fullHeight ?? false}
	showHugContents={currentProp.sizeConstraints?.hugContentsHeight ?? false}
	onChange={handleValueChange}
	{onDragStart}
	{onDragEnd}
/>
