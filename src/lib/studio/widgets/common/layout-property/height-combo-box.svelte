<script lang="ts">
    import ComboBox, { type ComboBoxItem } from "../combo-box.svelte";
    import type { BaseWidgetProp } from "../../../types";
    import type { FramePropValue } from "../../frame/frame.type";
    import type { SectionPropValue } from "../../section/section.type";
	import * as constraintsUtilVert from "../constraints-util-vert";
    import type { ComputedValue } from "../computed-value-util";

    export type HeightComboBoxItemChangeValue = "select-fixed-height" | "hug-contents" | "select-min-height" | "add-min-height" | "select-max-height" | "add-max-height" | "delete-min-max";

    type Props = {
		icon?: string; // svg 문자열을 받음
        class?: string;
        value: number;
        currentProp: FramePropValue; // min, max 값이 있는 경우는 frame 밖에 없음.
        min?: number;
        max?: number;
        updateProp:(newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) => void;
        computedVal: ComputedValue;
        displayStatus: {
            showMinHeight: boolean;
            showMaxHeight: boolean;
        };
    }
    let { class: className, icon, value, currentProp, min, max, updateProp, computedVal, displayStatus=$bindable() }: Props = $props();

    let comboBoxItems: ComboBoxItem[] = $derived([
        {
            type: 'item',
            label: `고정 높이 (${value})`,
            value: "select-fixed-height",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as HeightComboBoxItemChangeValue);
            }
        },
        {
            type: 'item',
            label: `콘텐츠 맞춤`,
            value: "hug-contents",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as HeightComboBoxItemChangeValue);
            }
        },
        { type: 'divider'},
        {
            type: 'item',
            label: currentProp.hasMinHeight ? `최소 높이: ${currentProp.minHeight}` : `최소 높이 추가`,
            value: currentProp.hasMinHeight ? "select-min-height" : "add-min-height",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as HeightComboBoxItemChangeValue);
            }
        },
        {
            type: 'item',
            label: currentProp.hasMaxHeight ? `최대 높이 (${currentProp.maxHeight})` : `최대 높이 추가`,
            value: currentProp.hasMaxHeight ? "select-max-height" : "add-max-height",
            onChange: (value: string) => {
                handleComboBoxItemChange(value as HeightComboBoxItemChangeValue);
            }
        },
        { type: 'divider'},
        {
            type: 'item',
            label: `최소/최대값 삭제`,
            value: "delete-min-max",
            onChange: (value: string) => {
                handleComboBoxItemChange(value as HeightComboBoxItemChangeValue);
            }
        }
    ])
    
    function handleValueChange(value: number) {
		const updatedProps = constraintsUtilVert.updateHeightConstraints(value, currentProp, computedVal);
        updateProp(updatedProps);
    }

    function handleComboBoxItemChange(value: HeightComboBoxItemChangeValue) {
		console.log('onHeightComboBoxItemChange', value);
		if (value === 'select-fixed-height') {
			// 
		} else if (value === 'hug-contents') {
			//
		} else if (value === 'select-min-height' || value === 'add-min-height') {
			displayStatus.showMinHeight = true;
		} else if (value === 'select-max-height' || value === 'add-max-height') {
			displayStatus.showMaxHeight = true;
		} else if (value === 'delete-min-max') {
			displayStatus.showMinHeight = false;
			displayStatus.showMaxHeight = false;
			updateProp({
				hasMinHeight: false,
				minHeight: 0,
				hasMaxHeight: false,
				maxHeight: 0
			});
		}
    }

</script>

<ComboBox class={className} name='H' {icon} {value} {comboBoxItems} {min} {max} onChange={handleValueChange} />
