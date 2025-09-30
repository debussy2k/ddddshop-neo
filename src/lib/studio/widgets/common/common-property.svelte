<script lang="ts">
	import { onMount } from "svelte";
	import { JsonView } from "@zerodevx/svelte-json-view";
    import { studioDoc } from "../../studio-doc.svelte";
    import type { Cmd } from "$lib/studio/command";
    import { bpm } from "../../breakpoint-man.svelte";
    import type { Widget, BaseWidgetProp, HorizontalAlign, VerticalAlign, LayoutType } from "../../types";
	import type { SectionPropValue } from "../../widgets/section/section.type";
	import type { FramePropValue } from "../../widgets/frame/frame.type";
	import type { ComputedValue } from "./computed-value-util";
    import HorzAlignSelector from "../common/horz-align-button-group.svelte";
    import VertAlignSelector from "../common/vert-align-button-group.svelte";
    import InputVal from "../common/input-val.svelte";
	import WidthComboBox, { type WidthComboBoxItemChangeValue } from "./width-combo-box.svelte";
    import HorzAlignDropdownBox from "./horz-align-dropdown-box.svelte";
    import VertAlignDropdownBox from "./vert-align-dropdown-box.svelte";
    import LayoutSelector from "../common/layout-selector.svelte";
	import * as constraintsUtilHorz from "../common/constraints-util-horz";
    import * as constraintsUtilVert from "../common/constraints-util-vert";
    import JustifyContentDropdownBox from "./justify-content-dropdown-box.svelte";
    import AlignItemsDropdownBox from "./align-items-dropdown-box.svelte";
    import { MiniToggleButton } from "$lib/components/ui/min-button";
	import FlexWrapIcon from "$lib/components/ui/min-button/flex-wrap.svg?raw";
	import PadingXIcon from "$lib/assets/studio/padding-x.svg?raw";
	import PadingYIcon from "$lib/assets/studio/padding-y.svg?raw";
	import MinWidthIcon from "$lib/assets/studio/min-width.svg?raw";
	import MaxWidthIcon from "$lib/assets/studio/max-width.svg?raw";

	interface Props {
		data: Widget;
		cmd: Cmd;
		currentProp: BaseWidgetProp | FramePropValue; // Section은 common-property를 사용하지 않음
		parentProp: SectionPropValue | FramePropValue;
		computedVal: ComputedValue;
	}
	let {data, cmd, currentProp, parentProp, computedVal	}: Props = $props();	

    let parentComp: any = studioDoc.getWidget<any>(data.parentId);
	
	let displayStatus = $state({
		showMinWidth: false,
		showMaxWidth: false,
	})

	onMount(() => {
		if (isFlexbox(currentProp) && currentProp.hasMinWidth) {
			displayStatus.showMinWidth = true;
		}
	})


	// 타입 가드 함수 추가
	function isContainerProps(prop: BaseWidgetProp | FramePropValue | SectionPropValue): prop is FramePropValue | SectionPropValue {
		return 'layout' in prop;
	}	
	function isFlexbox(prop: BaseWidgetProp | FramePropValue | SectionPropValue): prop is FramePropValue | SectionPropValue {
		return isContainerProps(prop) && (prop.layout === 'flex-row' || prop.layout === 'flex-col');
	}	
	function isFlexboxRow(prop: BaseWidgetProp | FramePropValue | SectionPropValue): prop is FramePropValue | SectionPropValue {
		return isFlexbox(prop) && prop.layout === 'flex-row';
	}

	function updateProp(newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) {
		cmd.updateProp(data.id, newProp, bpm.current);
	}

	function onChangeLayout(newLayout: LayoutType) {
		let obj: Partial<FramePropValue | SectionPropValue> = {
			layout: newLayout,
			wrap: false,
		}
		// 기존 값이 flexbox가 아닌 경우 아래 값으로 초기화
		// gap과 verticalGap를 10으로 설정, justifyContent와 alignItems를 start로 설정
		if (!isFlexbox(currentProp)) {
			obj = { ...obj, 
				justifyContent: "start",
				alignItems: "start",						
				gap: 10, 
				verticalGap: 10 
			};
		}
		updateProp(obj);

	}

    function updateHorzAlign(newHorzAlign: HorizontalAlign) {
		if (parentComp === null) {
			console.error(`parent not found for sandbox`, data.id);
			return;
		}
		let obj = constraintsUtilHorz.createHorzAlignProps(newHorzAlign, currentProp, computedVal.parentWidth);

		cmd.updateProp(data.id, obj, bpm.current);
    }

    function updateVertAlign(newVertAlign: VerticalAlign) {
        if (parentComp === null) {
            console.error(`parent not found for sandbox`, data.id);
            return;
        }
        let obj = constraintsUtilVert.createVertAlignProps(newVertAlign, currentProp, computedVal.parentHeight);

        cmd.updateProp(data.id, obj, bpm.current);
    }
	
	function updateLeftProp(newLeft: number) {
		const updatedProps = constraintsUtilHorz.updateLeftConstraints(newLeft, currentProp, computedVal);
		updateProp(updatedProps);
	}
	function updateTopProp(newTop: number) {
		const updatedProps = constraintsUtilVert.updateTopConstraints(newTop, currentProp, computedVal);
		updateProp(updatedProps);
	}

	function updateWidthProp(newWidth: number) {
		const updatedProps = constraintsUtilHorz.updateWidthConstraints(newWidth, currentProp, computedVal);
		updateProp(updatedProps);
	}

	function updateHeightProp(newHeight: number) {
		const updatedProps = constraintsUtilVert.updateHeightConstraints(newHeight, currentProp, computedVal);
		updateProp(updatedProps);
	}

</script>

