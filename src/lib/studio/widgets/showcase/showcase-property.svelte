<script lang="ts">
    import type { Showcase } from "./showcase.type";
    import { ShowcaseActions } from "./showcase-actions";
    import { EditableText } from "$lib/components/studio-ui/editable-text";
    import { studioDoc } from "../../studio-doc.svelte";

    let { showcase }: { showcase: Showcase } = $props();

    const cmdShowcase = new ShowcaseActions(studioDoc.historyManager);

    async function updateShowcaseText(newText: string) {
        cmdShowcase.updateShowcase(showcase.id, { text: newText });
    }

    async function updateShowcaseName(newName: string) {
        cmdShowcase.updateShowcase(showcase.id, { name: newName });
    }
</script>

<div class="bg-white text-sm w-full h-full flex flex-col gap-x-2">
    <div class='border-b border-gray-200 py-2 px-4'>쇼케이스</div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>이름 :</span>
        <EditableText 
            value={showcase.name} 
            onSave={updateShowcaseName}
            placeholder="쇼케이스 이름"
            class="flex-1"
        />
    </div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>T :</span>
        <EditableText 
            value={showcase.text} 
            onSave={updateShowcaseText}
            placeholder="표시할 텍스트"
            class="flex-1"
        />
    </div>
</div>
