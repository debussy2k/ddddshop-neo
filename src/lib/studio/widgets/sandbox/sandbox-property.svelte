<script lang="ts">
    import { onMount } from "svelte";
    import type { Sandbox } from "./sandbox.type";
    import { studioDoc } from "../../studio-doc.svelte";
    import { bpm } from "../../breakpoint-man.svelte";
    import { canvasManager } from "../../canvas-manager.svelte"; // 추가
    import type { BaseWidgetProp, CompositeWidget, HorizontalAlign, VerticalAlign } from "../../types";
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
    let parentComp: any = studioDoc.getWidget<any>(data.parentId);
    let parentProp = $derived(studioDoc.getParentByChildId(data.id)?.prop?.[bpm.current]);
    let parentSize = $derived.by(() => {
        console.log("parentSize", canvasManager.currentWidth)
        canvasManager.currentWidth; // 의존성만 추가. canvas크기가 변경되어도 반응하도록 함.
        canvasManager.needUpdate;
        return {
            width: parentComp.getWidth(),
            height: parentComp.getHeight(),
        }
    })

    let x = $derived(constraintsUtilHorz.getLeftValue(currentProp, parentSize.width).toString())
    let y = $derived(constraintsUtilVert.getTopValue(currentProp, parentSize.height).toString())
    let w = $derived(constraintsUtilHorz.getWidthValue(currentProp, parentSize.width).toString())
    let h = $derived(constraintsUtilVert.getHeightValue(currentProp, parentSize.height).toString())

    onMount(() => {
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
		let parentWidth = parentComp.getWidth();
		let obj = constraintsUtilHorz.createHorzAlignProps(newHorzAlign, currentProp, parentWidth);

		cmd.updateProp(data.id, obj, bpm.current);
    }

    function updateVertAlign(newVertAlign: VerticalAlign) {
        if (parentComp === null) {
            console.error(`parent not found for sandbox`, data.id);
            return;
        }
        let parentHeight = parentComp.getHeight();
        let obj = constraintsUtilVert.createVertAlignProps(newVertAlign, currentProp, parentHeight);

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
                <InputVal name='X' value={x}/>
                <InputVal name='Y' value={y}/>
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
                <InputVal name='W' value={w}/>
                <InputVal name='H' value={h}/>
            </div>
        </div>
    </div>

    <div class='px-3 py-4 text-xs border-b border-gray-200'>
        <div class="mb-3">정보: {bpm.current}</div>
        <div class='overflow-x-scroll'>
            <JsonView json={currentProp}/>
        </div>
    </div>
</div>
