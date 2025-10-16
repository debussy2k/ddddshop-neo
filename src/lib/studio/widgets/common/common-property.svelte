<script lang="ts">
	import { onMount } from "svelte";
	import { JsonView } from "@zerodevx/svelte-json-view";
    import { studioDoc } from "../../studio-doc.svelte";
    import type { Cmd } from "$lib/studio/command";
    import type { Widget, BaseWidgetProp, HorizontalAlign, VerticalAlign, ContainerPropValue } from "../../types";
	import type { SectionPropValue } from "../../widgets/section/section.type";
	import type { FramePropValue } from "../../widgets/frame/frame.type";
	import type { ComputedValue } from "./computed-value-util";
	import { LayoutSection } from "./layout-property";	
	import { PositionSection } from "./position-property";
	import { FillSection } from "./fill-property";
	import type { Context } from "$lib/studio/context.svelte";

	interface Props {
		data: Widget;
		cmd: Cmd;
		currentProp: BaseWidgetProp | FramePropValue; // Section은 common-property를 사용하지 않음
		parentProp: ContainerPropValue;
		computedVal: ComputedValue;
		context: Context;
	}
	let {data, cmd, currentProp, parentProp, computedVal, context}: Props = $props();	

	export type DisplayStatus = {
		showMinWidth: boolean;
		showMaxWidth: boolean;
		showMinHeight: boolean;
		showMaxHeight: boolean;
	}
	let displayStatus = $state<DisplayStatus>({
		showMinWidth: false,
		showMaxWidth: false,
		showMinHeight: false,
		showMaxHeight: false,
	})

	let dataId = $derived(data.id);
	$effect(() => {
		// data.id가 변경될 때마다 displayStatus 초기화
		dataId;
		displayStatus = {
			showMinWidth: false,
			showMaxWidth: false,
			showMinHeight: false,
			showMaxHeight: false,
		};
	});

	onMount(() => {
		console.log('CommonProperty onMount');
		if ('layout' in currentProp && (currentProp.layout === 'flex-row' || currentProp.layout === 'flex-col')) {
		}
	})


	function updateProp(newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) {
		cmd.updateProp(data.id, newProp, context.break);
	}
</script>

<PositionSection 
	{data}
	{cmd}
	{currentProp}
	{parentProp}
	{computedVal}
	{context}
/>

<LayoutSection 
	{data}
	{currentProp} 
	{computedVal} 
	{parentProp}
	bind:displayStatus={displayStatus}
	{updateProp}
	{context}
/>

<FillSection 
	{data}
	{currentProp}
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
