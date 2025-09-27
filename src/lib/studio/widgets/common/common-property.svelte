<script lang="ts">
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
    import HorzAlignDropdownBox from "./horz-align-dropdown-box.svelte";
    import VertAlignDropdownBox from "./vert-align-dropdown-box.svelte";
    import LayoutSelector from "../common/layout-selector.svelte";
	import { constraintsUtilHorz } from "../common/constraints-util-horz";
    import { constraintsUtilVert } from "../common/constraints-util-vert";
    import JustifyContentDropdownBox from "./justify-content-dropdown-box.svelte";
    import AlignItemsDropdownBox from "./align-items-dropdown-box.svelte";
    import { MiniToggleButton } from "$lib/components/ui/min-button";
	import FlexWrapIcon from "$lib/components/ui/min-button/flex-wrap.svg?raw";

	interface Props {
		data: Widget;
		cmd: Cmd;
		currentProp: BaseWidgetProp | FramePropValue; // Section은 common-property를 사용하지 않음
		parentProp: SectionPropValue | FramePropValue | undefined;
		computedVal: ComputedValue;
	}
	let {data, cmd, currentProp, parentProp, computedVal	}: Props = $props();	

    let parentComp: any = studioDoc.getWidget<any>(data.parentId);

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

	function updateLayout(newLayout: LayoutType) {
        cmd.updateProp(data.id, { layout: newLayout }, bpm.current);
    }

	function updateProp(newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) {
		cmd.updateProp(data.id, newProp, bpm.current);
	}
</script>

<!-- Position -->
<div class='px-3 py-4 text-xs border-b border-gray-200'>
	<div class="mb-3">위치</div>
	<div class="flex flex-col gap-y-2">
		<div class="flex items-center gap-2">
			<HorzAlignSelector align={"left"} class='flex-1'/>
			<VertAlignSelector align={"top"} class='flex-1'/>
		</div>

		<div class='flex gap-x-2'>
			<InputVal name='X' value={computedVal.left} onChange={value =>updateProp({ left: value + 'px' })}/>
			<InputVal name='Y' value={computedVal.top} onChange={value =>updateProp({ top: value + 'px' })}/>
		</div>

		<!-- 부모가 block인 경우만 보여줌 -->
		{#if parentProp?.layout === 'block'}
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
				<LayoutSelector layout={currentProp.layout}  onChange={value => {
					let obj: Partial<FramePropValue | SectionPropValue> = {
						layout: value,
						wrap: false,
					}
					// 기존 값이 flexbox가 아닌 경우 gap과 verticalGap를 10으로 설정
					if (!isFlexbox(currentProp)) {
						obj = { ...obj, gap: 10, verticalGap: 10 };
					}
					updateProp(obj);
					
				}} class='flex-1 min-w-0'/>
               	<MiniToggleButton icon={FlexWrapIcon} title="wrap" 
					class={!isFlexboxRow(currentProp) ? 'invisible' : ''}
					toggled={currentProp.wrap} onToggle={value => updateProp({ wrap: value })}/>
			</div>
		{/if}

		<div class="flex flex-col gap-y-2">
			<div class='flex gap-x-2'>
				<InputVal name='W' value={computedVal.width} onChange={value => updateProp({ width: value + 'px' })}/>
				<InputVal name='H' value={computedVal.height} onChange={value => updateProp({ height: value + 'px' })}/>
			</div>
		</div>

		{#if isContainerProps(currentProp)}
			<div class="flex flex-col gap-y-2">
				<div class='flex gap-x-2'>
					<div class='w-1/2 min-w-0 space-y-2'>
						<JustifyContentDropdownBox class='flex-1' value={currentProp.justifyContent} onChange={value =>updateProp({ justifyContent: value })}/>
						<AlignItemsDropdownBox class='' value={currentProp.alignItems} onChange={value =>updateProp({ alignItems: value })}/>
					</div>
					<div class='w-1/2 min-w-0 space-y-2'>
						<!-- gap 조정 공간 -->
						 {#if isFlexbox(currentProp)}
							<InputVal name='G' value={currentProp.gap} min={0} onChange={value =>updateProp({ gap: value as number })}/>
						{/if}
						{#if isFlexboxRow(currentProp)}
							<InputVal name='V' value={currentProp.verticalGap} min={0} onChange={value =>updateProp({ verticalGap: value as number })}/>
						{/if}
					</div>
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