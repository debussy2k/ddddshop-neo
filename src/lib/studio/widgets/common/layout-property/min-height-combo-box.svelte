<script lang="ts">
    import ComboBox, { type ComboBoxItem } from "../combo-box.svelte";
    import type { BaseWidgetProp, SizeConstraints } from "../../../types";
    import type { FramePropValue } from "../../frame/frame.type";
    import type { SectionPropValue } from "../../section/section.type";
    import type { ComputedValue } from "../computed-value-util";
    import * as constraintsUtilVert from "../constraints-util-vert";

    export type MinHeightComboBoxItemChangeValue = "set-current-height" | "remove-min-height";

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
                handleComboBoxItemChange(value as MinHeightComboBoxItemChangeValue);
            }
        },
        {
            type: 'item',
            label: `최소 높이 제거`,
            value: "remove-min-height",
            onChange: (value:string) => {
                handleComboBoxItemChange(value as MinHeightComboBoxItemChangeValue);
            }
        }
    ])
    
    function handleValueChange(value: number) {
        /*
            만약 vertAlign이 "both" 또는 "scale"이면 vertAlign을 "top"로 변경
        */
       let obj: Partial<BaseWidgetProp> = {};
        if (currentProp.vertAlign === 'both' || currentProp.vertAlign === 'scale') {
            obj = constraintsUtilVert.createVertAlignProps("top", currentProp, computedVal.parentHeight);
        }
        updateProp({ 
            ...obj,
            sizeConstraints: {
                ...sizeConstraints,
                hasMinHeight: true,
                minHeight: value,
            }
        });
    }

    function handleComboBoxItemChange(value: MinHeightComboBoxItemChangeValue) {
        console.log('onMinHeightComboBoxItemChange', value);
        if (value === 'set-current-height') {
            handleValueChange(computedVal.height);
        } else if (value === 'remove-min-height') {
            displayStatus.showMinHeight = false;
            updateProp({
                sizeConstraints: {
                    ...sizeConstraints,
                    hasMinHeight: false,
                    minHeight: 0,
                }
            });
        }
    }

</script>

<ComboBox class={className} {icon} placeholder='Min H' title='Min height' {comboBoxItems} {min} {max} 
    value={ sizeConstraints.hasMinHeight ? value : undefined } 
    onChange={handleValueChange} />
