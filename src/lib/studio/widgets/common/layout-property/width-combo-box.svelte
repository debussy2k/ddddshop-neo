<script lang="ts">
	import { studioDoc } from "../../../studio-doc.svelte";
    import ComboBox, { type ComboBoxItem } from "../combo-box.svelte";
    import type { BaseWidgetProp, ContainerPropValue } from "../../../types";
    import type { FramePropValue } from "../../frame/frame.type";
    import type { SectionPropValue } from "../../section/section.type";
	import * as constraintsUtilHorz from "../constraints-util-horz";
    import type { ComputedValue } from "../computed-value-util";
    import * as du from "../doc-util";

    export type WidthComboBoxItemChangeValue = "select-fixed-width" | "hug-contents" | "fill-container" | "select-min-width" | "add-min-width" | "select-max-width" | "add-max-width" | "delete-min-max";

    type Props = {
		icon?: string; // svg 문자열을 받음
        class?: string;
        value: number;
        currentProp: BaseWidgetProp; // min, max 값이 있는 경우는 frame 밖에 없음.
        parentProp: ContainerPropValue;
        min?: number;
        max?: number;
        updateProp:(newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) => void;
        computedVal: ComputedValue;
        displayStatus: {
            showMinWidth: boolean;
            showMaxWidth: boolean;
        };
    }
    let { class: className, icon, value, currentProp, parentProp, min, max, updateProp, computedVal, displayStatus=$bindable() }: Props = $props();

    let comboBoxItems: ComboBoxItem[] = $derived.by(() => {
        let arr:ComboBoxItem[] = [];

        arr.push(
            {
                type: 'item',
                label: `고정 폭 (${value})`,
                value: "select-fixed-width",
                onChange: (value:string) => {
                    handleComboBoxItemChange(value as WidthComboBoxItemChangeValue);
                }
            },
        )
        if (du.isFlexbox(currentProp)) {
            arr.push(
                {
                    type: 'item',
                    label: `Hug contents`,
                    value: "hug-contents",
                    onChange: (value:string) => {
                        handleComboBoxItemChange(value as WidthComboBoxItemChangeValue);
                    }
                },
            )
        }
        if (du.isFlexbox(parentProp)) {
            arr.push(
                {
                    type: 'item',
                    label: `Fill container`,
                    value: "fill-container",
                }
            )
        }

        arr.push(
            { type: 'divider'},
            {
                type: 'item',
                label: currentProp.sizeConstraints?.hasMinWidth ? `최소 폭: ${currentProp.sizeConstraints.minWidth}` : `최소 폭 추가`,
                value: currentProp.sizeConstraints?.hasMinWidth ? "select-min-width" : "add-min-width",
                onChange: (value:string) => {
                    handleComboBoxItemChange(value as WidthComboBoxItemChangeValue);
                }
            },
            {
                type: 'item',
                label: currentProp.sizeConstraints?.hasMaxWidth ? `최대 폭: ${currentProp.sizeConstraints.maxWidth}` : `최대 폭 추가`,
                value: currentProp.sizeConstraints?.hasMaxWidth ? "select-max-width" : "add-max-width",
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
        )

        return arr;
    });
    
    function handleValueChange(value: number) {
		const updatedProps = constraintsUtilHorz.updateWidthConstraints(value, currentProp, computedVal);
        updateProp(updatedProps);
    }

    function handleComboBoxItemChange(value: WidthComboBoxItemChangeValue) {
		console.log('onWidthComboBoxItemChange', value);
		if (value === 'select-fixed-width') {
			console.log('select-fixed-width');
		} else if (value === 'hug-contents') {
			console.log('hug-contents');
		} else if (value === 'fill-container') {
			console.log('fill-container');
		} else if (value === 'select-min-width' || value === 'add-min-width') {
			displayStatus.showMinWidth = true;
		} else if (value === 'select-max-width' || value === 'add-max-width') {
			displayStatus.showMaxWidth = true;
		} else if (value === 'delete-min-max') {
			displayStatus.showMinWidth = false;
			displayStatus.showMaxWidth = false;
			updateProp({
				sizeConstraints: {
					hasMinWidth: false,
					minWidth: 0,
					hasMaxWidth: false,
					maxWidth: 0,
					hasMinHeight: currentProp.sizeConstraints?.hasMinHeight || false,
					minHeight: currentProp.sizeConstraints?.minHeight || 0,
					hasMaxHeight: currentProp.sizeConstraints?.hasMaxHeight || false,
					maxHeight: currentProp.sizeConstraints?.maxHeight || 0
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

<ComboBox class={className} name='W' {icon} {value} {comboBoxItems} {min} {max} onChange={handleValueChange} onDragStart={onDragStart} onDragEnd={onDragEnd} />