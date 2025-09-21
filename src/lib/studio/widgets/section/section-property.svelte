<script lang="ts">
    import type { Section } from "./section.type";
    import type { LayoutType } from "../../types";
    import { EditableSize } from "$lib/components/studio-ui/editable-size";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { Button } from "$lib/components/ui/button";
    import type SectionWidget from "./section-widget.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
    import { cmdSection as cmd } from "$lib/studio/command";
    import LayoutSelector from "../common/layout-selector.svelte";
    import InputVal from "../common/input-val.svelte";

    let { data }: { data: Section } = $props();
    let currentProp = $derived(data.prop?.[bpm.current]);

	async function updateLayout(newLayout: LayoutType) {
        cmd.updateProp(data.id, { layout: newLayout }, bpm.current);
    }
    async function updateSectionHeight(newHeight: string) {
        cmd.updateProp(data.id, { height: newHeight }, bpm.current);
    }

	async function autoUpdateSectionHeight() {
		let widget = studioDoc.getWidget<SectionWidget>(data.id);
		let newHeight = widget.getContentHeight() + 'px';
        cmd.updateProp(data.id, { height: newHeight }, bpm.current);
	}

</script>

<div class="bg-white text-sm w-full h-full flex flex-col gap-x-2">
    <div class='border-b border-gray-200 py-2 px-4'>섹션</div>
    <div class='p-2'>
        이름 : {data.name}
    </div>
    <div class='p-2 flex items-center gap-2'>
        <span>높이 :</span>
        <EditableSize 
            value={data.prop?.[bpm.current]?.height} 
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


    <!-- Layout -->
    <div class='px-3 py-4 text-xs border-b border-gray-200'>
        <div class="mb-3">레이아웃</div>

        <div class="flex flex-col gap-y-2">
            <div class=''>
                <LayoutSelector layout={currentProp?.layout}  onChange={updateLayout}/>
            </div>
        
            <div class="flex flex-col gap-y-2">
                <div class='flex gap-x-2'>
                    <InputVal class="w-1/2" name='H' value={currentProp.height} onChange={updateSectionHeight}/>
                </div>
            </div>
        </div>
    </div>	
</div>
