<script lang="ts">
	import { onMount } from "svelte";
	import { JsonView } from "@zerodevx/svelte-json-view";
    import { studioDoc } from "../../studio-doc.svelte";
    import type { Cmd } from "$lib/studio/command";
    import { bpm } from "../../breakpoint-man.svelte";
    import type { Widget, BaseWidgetProp, HorizontalAlign, VerticalAlign } from "../../types";
	import type { SectionPropValue } from "../../widgets/section/section.type";
	import type { FramePropValue } from "../../widgets/frame/frame.type";
	import type { ComputedValue } from "./computed-value-util";
    import HorzAlignSelector from "./horz-align-button-group.svelte";
    import VertAlignSelector from "./vert-align-button-group.svelte";
    import InputVal from "./input-val.svelte";
    import HorzAlignDropdownBox from "./horz-align-dropdown-box.svelte";
    import VertAlignDropdownBox from "./vert-align-dropdown-box.svelte";
	import * as constraintsUtilHorz from "./constraints-util-horz";
    import * as constraintsUtilVert from "./constraints-util-vert";
	import LayoutSection from "./common-property/layout-section.svelte";

	interface Props {
		data: Widget;
		cmd: Cmd;
		currentProp: BaseWidgetProp | FramePropValue; // Section은 common-property를 사용하지 않음
		parentProp: SectionPropValue | FramePropValue;
		computedVal: ComputedValue;
	}
	let {data, cmd, currentProp, parentProp, computedVal	}: Props = $props();	

    let parentComp: any = studioDoc.getWidget<any>(data.parentId);
	
	export type DisplayStatus = {
		showMinWidth: boolean;
		showMaxWidth: boolean;
	}
	let displayStatus = $state<DisplayStatus>({
		showMinWidth: false,
		showMaxWidth: false,
	})

	onMount(() => {
		if ('layout' in currentProp && (currentProp.layout === 'flex-row' || currentProp.layout === 'flex-col') && currentProp.hasMinWidth) {
			displayStatus.showMinWidth = true;
		}
	})


	// 타입 가드 함수 - 위치 섹션에서 사용
	function isFlexbox(prop: BaseWidgetProp | FramePropValue | SectionPropValue): prop is FramePropValue | SectionPropValue {
		return 'layout' in prop && (prop.layout === 'flex-row' || prop.layout === 'flex-col');
	}

	function updateProp(newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) {
		cmd.updateProp(data.id, newProp, bpm.current);
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

<LayoutSection 
	{currentProp} 
	{computedVal} 
	bind:displayStatus={displayStatus}
	{updateProp} 
/>

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
