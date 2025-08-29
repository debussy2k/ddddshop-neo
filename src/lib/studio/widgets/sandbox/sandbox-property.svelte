<script lang="ts">
    import type { Sandbox } from "./sandbox-actions";
    import { SandboxActions } from "./sandbox-actions";
    import { EditableText } from "$lib/components/studio-ui/editable-text";
    import { studioDoc } from "../../studio-doc.svelte";

    let { sandbox }: { sandbox: Sandbox } = $props();

    const cmdSandbox = new SandboxActions(studioDoc.historyManager);

    async function updateSandboxText(newText: string) {
        cmdSandbox.updateSandbox(sandbox.id, { text: newText });
    }

    async function updateSandboxName(newName: string) {
        cmdSandbox.updateSandbox(sandbox.id, { name: newName });
    }
</script>

<div class="bg-white text-sm w-full h-full flex flex-col gap-x-2">
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
</div>
