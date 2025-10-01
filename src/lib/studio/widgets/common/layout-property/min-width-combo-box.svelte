<script lang="ts">
    import ComboBox, { type ComboBoxItem } from "../combo-box.svelte";
    import type { BaseWidgetProp, SizeConstraints } from "../../../types";
    import type { FramePropValue } from "../../frame/frame.type";
    import type { SectionPropValue } from "../../section/section.type";
    import type { ComputedValue } from "../computed-value-util";
    import * as constraintsUtilHorz from "../constraints-util-horz";

    export type MinWidthComboBoxItemChangeValue = "set-current-width" | "remove-min-width";

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
            showMinWidth: boolean;
            showMaxWidth: boolean;
        };
    }
    let { class: className, icon, value, currentProp, sizeConstraints, min, max, updateProp, computedVal, displayStatus=$bindable() }: Props = $props();

    let comboBoxItems: ComboBoxItem[] = $derived([
        {
            type: 'item',
            label: `현재 width로 설정 (${computedVal.width})`,
            value: "set-current-width",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as MinWidthComboBoxItemChangeValue);
            }
        },
        {
            type: 'item',
            label: `최소 폭 제거`,
            value: "remove-min-width",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as MinWidthComboBoxItemChangeValue);
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
            sizeConstraints: {
                ...sizeConstraints,
                hasMinWidth: true,
                minWidth: value,
            }
        });
    }

    function handleComboBoxItemChange(value: MinWidthComboBoxItemChangeValue) {
        console.log('onMinWidthComboBoxItemChange', value);
        if (value === 'set-current-width') {
            handleValueChange(computedVal.width);
        } else if (value === 'remove-min-width') {
            displayStatus.showMinWidth = false;
            updateProp({
                sizeConstraints: {
                    ...sizeConstraints,
                    hasMinWidth: false,
                    minWidth: 0,
                }
            });
        }
    }

</script>

<ComboBox class={className} {icon} placeholder='Min W' title='Min width' {comboBoxItems} {min} {max} 
    value={ sizeConstraints.hasMinWidth ? value : undefined } 
    onChange={handleValueChange} />
