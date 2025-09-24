<script lang="ts">
    import { onMount } from "svelte";
    import type { Sandbox } from "./sandbox.type";
    import { studioDoc } from "../../studio-doc.svelte";
    import { bpm } from "../../breakpoint-man.svelte";
    import { canvasManager } from "../../canvas-manager.svelte"; // 추가
    import type { HorizontalAlign, VerticalAlign } from "../../types";
    import HorzAlignSelector from "../common/horz-align-button-group.svelte";
    import VertAlignSelector from "../common/vert-align-button-group.svelte";
    import InputVal from "../common/input-val.svelte";
    import HorzAlignComboBox from "../common/horz-align-combo-box.svelte";
    import VertAlignComboBox from "../common/vert-align-combo-box.svelte";
    import { cmdSandbox as cmd } from "$lib/studio/command";
	import { constraintsUtilHorz } from "../common/constraints-util-horz";
    import { constraintsUtilVert } from "../common/constraints-util-vert";
    import { JsonView } from "@zerodevx/svelte-json-view";

    let { data }: { data: Sandbox } = $props();
    let currentProp = $derived(data.prop?.[bpm.current]);
    let parentProp = $derived(studioDoc.getParentByChildId(data.id)?.prop?.[bpm.current]);
    let parentComp: any = studioDoc.getWidget<any>(data.parentId);
    let computedVal = $derived.by(() => {
        // console.log("parentSize", canvasManager.currentWidth)
        canvasManager.currentWidth; // 의존성만 추가. canvas크기가 변경되어도 반응하도록 함.
        canvasManager.needUpdate;   // 의존성만 추가. 

        let parentWidth = parentComp.getWidth();
        let parentHeight = parentComp.getHeight();
        // auto, percent로 표시된 값은 계산하여 pixel 단위로 리턴됨.
        return {
            parentWidth: parentWidth,
            parentHeight: parentHeight,
            x: constraintsUtilHorz.getLeftValue(currentProp, parentWidth).toString(),
            y: constraintsUtilVert.getTopValue(currentProp, parentHeight).toString(),
            w: constraintsUtilHorz.getWidthValue(currentProp, parentWidth).toString(),
            h: constraintsUtilVert.getHeightValue(currentProp, parentHeight).toString()
        }
    })
  
    onMount(() => {
        parentComp = studioDoc.getWidget<any>(data.parentId);
    });


    function updateSandboxText(newText: string) {
        cmd.update(data.id, { text: newText });
    }

    function updateSandboxName(newName: string) {
        cmd.update(data.id, { name: newName });
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
</script>

<div class="relative bg-white text-sm w-full h-full flex flex-col gap-x-2">
    <div class='border-b border-gray-200 py-2 px-4'>샌드박스</div>
    
    <!-- <div class='p-2 flex items-center gap-2'>
        <span>이름 :</span>
        <EditableText 
            value={sandbox.name} 
            onSave={updateSandboxName}
            placeholder="샌드박스 이름"
            class="flex-1"
        />
    </div> -->
    
    <!-- <div class='p-2 flex items-center gap-2'>
        <span>T :</span>
        <EditableText 
            value={sandbox.text} 
            onSave={updateSandboxText}
            placeholder="표시할 텍스트"
            class="flex-1"
        />
    </div> -->

    <!-- Position -->
    <div class='px-3 py-4 text-xs border-b border-gray-200'>
        <div class="mb-3">위치</div>
        <div class="flex flex-col gap-y-2">
            <div class="flex items-center gap-2">
                <HorzAlignSelector align={"left"} class='flex-1'/>
                <VertAlignSelector align={"top"} class='flex-1'/>
            </div>
    
            <div class='flex gap-x-2'>
                <InputVal name='X' value={computedVal.x}/>
                <InputVal name='Y' value={computedVal.y}/>
            </div>
    
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
            <div class='flex gap-x-2'>
                <InputVal name='W' value={computedVal.w}/>
                <InputVal name='H' value={computedVal.h}/>
            </div>
        </div>
    </div>

    <div class='px-3 py-4 text-xs border-b border-gray-200'>
        <div class="mb-3">정보</div>
        <div class='overflow-x-scroll'>
            <JsonView json={currentProp}/>
        </div>
    </div>
</div>