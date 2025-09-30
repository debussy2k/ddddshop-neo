<script lang="ts">
    import ComboBox, { type ComboBoxItem } from "../combo-box.svelte";
    import type { BaseWidgetProp } from "../../../types";
    import type { FramePropValue } from "../../frame/frame.type";
    import type { SectionPropValue } from "../../section/section.type";
	import * as constraintsUtilHorz from "../constraints-util-horz";
    import type { ComputedValue } from "../computed-value-util";

    export type WidthComboBoxItemChangeValue = "select-fixed-width" | "hug-contents" | "select-min-width" | "add-min-width" | "select-max-width" | "add-max-width" | "delete-min-max";

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
            showMinWidth: boolean;
            showMaxWidth: boolean;
        };
    }
    let { class: className, icon, value, currentProp, min, max, updateProp, computedVal, displayStatus=$bindable() }: Props = $props();

    let comboBoxItems: ComboBoxItem[] = $derived([
        {
            type: 'item',
            label: `고정 폭 (${value})`,
            value: "select-fixed-width",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as WidthComboBoxItemChangeValue);
            }
        },
        {
            type: 'item',
            label: `콘텐츠 맞춤`,
            value: "hug-contents",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as WidthComboBoxItemChangeValue);
            }
        },
        { type: 'divider'},
        {
            type: 'item',
            label: currentProp.hasMinWidth ? `최소 폭: ${currentProp.minWidth}` : `최소 폭 추가`,
            value: currentProp.hasMinWidth ? "select-min-width" : "add-min-width",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as WidthComboBoxItemChangeValue);
            }
        },
        {
            type: 'item',
            label: currentProp.hasMaxWidth ? `최대 폭 (${currentProp.maxWidth})` : `최대 폭 추가`,
            value: currentProp.hasMaxWidth ? "select-max-width" : "add-max-width",
            onChange: (value: string) => {
                handleComboBoxItemChange(value as WidthComboBoxItemChangeValue);
            }
        },
        { type: 'divider'},
        {
            type: 'item',
            label: `최소/최대값 삭제`,
            value: "delete-min-max",
            onChange: (value: string) => {
                handleComboBoxItemChange(value as WidthComboBoxItemChangeValue);
            }
        }
    ])
    
    function handleValueChange(value: number) {
		const updatedProps = constraintsUtilHorz.updateWidthConstraints(value, currentProp, computedVal);
        updateProp(updatedProps);
    }

    function handleComboBoxItemChange(value: WidthComboBoxItemChangeValue) {
		console.log('onWidthComboBoxItemChange', value);
		if (value === 'select-fixed-width') {
			// 
		} else if (value === 'hug-contents') {
			//
		} else if (value === 'select-min-width' || value === 'add-min-width') {
			displayStatus.showMinWidth = true;
		} else if (value === 'select-max-width' || value === 'add-max-width') {
			displayStatus.showMaxWidth = true;
		} else if (value === 'delete-min-max') {
			displayStatus.showMinWidth = false;
			displayStatus.showMaxWidth = false;
			updateProp({
				hasMinWidth: false,
				minWidth: 0,
				hasMaxWidth: false,
				maxWidth: 0
			});
		}
    }

</script>

<ComboBox class={className} name='W' {icon} {value} {comboBoxItems} {min} {max} onChange={handleValueChange} />