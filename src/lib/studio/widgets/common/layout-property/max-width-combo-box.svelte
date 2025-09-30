<script lang="ts">
    import ComboBox, { type ComboBoxItem } from "../combo-box.svelte";
    import type { BaseWidgetProp } from "../../../types";
    import type { FramePropValue } from "../../frame/frame.type";
    import type { SectionPropValue } from "../../section/section.type";
    import type { ComputedValue } from "../computed-value-util";
    import * as constraintsUtilHorz from "../constraints-util-horz";

    export type MaxWidthComboBoxItemChangeValue = "set-current-width" | "remove-max-width";

    interface Props {
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
            label: `현재 width로 설정 (${computedVal.width})`,
            value: "set-current-width",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as MaxWidthComboBoxItemChangeValue);
            }
        },
        {
            type: 'item',
            label: `최대 폭 제거`,
            value: "remove-max-width",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as MaxWidthComboBoxItemChangeValue);
            }
        }
    ])
    
    function handleValueChange(value: number) {
        /*
            만약 horzAlign이 "both" 또는 "scale"이면 horzAlign을 "left"로 변경
        */
       let obj: Partial<BaseWidgetProp> = {};
        if (currentProp.horzAlign === 'both' || currentProp.horzAlign === 'scale') {
            obj = constraintsUtilHorz.createHorzAlignProps("left", currentProp, computedVal.parentWidth);
        }
        updateProp({ 
            ...obj,
            hasMaxWidth: true,
            maxWidth: value 
        });
    }

    function handleComboBoxItemChange(value: MaxWidthComboBoxItemChangeValue) {
        console.log('onMaxWidthComboBoxItemChange', value);
        if (value === 'set-current-width') {
            handleValueChange(computedVal.width);

        } else if (value === 'remove-max-width') {
            displayStatus.showMaxWidth = false;
            updateProp({
                hasMaxWidth: false,
                maxWidth: 0
            });
        }
    }

</script>

<ComboBox class={className} {icon} placeholder='Max W' title='Max width' {comboBoxItems} {min} {max} 
    value={ currentProp.hasMaxWidth ? value : undefined } 
    onChange={handleValueChange} />
