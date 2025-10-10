<script lang="ts">
	import { studioDoc } from "../../../studio-doc.svelte";
    import ComboBox, { type ComboBoxItem } from "../combo-box.svelte";
    import type { BaseWidgetProp, ContainerPropValue } from "../../../types";
    import type { FramePropValue } from "../../frame/frame.type";
    import type { SectionPropValue } from "../../section/section.type";
	import * as constraintsUtilHorz from "../constraints-util-horz";
    import type { ComputedValue } from "../computed-value-util";
    import * as du from "../doc-util";
    import { bpm } from "../../../breakpoint-man.svelte";
    import * as cmd from "../../../command";
	import { getComputedVal } from "$lib/studio/widgets/common/computed-value-util";

    export type WidthComboBoxItemChangeValue = "select-fixed-width" | "hug-contents" | "fill-container" | "select-min-width" | "add-min-width" | "select-max-width" | "add-max-width" | "delete-min-max";

    type Props = {
		icon?: string; // svg 문자열을 받음
        class?: string;
        value: number;
        currentProp: BaseWidgetProp; // min, max 값이 있는 경우는 frame 밖에 없음.
        parentProp: ContainerPropValue;
		widgetId: string;  // 추가
		parentId: string;  // 추가
        min?: number;
        max?: number;
        updateProp:(newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) => void;
        computedVal: ComputedValue;
        displayStatus: {
            showMinWidth: boolean;
            showMaxWidth: boolean;
        };
    }
    let { class: className, icon, value, currentProp, parentProp, widgetId, parentId, min, max, updateProp, computedVal, displayStatus=$bindable() }: Props = $props();
	let isHovering = $state(false);

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
					onChange: (value:string) => {
						handleComboBoxItemChange(value as WidthComboBoxItemChangeValue);
					}
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

		// height가 변경되었을 때 fullHeight 속성이 있으면 fullHeight를 false로 설정
		if (currentProp.sizeConstraints?.fullWidth) {
			updateProp({
				...updatedProps,
				sizeConstraints: {
					...currentProp.sizeConstraints,
					fullWidth: false,
				}
			});
		}
		else {
			updateProp(updatedProps);
		}
    }

    function handleComboBoxItemChange(value: WidthComboBoxItemChangeValue) {
		console.log('onWidthComboBoxItemChange', value);
		if (!currentProp.sizeConstraints) {
			console.error('currentProp.sizeConstraints is undefined');
			return;
		}

		if (value === 'select-fixed-width') {
			console.log('select-fixed-width');
			updateProp({
				sizeConstraints: {
					...currentProp.sizeConstraints,
					fullWidth: false,
					hugContentsWidth: false,
				},
				width: computedVal.width + 'px',
			});
		} else if (value === 'hug-contents') {
			console.log('hug-contents');
			let updates: Partial<FramePropValue> = {
				sizeConstraints: {
					...currentProp.sizeConstraints,
					fullWidth: false,
					hugContentsWidth: true,
				}
			};

			// hug-contents시 가로정렬이 both 또는 scale인 경우 center로 변경 
			// (scale 및 center는 화면에 따라 width가 변경되어 hug-contents와 상충하므로 가운데 정렬로 변경함)
			if (currentProp.horzAlign === 'both' || currentProp.horzAlign === 'scale') {
				let obj = constraintsUtilHorz.createHorzAlignProps("center", currentProp, computedVal);
				updates = {
					...updates,
					...obj,
				}
			}

			updateProp(updates);
		} else if (value === 'fill-container') {
			console.log('fill-container width');
			
			studioDoc.setBatchMode();
			// 부모의 hugContentsWidth가 true이면 이것을 false로 해제하고, 부모의 width를 고정폭으로 설정
			if ("sizeConstraints" in parentProp && parentProp.sizeConstraints?.hugContentsWidth) {
				console.log('부모의 hugContentsWidth를 해제합니다');
				const parent = du.findById(parentId, studioDoc.current);
				if (parent && parent.type === 'frame') {
					let parentComputedVal = getComputedVal(parent as any);
					cmd.cmdFrame.updateProp(parentId, {
						sizeConstraints: {
							...parentProp.sizeConstraints,
							hugContentsWidth: false,
						},
						width: parentComputedVal.width + 'px',
					}, bpm.current);
				}
			}
			// hugContentsWidth를 해제
			updateProp({
				sizeConstraints: {
					...currentProp.sizeConstraints,
					fullWidth: true,
					hugContentsWidth: false,
				}
			});
			studioDoc.commitBatch();
		} else if (value === 'select-min-width' || value === 'add-min-width') {
			displayStatus.showMinWidth = true;
		} else if (value === 'select-max-width' || value === 'add-max-width') {
			displayStatus.showMaxWidth = true;
		} else if (value === 'delete-min-max') {
			displayStatus.showMinWidth = false;
			displayStatus.showMaxWidth = false;
			updateProp({
				sizeConstraints: {
					...currentProp.sizeConstraints,
					hasMinWidth: false,
					minWidth: 0,
					hasMaxWidth: false,
					maxWidth: 0,
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
	name='W' 
	{icon} 
	{value} 
	{comboBoxItems} 
	{min} 
	{max} 
	showFill={currentProp.sizeConstraints?.fullWidth ?? false}
	onChange={handleValueChange} 
	onDragStart={onDragStart} 
	onDragEnd={onDragEnd} 
/>