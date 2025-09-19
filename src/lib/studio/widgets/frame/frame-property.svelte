<script lang="ts">
    import type { Frame } from "./frame.type";
    import type { LayoutType } from "../../types";
    import { FrameActions } from "./frame-actions";
    import { studioDoc } from "../../studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
    import type { HorizontalAlign, VerticalAlign } from "../../types";
    import HorzAlignSelector from "../common/horz-align-button-group.svelte";
    import VertAlignSelector from "../common/vert-align-button-group.svelte";
    import InputVal from "../common/input-val.svelte";
    import HorzAlignComboBox from "../common/horz-align-combo-box.svelte";
    import VertAlignComboBox from "../common/vert-align-combo-box.svelte";
    import LayoutSelector from "../common/layout-selector.svelte";

    let { frame }: { frame: Frame } = $props();
    let currentProp = $derived(frame.prop?.[bpm.current]);

    const cmdFrame = new FrameActions(studioDoc.historyManager);

    async function updateHorzAlign(newHorzAlign: HorizontalAlign) {
        cmdFrame.updateProp(frame.id, { horzAlign: newHorzAlign }, bpm.current);
    }

    async function updateVertAlign(newVertAlign: VerticalAlign) {
        cmdFrame.updateProp(frame.id, { vertAlign: newVertAlign }, bpm.current);
    }

    async function updateLayout(newLayout: LayoutType) {
        cmdFrame.updateProp(frame.id, { layout: newLayout }, bpm.current);
    }
</script>

<div class="bg-white text-sm w-full h-full flex flex-col gap-x-2">
    <div class='border-b border-gray-200 py-2 px-4'>프레임</div>

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
            <div class=''>
                <LayoutSelector layout={currentProp?.layout}  onChange={updateLayout}/>
            </div>
        
            <div class="flex flex-col gap-y-2">
                <div class='flex gap-x-2'>
                    <InputVal name='W' value={currentProp.width}/>
                    <InputVal name='H' value={currentProp.height}/>
                </div>
            </div>
        </div>
    </div>

</div>
