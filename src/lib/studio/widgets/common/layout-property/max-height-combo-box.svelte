<script lang="ts">
    import { studioDoc } from "../../../studio-doc.svelte";
    import ComboBox, { type ComboBoxItem } from "../combo-box.svelte";
    import type { BaseWidgetProp, SizeConstraints } from "../../../types";
    import type { FramePropValue } from "../../frame/frame.type";
    import type { SectionPropValue } from "../../section/section.type";
    import type { ComputedValue } from "../computed-value-util";
    import * as constraintsUtilVert from "../constraints-util-vert";

    export type MaxHeightComboBoxItemChangeValue = "set-current-height" | "remove-max-height";

    interface Props {
        icon?: string; // svg 문자열을 받음
        class?: string;
        value: number;
        currentProp: BaseWidgetProp;
        sizeConstraints: SizeConstraints;
        min?: number;
        max?: number;
        updateProp:(newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) => void;
        computedVal: ComputedValue;
        displayStatus: {
            showMinHeight: boolean;
            showMaxHeight: boolean;
        };
    }
    let { class: className, icon, value, currentProp, sizeConstraints, min, max, updateProp, computedVal, displayStatus=$bindable() }: Props = $props();

    let comboBoxItems: ComboBoxItem[] = $derived([
        {
            type: 'item',
            label: `현재 height로 설정 (${computedVal.height})`,
            value: "set-current-height",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as MaxHeightComboBoxItemChangeValue);
            }
        },
        {
            type: 'item',
            label: `최대 높이 제거`,
            value: "remove-max-height",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as MaxHeightComboBoxItemChangeValue);
            }
        }
    ])
    
    function handleValueChange(value: number) {
        /*
            만약 vertAlign이 "both" 또는 "scale"이면 vertAlign을 "top"로 변경
        */
       let obj: Partial<BaseWidgetProp> = {};
        if (currentProp.vertAlign === 'both' || currentProp.vertAlign === 'scale') {
            obj = constraintsUtilVert.createVertAlignProps("top", currentProp, computedVal);
        }
        updateProp({ 
            ...obj,
            sizeConstraints: {
                ...sizeConstraints,
                hasMaxHeight: true,
                maxHeight: value
            }
        });
    }

    function handleComboBoxItemChange(value: MaxHeightComboBoxItemChangeValue) {
        console.log('onMaxHeightComboBoxItemChange', value);
        if (value === 'set-current-height') {
            handleValueChange(computedVal.height);
        } else if (value === 'remove-max-height') {
            displayStatus.showMaxHeight = false;
            updateProp({
                sizeConstraints: {
                    ...sizeConstraints,
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

<ComboBox class={className} {icon} placeholder='Max H' title='Max height' {comboBoxItems} {min} {max} 
    value={ sizeConstraints.hasMaxHeight ? value : undefined } 
    onChange={handleValueChange} 
	onDragStart={onDragStart} onDragEnd={onDragEnd} 
/>
