<script lang="ts">
    import ComboBox, { type ComboBoxItem } from "../combo-box.svelte";
    import type { BaseWidgetProp } from "../../../types";
    import type { FramePropValue } from "../../frame/frame.type";
    import type { SectionPropValue } from "../../section/section.type";
    import type { ComputedValue } from "../computed-value-util";

    export type MinWidthComboBoxItemChangeValue = "set-current-width" | "remove-min-width";

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
        updateProp({ 
            hasMinWidth: true,
            minWidth: value 
        });
    }

    function handleComboBoxItemChange(value: MinWidthComboBoxItemChangeValue) {
        console.log('onMinWidthComboBoxItemChange', value);
        if (value === 'set-current-width') {
            updateProp({ 
                hasMinWidth: true,
                minWidth: computedVal.width 
            });
        } else if (value === 'remove-min-width') {
            displayStatus.showMinWidth = false;
            updateProp({
                hasMinWidth: false,
                minWidth: 0
            });
        }
    }

</script>

<ComboBox class={className} name='w' {icon} {value} {comboBoxItems} {min} {max} onChange={handleValueChange} />
