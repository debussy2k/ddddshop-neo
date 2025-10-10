<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import * as du from "../doc-util";
	import { studioDoc } from "../../../studio-doc.svelte";
    import { type DisplayStatus } from "../common-property.svelte";
	import type { Widget, BaseWidgetProp, LayoutType, ContainerPropValue } from "../../../types";
	import type { SectionPropValue } from "../../section/section.type";
	import type { FramePropValue } from "../../frame/frame.type";
	import type { ComputedValue } from "../computed-value-util";
	import InputVal from "../input-val.svelte";
	import WidthComboBox from "./width-combo-box.svelte";
	import MinWidthComboBox from "./min-width-combo-box.svelte";
	import MaxWidthComboBox from "./max-width-combo-box.svelte";
	import HeightComboBox from "./height-combo-box.svelte";
	import MinHeightComboBox from "./min-height-combo-box.svelte";
	import MaxHeightComboBox from "./max-height-combo-box.svelte";
	import LayoutSelector from "./layout-selector.svelte";
	import JustifyContentDropdownBox from "./justify-content-dropdown-box.svelte";
	import AlignItemsDropdownBox from "./align-items-dropdown-box.svelte";
	import { MiniToggleButton } from "$lib/components/ui/min-button";
	import FlexWrapIcon from "$lib/components/ui/min-button/flex-wrap.svg?raw";
	import PadingXIcon from "$lib/assets/studio/padding-x.svg?raw";
	import PadingYIcon from "$lib/assets/studio/padding-y.svg?raw";
	import MinWidthIcon from "$lib/assets/studio/min-width.svg?raw";
	import MaxWidthIcon from "$lib/assets/studio/max-width.svg?raw";
	import MinHeightIcon from "$lib/assets/studio/min-height.svg?raw";
	import MaxHeightIcon from "$lib/assets/studio/max-height.svg?raw";
	import * as constraintsUtilHorz from "../constraints-util-horz";
	import * as constraintsUtilVert from "../constraints-util-vert";
	import { bpm } from "../../../breakpoint-man.svelte";
	import * as cmd from "../../../command";
	interface Props {
		class?: ClassValue;
		data: Widget;
		currentProp: BaseWidgetProp | FramePropValue;
		computedVal: ComputedValue;
		parentProp: ContainerPropValue;
		displayStatus: DisplayStatus;
		updateProp: (newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) => void;
	}

	let { 
		class: className, 
		data,
		currentProp, 
		computedVal, 
		parentProp,
		displayStatus = $bindable(), 
		updateProp, 
	}: Props = $props();

	let sizeConstraints = $derived(currentProp.sizeConstraints);

	function onSetBatchMode() {
		studioDoc.setBatchMode();
	}

	function onCommitBatch() {
		studioDoc.commitBatch();
	}
    
	function onChangeLayout(newLayout: LayoutType) {
		let obj: Partial<FramePropValue | SectionPropValue> = {
			layout: newLayout,
			wrap: false,
			width: computedVal.width + 'px',
			height: computedVal.height + 'px',
		}

		if (newLayout === 'block') {
			obj = {
				...obj,
				sizeConstraints: undefined
			}
		}
		else if (du.isLayoutFlexBox(newLayout)) {
			if (du.isFlexbox(currentProp)) {
				// flex-row <--> flex-col 일 경우 아래 값 그대로 유지. 
			}
			else {
			// block -> flex 일 경우 아래 값으로 초기화.
				obj = { ...obj, 
					justifyContent: "start",
					alignItems: "start",						
					gap: 10, 
					verticalGap: 10,
					sizeConstraints: du.getDefaultSizeConstraints()
				};
			}
		}

		updateProp(obj);
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

<!-- Layout -->
<div class={cn('px-3 py-4 text-xs border-b border-gray-200', className || '')}>
	<div class="mb-3">레이아웃</div>

	<div class="flex flex-col gap-y-2">
		{#if du.isContainerProps(currentProp)}
			<div class='flex gap-x-2'>
				<LayoutSelector layout={currentProp.layout} onChange={onChangeLayout} class='flex-1 min-w-0'/>
               	<MiniToggleButton icon={FlexWrapIcon} title="wrap" 
					class={!du.isFlexboxRow(currentProp) ? 'invisible' : ''}
					toggled={currentProp.wrap} onToggle={value => updateProp({ wrap: value })}/>
			</div>
		{/if}

		<div class="flex flex-col gap-y-2">
			<div class='flex gap-x-2'>
				{#if sizeConstraints && (du.isFlexbox(currentProp) || du.isFlexbox(parentProp))}
					<!-- Auto layout일 때의 Width UI -->
					<div class='flex-1 min-w-0 space-y-2'>
						<!-- width -->
						<WidthComboBox value={computedVal.width} 
							currentProp={currentProp} 
							{parentProp} 
							widgetId={data.id}
							parentId={data.parentId}
							{updateProp} 
							{computedVal}
							min={sizeConstraints.hasMinWidth ? sizeConstraints.minWidth : 1}
							max={sizeConstraints.hasMaxWidth ? sizeConstraints.maxWidth : undefined}
							bind:displayStatus={displayStatus}
							/>
						<!-- min width -->
						{#if displayStatus.showMinWidth}
							<MinWidthComboBox icon={MinWidthIcon} value={sizeConstraints.minWidth || 0} 
								currentProp={currentProp} {sizeConstraints} {updateProp} {computedVal}
								min={1}
								bind:displayStatus={displayStatus}
								/>
						{/if}
						<!-- max width -->
						{#if displayStatus.showMaxWidth}
							<MaxWidthComboBox icon={MaxWidthIcon} value={sizeConstraints.maxWidth || 0} 
								currentProp={currentProp} {sizeConstraints} {updateProp} {computedVal}
								min={1}
								bind:displayStatus={displayStatus}
								/>
						{/if}
					</div>
					<div class='flex-1 min-w-0 space-y-2'>
						<!-- height -->
						<HeightComboBox value={computedVal.height} 
							currentProp={currentProp} {parentProp} {updateProp} {computedVal}
							min={sizeConstraints.hasMinHeight ? sizeConstraints.minHeight : 1}
							max={sizeConstraints.hasMaxHeight ? sizeConstraints.maxHeight : undefined}
							bind:displayStatus={displayStatus}
							/>
						<!-- min height -->
						{#if displayStatus.showMinHeight}
							<MinHeightComboBox icon={MinHeightIcon} value={sizeConstraints.minHeight || 0} 
								currentProp={currentProp} {sizeConstraints} {updateProp} {computedVal}
								min={1}
								bind:displayStatus={displayStatus}
								/>
						{/if}
						<!-- max height -->
						{#if displayStatus.showMaxHeight}
							<MaxHeightComboBox icon={MaxHeightIcon} value={sizeConstraints.maxHeight || 0} 
								currentProp={currentProp} {sizeConstraints} {updateProp} {computedVal}
								min={1}
								bind:displayStatus={displayStatus}
								/>
						{/if}
					</div>
				{:else}
					<!-- Freeform layout 일때의 Width/Height UI -->
					<InputVal name='W' value={computedVal.width} min={1} onChange={value => updateWidthProp(value as number)} onDragStart={onSetBatchMode} onDragEnd={onCommitBatch}/>
					<InputVal name='H' value={computedVal.height} min={1} onChange={value => updateHeightProp(value as number)} onDragStart={onSetBatchMode} onDragEnd={onCommitBatch}/>
				{/if}
			</div>
		</div>

		<!-- For Debug -->
		<!-- <div class='border border-red-500'>
			isContainerProps: {isContainerProps(currentProp)}, isFlexbox: {isFlexbox(currentProp)}
		</div> -->

		{#if du.isContainerProps(currentProp) && du.isFlexbox(currentProp)}
			<div class="flex flex-col gap-y-2">
				<div class='flex gap-x-2'>
					<div class='w-1/2 min-w-0 space-y-2'>
						<JustifyContentDropdownBox class='flex-1' value={currentProp.justifyContent} onChange={value => updateProp({ justifyContent: value })}/>
						<AlignItemsDropdownBox class='' value={currentProp.alignItems} onChange={value => updateProp({ alignItems: value })}/>
					</div>
					<div class='w-1/2 min-w-0 space-y-2'>
						<!-- gap 조정 공간 -->
						 {#if du.isFlexbox(currentProp)}
							<InputVal name='G' value={currentProp.gap} min={0} onChange={value => updateProp({ gap: value as number })} onDragStart={onSetBatchMode} onDragEnd={onCommitBatch}/>
						{/if}
						{#if du.isFlexboxRow(currentProp) && currentProp.wrap}
							<InputVal name='V' value={currentProp.verticalGap} min={0} onChange={value => updateProp({ verticalGap: value as number })} onDragStart={onSetBatchMode} onDragEnd={onCommitBatch}/>
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

	{#if du.isFlexbox(parentProp) && sizeConstraints === undefined }
		<div class='mt-4 p-1 border'>
			<div class="mb-1">오류</div>
			<div class="text-red-500">
				sizeConstraints가 정의되지 않았습니다.
			</div>
		</div>
	{/if}
</div>
