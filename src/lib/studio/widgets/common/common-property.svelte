<script lang="ts">
	import { JsonView } from "@zerodevx/svelte-json-view";
    import { studioDoc } from "../../studio-doc.svelte";
    import type { Widget, BaseWidgetProp, HorizontalAlign, VerticalAlign, LayoutType } from "../../types";
	import type { SectionPropValue } from "../../widgets/section/section.type";
	import type { FramePropValue } from "../../widgets/frame/frame.type";
	import type { ComputedValue } from "./computed-value-util";
    import HorzAlignSelector from "../common/horz-align-button-group.svelte";
    import VertAlignSelector from "../common/vert-align-button-group.svelte";
    import InputVal from "../common/input-val.svelte";
    import HorzAlignComboBox from "../common/horz-align-combo-box.svelte";
    import VertAlignComboBox from "../common/vert-align-combo-box.svelte";
    import LayoutSelector from "../common/layout-selector.svelte";
	import { constraintsUtilHorz } from "../common/constraints-util-horz";
    import { constraintsUtilVert } from "../common/constraints-util-vert";
    import type { Cmd } from "$lib/studio/command";
    import { bpm } from "../../breakpoint-man.svelte";

	interface Props {
		data: Widget;
		cmd: Cmd;
		currentProp: BaseWidgetProp;
		parentProp: SectionPropValue | FramePropValue | undefined;
		computedVal: ComputedValue;
	}
	let {data, cmd, currentProp, parentProp, computedVal	}: Props = $props();	

    let parentComp: any = studioDoc.getWidget<any>(data.parentId);

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
			<InputVal name='X' value={computedVal.left}/>
			<InputVal name='Y' value={computedVal.top}/>
		</div>

		<!-- 부모가 block인 경우만 보여줌 -->
		{#if parentProp?.layout === 'block'}
			<div class='flex gap-x-2'>
				<div class='w-1/2 min-w-0 space-y-2'>
					<HorzAlignComboBox value={currentProp.horzAlign} onChange={updateHorzAlign}/>
					<VertAlignComboBox value={currentProp.vertAlign} onChange={updateVertAlign}/>
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
		{#if data.type === 'frame'}
			<div class=''>
				<LayoutSelector layout={currentProp.layout}  onChange={updateLayout}/>
			</div>
		{/if}

		<div class="flex flex-col gap-y-2">
			<div class='flex gap-x-2'>
				<InputVal name='W' value={computedVal.width}/>
				<InputVal name='H' value={computedVal.height}/>
			</div>
		</div>
	</div>
</div>

<div class='px-3 py-4 text-xs border-b border-gray-200'>
	<div class="mb-3">정보</div>
	<div class='overflow-x-scroll'>
		<JsonView json={currentProp}/>
	</div>
</div>