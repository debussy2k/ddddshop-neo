<script lang="ts">
    import type { Section } from "./section-actions";
    import { SectionActions } from "./section-actions";
    import { SandboxActions } from "../sandbox/sandbox-actions";
    import { EditableSize } from "$lib/components/studio-ui/editable-size";
    import { Button } from "$lib/components/ui/button";
    import { studioDoc } from "../../studio-doc.svelte";

    let { section }: { section: Section } = $props();

    const cmdSection = new SectionActions(studioDoc.historyManager);
    const cmdSandbox = new SandboxActions(studioDoc.historyManager);

    async function updateSectionHeight(newHeight: string) {
        cmdSection.updateSection(section.id, { height: newHeight });
    }

    function addSandboxToSection() {
        cmdSandbox.addSandbox({
            text: '새로운 샌드박스',
            parentId: section.id
        });
    }
</script>

<div class="bg-white text-sm w-full h-full flex flex-col gap-x-2">
    <div class='border-b border-gray-200 py-2 px-4'>섹션</div>
    <div class='p-2'>
        이름 : {section.name}
    </div>
    <div class='p-2 flex items-center gap-2'>
        <span>높이 :</span>
        <EditableSize 
            value={section.height} 
            onSave={updateSectionHeight}
            placeholder="높이 입력"
            class="w-[70px]"
        />
    </div>
    
    <div class='p-2 border-t border-gray-100'>
        <div class='mb-2 text-xs text-gray-600'>자식 위젯</div>
        <Button 
            onclick={addSandboxToSection}
            variant="outline"
            size="sm"
            class="w-full text-xs"
        >
            + 샌드박스 추가
        </Button>
        
        {#if section.children && section.children.length > 0}
            <div class='mt-2 text-xs text-gray-500'>
                {section.children.length}개의 자식 위젯
            </div>
        {/if}
    </div>
</div>
