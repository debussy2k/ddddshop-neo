<script lang="ts">
    import type { Sandbox } from "./sandbox.type";
    import { SandboxActions } from "./sandbox-actions";
    import { EditableText } from "$lib/components/studio-ui/editable-text";
    import { studioDoc } from "../../studio-doc.svelte";
    import { bpm } from "../../breakpoint-man.svelte";
    import HorzAlignSelector from "../common/horz-align-button-group.svelte";
    import VertAlignSelector from "../common/vert-align-button-group.svelte";
    import InputVal from "../common/input-val.svelte";
    import HorzAlignComboBox from "../common/horz-align-combo-box.svelte";
    import VertAlignComboBox from "../common/vert-align-combo-box.svelte";

    let { sandbox }: { sandbox: Sandbox } = $props();
    const cmdSandbox = new SandboxActions(studioDoc.historyManager);
    let currentProp = $derived(sandbox.prop?.[bpm.current]);

    async function updateSandboxText(newText: string) {
        cmdSandbox.updateSandbox(sandbox.id, { text: newText });
    }

    async function updateSandboxName(newName: string) {
        cmdSandbox.updateSandbox(sandbox.id, { name: newName });
    }

    async function updateSandboxHorzAlign(newHorzAlign: HorizontalAlign) {
        cmdSandbox.updateSandboxProp(sandbox.id, { horzAlign: newHorzAlign }, bpm.current);
    }

    async function updateSandboxVertAlign(newVertAlign: VerticalAlign) {
        cmdSandbox.updateSandboxProp(sandbox.id, { vertAlign: newVertAlign }, bpm.current);
    }
</script>

<div class="relative bg-white text-sm w-full h-full flex flex-col gap-x-2">
    <div class='border-b border-gray-200 py-2 px-4'>샌드박스</div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>이름 :</span>
        <EditableText 
            value={sandbox.name} 
            onSave={updateSandboxName}
            placeholder="샌드박스 이름"
            class="flex-1"
        />
    </div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>T :</span>
        <EditableText 
            value={sandbox.text} 
            onSave={updateSandboxText}
            placeholder="표시할 텍스트"
            class="flex-1"
        />
    </div>

    <div class='p-2 mt-2 text-xs'>
        <div class="my-2">위치</div>
        <div class="flex items-center gap-2">
            <HorzAlignSelector align={"left"} class='flex-1'/>
            <VertAlignSelector align={"top"} class='flex-1'/>
        </div>

        <div class='flex gap-x-2 mt-2'>
            <InputVal name='X' value={currentProp.left}/>
            <InputVal name='Y' value={currentProp.top}/>
        </div>

        <div class='flex gap-x-2 mt-2'>
			<div class='w-1/2 space-y-2'>
				<HorzAlignComboBox value={currentProp.horzAlign} onChange={updateSandboxHorzAlign}/>
				<VertAlignComboBox value={currentProp.vertAlign} onChange={updateSandboxVertAlign}/>
			</div>
			<div class='w-1/2'>
				
			</div>
		</div>
    </div>
    

</div>