<!-- Position -->
<div class='px-3 py-4 text-xs border-b border-gray-200'>
	<div class="mb-3">위치</div>
	<div class="flex flex-col gap-y-2">
		<div class="flex items-center gap-2">
			<HorzAlignSelector align={"left"} class='flex-1' disabled={isFlexbox(parentProp)}/>
			<VertAlignSelector align={"top"} class='flex-1' disabled={isFlexbox(parentProp)}/>
		</div>

		<div class='flex gap-x-2'>
			<InputVal name='X' value={computedVal.left} disabled={isFlexbox(parentProp)} onChange={value => updateLeftProp(value as number)}/>
			<InputVal name='Y' value={computedVal.top} disabled={isFlexbox(parentProp)} onChange={value => updateTopProp(value as number)}/>
		</div>

		<!-- 부모가 block인 경우만 보여줌 -->
		{#if parentProp.layout === 'block'}
			<div class='flex gap-x-2'>
				<div class='w-1/2 min-w-0 space-y-2'>
					<HorzAlignDropdownBox value={currentProp.horzAlign} onChange={updateHorzAlign}/>
					<VertAlignDropdownBox value={currentProp.vertAlign} onChange={updateVertAlign}/>
				</div>
				<div class='w-1/2 min-w-0'>
					
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Layout -->
<div class='px-3 py-4 text-xs border-b border-gray-200'>
	<div class="mb-3">레이아웃</div>

	<div class="flex flex-col gap-y-2">
		{#if isContainerProps(currentProp)}
			<div class='flex gap-x-2'>
				<LayoutSelector layout={currentProp.layout} onChange={onChangeLayout} class='flex-1 min-w-0'/>
               	<MiniToggleButton icon={FlexWrapIcon} title="wrap" 
					class={!isFlexboxRow(currentProp) ? 'invisible' : ''}
					toggled={currentProp.wrap} onToggle={value => updateProp({ wrap: value })}/>
			</div>
		{/if}

		<div class="flex flex-col gap-y-2">
			<div class='flex gap-x-2'>
				{#if isContainerProps(currentProp)}
					<!-- Auto layout일 때의 Width UI -->
					<div class='flex-1 min-w-0 space-y-2'>
						<!-- width -->
						<WidthComboBox value={computedVal.width} 
							{currentProp} {updateProp} {computedVal}
							bind:displayStatus={displayStatus}
							/>
						<!-- min width -->
						{#if displayStatus.showMinWidth}
							<InputVal icon={MinWidthIcon} value={currentProp.minWidth} onChange={value => {
								updateProp({ 
									hasMinWidth: true,
									minWidth: value as number 
								})}
							}/>
						{/if}
						<!-- max width -->
						{#if displayStatus.showMaxWidth}
							<InputVal icon={MaxWidthIcon} value={currentProp.maxWidth} onChange={value => {
								updateProp({ 
									hasMaxWidth: true,
									maxWidth: value as number 
								})}
							}/>
						{/if}
					</div>
					<div class='flex-1 min-w-0'>
						<InputVal name='H' value={computedVal.height} onChange={value => updateHeightProp(value as number)}/>
					</div>
				{:else}
					<!-- Freeform layout 일때의 Width/Height UI -->
					<InputVal name='W' value={computedVal.width} onChange={value => updateWidthProp(value as number)}/>
					<InputVal name='H' value={computedVal.height} onChange={value => updateHeightProp(value as number)}/>
				{/if}
			</div>
		</div>

		{#if isContainerProps(currentProp) && isFlexbox(currentProp)}
			<div class="flex flex-col gap-y-2">
				<div class='flex gap-x-2'>
					<div class='w-1/2 min-w-0 space-y-2'>
						<JustifyContentDropdownBox class='flex-1' value={currentProp.justifyContent} onChange={value => updateProp({ justifyContent: value })}/>
						<AlignItemsDropdownBox class='' value={currentProp.alignItems} onChange={value => updateProp({ alignItems: value })}/>
					</div>
					<div class='w-1/2 min-w-0 space-y-2'>
						<!-- gap 조정 공간 -->
						 {#if isFlexbox(currentProp)}
							<InputVal name='G' value={currentProp.gap} min={0} onChange={value => updateProp({ gap: value as number })}/>
						{/if}
						{#if isFlexboxRow(currentProp) && currentProp.wrap}
							<InputVal name='V' value={currentProp.verticalGap} min={0} onChange={value => updateProp({ verticalGap: value as number })}/>
						{/if}
					</div>
				</div>

				<!-- padding 조절 공간 -->
				<div class='flex gap-x-2'>
					<InputVal icon={PadingXIcon} value={currentProp.paddingLeft} min={0} 
						onChange={value => updateProp({ 
							paddingLeft: value as number,
							paddingRight: value as number
						})}
					/>
					<InputVal icon={PadingYIcon} value={currentProp.paddingTop} min={0} 
						onChange={value => updateProp({ 
							paddingTop: value as number,
							paddingBottom: value as number
						})}
					/>
				</div>

			</div>
		{/if}
	</div>
</div>

<div class='px-3 py-4 text-xs border-b border-gray-200'>
	<div class="mb-3">정보</div>
	<div class='overflow-x-scroll'>
		<JsonView json={currentProp}/>
	</div>
</div>

<div class='px-3 py-4 text-xs border-b border-gray-200'>
	<div class="mb-3">계산된 값</div>
	<div class='overflow-x-scroll'>
		<JsonView json={computedVal}/>
	</div>
</div>

<div class='px-3 py-4 text-xs border-b border-gray-200'>
	<div class="mb-3">표시 상태</div>
	<div class='overflow-x-scroll'>
		<JsonView json={displayStatus}/>
	</div>
</div>
