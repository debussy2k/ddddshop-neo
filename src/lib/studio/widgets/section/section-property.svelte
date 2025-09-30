<script lang="ts">
    import type { Section } from "./section.type";
    import type { LayoutType } from "../../types";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";
    import { cmdSection as cmd } from "$lib/studio/command";
    import LayoutSelector from "../common/layout-property/layout-selector.svelte";
    import InputVal from "../common/input-val.svelte";
    import { JsonView } from "@zerodevx/svelte-json-view";
    import { canvasManager } from "$lib/studio/canvas-manager.svelte";
    import { MiniButton } from "$lib/components/ui/min-button";
    import ResizeToFitIcon from "$lib/components/ui/min-button/resize-to-fit.svg?raw";
    
    let { data }: { data: Section } = $props();
    let currentProp = $derived(data.prop?.[bpm.current]);

	function updateLayout(newLayout: LayoutType) {
        cmd.updateProp(data.id, { layout: newLayout }, bpm.current);
    }
    
    function resizeToFit() {
        console.log("resize to fit");
    }


</script>

<div class="bg-white text-sm w-full h-full flex flex-col gap-x-2">
    <div class='border-b border-gray-200 py-2 px-4'>섹션</div>

    <!-- Layout -->
    <div class='px-3 py-4 text-xs border-b border-gray-200'>
        <div class="mb-3 flex justify-between">
            <div>레이아웃</div>
            <div>
                <MiniButton icon={ResizeToFitIcon} title="resize to fit" onClick={resizeToFit}/>
            </div>
        </div>

        <div class="flex flex-col gap-y-2">
            <div class=''>
                <LayoutSelector layout={currentProp?.layout}  onChange={updateLayout}/>
            </div>
        
            <div class="flex flex-col gap-y-2">
                <div class='flex gap-x-2'>
				<InputVal name='W' value={canvasManager.currentWidth}/> <!-- read only -->
                <InputVal name='H' value={currentProp.height}/>
                </div>
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
