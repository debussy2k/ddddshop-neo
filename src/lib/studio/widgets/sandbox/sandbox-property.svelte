<script lang="ts">
    import type { Sandbox } from "./sandbox.type";
    import { SandboxActions } from "./sandbox-actions";
    import { EditableText } from "$lib/components/studio-ui/editable-text";
    import { studioDoc } from "../../studio-doc.svelte";
    import { bpm } from "../../breakpoint-man.svelte";
    import type { HorizontalAlign, VerticalAlign } from "../../types";
    import HorzAlignSelector from "../common/horz-align-button-group.svelte";
    import VertAlignSelector from "../common/vert-align-button-group.svelte";
    import InputVal from "../common/input-val.svelte";
    import HorzAlignComboBox from "../common/horz-align-combo-box.svelte";
    import VertAlignComboBox from "../common/vert-align-combo-box.svelte";

    let { sandbox }: { sandbox: Sandbox } = $props();
    const cmdSandbox = new SandboxActions(studioDoc.historyManager);
    let currentProp = $derived(sandbox.prop?.[bpm.current]);

    async function updateSandboxText(newText: string) {
        cmdSandbox.update(sandbox.id, { text: newText });
    }

    async function updateSandboxName(newName: string) {
        cmdSandbox.update(sandbox.id, { name: newName });
    }

    async function updateHorzAlign(newHorzAlign: HorizontalAlign) {
        cmdSandbox.updateProp(sandbox.id, { horzAlign: newHorzAlign }, bpm.current);
    }

    async function updateVertAlign(newVertAlign: VerticalAlign) {
        cmdSandbox.updateProp(sandbox.id, { vertAlign: newVertAlign }, bpm.current);
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
                <InputVal name='X' value={currentProp.left}/>
                <InputVal name='Y' value={currentProp.top}/>
            </div>
    
            <div class='flex gap-x-2'>
                <div class='w-1/2 min-w-0 space-y-2'>
                    <HorzAlignComboBox value={currentProp.horzAlign} onChange={updateHorzAlign}/>
                    <VertAlignComboBox value={currentProp.vertAlign} onChange={updateVertAlign}/>
                </div>
                <div class='w-1/2 min-w-0'>
                    
                </div>
            </div>
        </div>
    </div>

    <!-- Layout -->
    <div class='px-3 py-4 text-xs border-b border-gray-200'>
        <div class="mb-3">레이아웃</div>
        <div class="flex flex-col gap-y-2">
            <div class='flex gap-x-2'>
                <InputVal name='W' value={currentProp.width}/>
                <InputVal name='H' value={currentProp.height}/>
            </div>

        </div>
    </div>
</div>
