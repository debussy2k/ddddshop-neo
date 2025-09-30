<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
    import { type DisplayStatus } from "../common-property.svelte";
	import type { BaseWidgetProp, LayoutType } from "../../../types";
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

	interface Props {
		class?: ClassValue;
		currentProp: BaseWidgetProp | FramePropValue;
		computedVal: ComputedValue;
		displayStatus: DisplayStatus;
		updateProp: (newProp: Partial<BaseWidgetProp | FramePropValue | SectionPropValue>) => void;
	}

	let { 
		class: className, 
		currentProp, 
		computedVal, 
		displayStatus = $bindable(), 
		updateProp, 
	}: Props = $props();

	// 타입 가드 함수들
	function isContainerProps(prop: BaseWidgetProp | FramePropValue | SectionPropValue): prop is FramePropValue | SectionPropValue {
		return 'layout' in prop;
	}	
	
	function isFlexbox(prop: BaseWidgetProp | FramePropValue | SectionPropValue): prop is FramePropValue | SectionPropValue {
		return isContainerProps(prop) && (prop.layout === 'flex-row' || prop.layout === 'flex-col');
	}	
	
	function isFlexboxRow(prop: BaseWidgetProp | FramePropValue | SectionPropValue): prop is FramePropValue | SectionPropValue {
		return isFlexbox(prop) && prop.layout === 'flex-row';
	}
    
	function onChangeLayout(newLayout: LayoutType) {
		let obj: Partial<FramePropValue | SectionPropValue> = {
			layout: newLayout,
			wrap: false,
		}
		// 기존 값이 flexbox가 아닌 경우 아래 값으로 초기화
		// gap과 verticalGap를 10으로 설정, justifyContent와 alignItems를 start로 설정
		const isCurrentFlexbox = 'layout' in currentProp && (currentProp.layout === 'flex-row' || currentProp.layout === 'flex-col');
		if (!isCurrentFlexbox) {
			obj = { ...obj, 
				justifyContent: "start",
				alignItems: "start",						
				gap: 10, 
				verticalGap: 10 
			};
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
				{#if isFlexbox(currentProp)}
					<!-- Auto layout일 때의 Width UI -->
					<div class='flex-1 min-w-0 space-y-2'>
						<!-- width -->
						<WidthComboBox value={computedVal.width} 
							{currentProp} {updateProp} {computedVal}
							min={currentProp.hasMinWidth ? currentProp.minWidth : 1}
							max={currentProp.hasMaxWidth ? currentProp.maxWidth : undefined}
							bind:displayStatus={displayStatus}
							/>
						<!-- min width -->
						{#if displayStatus.showMinWidth}
							<MinWidthComboBox icon={MinWidthIcon} value={currentProp.minWidth} 
								{currentProp} {updateProp} {computedVal}
								min={1}
								bind:displayStatus={displayStatus}
								/>
						{/if}
						<!-- max width -->
						{#if displayStatus.showMaxWidth}
							<MaxWidthComboBox icon={MaxWidthIcon} value={currentProp.maxWidth} 
								{currentProp} {updateProp} {computedVal}
								min={1}
								bind:displayStatus={displayStatus}
								/>
						{/if}
					</div>
					<div class='flex-1 min-w-0 space-y-2'>
						<!-- height -->
						<HeightComboBox value={computedVal.height} 
							{currentProp} {updateProp} {computedVal}
							min={currentProp.hasMinHeight ? currentProp.minHeight : 1}
							max={currentProp.hasMaxHeight ? currentProp.maxHeight : undefined}
							bind:displayStatus={displayStatus}
							/>
						<!-- min height -->
						{#if displayStatus.showMinHeight}
							<MinHeightComboBox icon={MinHeightIcon} value={currentProp.minHeight} 
								{currentProp} {updateProp} {computedVal}
								min={1}
								bind:displayStatus={displayStatus}
								/>
						{/if}
						<!-- max height -->
						{#if displayStatus.showMaxHeight}
							<MaxHeightComboBox icon={MaxHeightIcon} value={currentProp.maxHeight} 
								{currentProp} {updateProp} {computedVal}
								min={1}
								bind:displayStatus={displayStatus}
								/>
						{/if}
					</div>
				{:else}
					<!-- Freeform layout 일때의 Width/Height UI -->
					<InputVal name='W' value={computedVal.width} min={1} onChange={value => updateWidthProp(value as number)}/>
					<InputVal name='H' value={computedVal.height} min={1} onChange={value => updateHeightProp(value as number)}/>
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
