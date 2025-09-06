<script lang="ts">
    import type { Section } from "./section-actions";
    import { SectionActions } from "./section-actions";
    import { EditableSize } from "$lib/components/studio-ui/editable-size";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { Button } from "$lib/components/ui/button";
    import type { SectionWidget } from "./section-widget.svelte";

    let { section }: { section: Section } = $props();

    const cmdSection = new SectionActions(studioDoc.historyManager);

    async function updateSectionHeight(newHeight: string) {
        cmdSection.updateSection(section.id, { height: newHeight });
    }

	async function autoUpdateSectionHeight() {
		let widget = studioDoc.getWidget<SectionWidget>(section.id);
		let height = widget.getContentHeight();
		updateSectionHeight(height + 'px');
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

	<div>
		<Button variant="outline" size="sm" onclick={() => {
			autoUpdateSectionHeight();
		}}>
			높이 맞추기
		</Button>
	</div>
</div>
