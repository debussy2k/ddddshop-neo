<script lang="ts">
    import ComboBox, { type ComboBoxItem } from "./combo-box.svelte";

    interface WidthProps {
        hasMinWidth: boolean;
		minWidth: number;
		hasMaxWidth: boolean;
		maxWidth: number;      
    }

    export type WidthComboBoxItemChangeValue = "select-fixed-width" | "hug-contents" | "select-min-width" | "add-min-width" | "select-max-width" | "add-max-width" | "delete-min-max";

    type Props = {
        name?: string;
		icon?: string; // svg 문자열을 받음
        class?: string;
        value: number;
        widthProps: WidthProps;
        min?: number;
        max?: number;
        onChange?: (value: number) => void;
        onComboBoxItemChange?: (value: WidthComboBoxItemChangeValue) => void;
    }
    let { class: className, name, icon, value, widthProps, min, max, onChange, onComboBoxItemChange }: Props = $props();

    let comboBoxItems: ComboBoxItem[] = $derived([
        {
            type: 'item',
            label: `고정 폭 (${value})`,
            value: "select-fixed-width",
            onChange: (value:string) => {
                onComboBoxItemChange && onComboBoxItemChange(value as WidthComboBoxItemChangeValue);
            }
        },
        {
            type: 'item',
            label: widthProps.hasMinWidth ? `최소 폭: ${widthProps.minWidth}` : `최소 폭 추가`,
            value: widthProps.hasMinWidth ? "select-min-width" : "add-min-width",
            onChange: (value:string) => {
                onComboBoxItemChange && onComboBoxItemChange(value as WidthComboBoxItemChangeValue);
            }
        },
        {
            type: 'item',
            label: widthProps.hasMaxWidth ? `최대 폭 (${widthProps.maxWidth})` : `최대 폭 추가`,
            value: widthProps.hasMaxWidth ? "select-max-width" : "add-max-width",
            onChange: (value: string) => {
                onComboBoxItemChange && onComboBoxItemChange(value as WidthComboBoxItemChangeValue);
            }
        },
        { type: 'divider'},
        {
            type: 'item',
            label: `최소/최대값 삭제`,
            value: "delete-min-max",
            onChange: (value: string) => {
                onComboBoxItemChange && onComboBoxItemChange(value as WidthComboBoxItemChangeValue);
            }
        }
    ])
    
</script>

<ComboBox class={className} {name} {icon} {value} {comboBoxItems} {min} {max} onChange={onChange} />