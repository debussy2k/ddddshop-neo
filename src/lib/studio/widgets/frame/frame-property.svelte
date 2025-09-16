<script lang="ts">
    import type { Frame } from "./frame.type";
    import { FrameActions } from "./frame-actions";
    import { EditableText } from "$lib/components/studio-ui/editable-text";
    import { EditableSize } from "$lib/components/studio-ui/editable-size";
    import { studioDoc } from "../../studio-doc.svelte";
    import { bpm } from "$lib/studio/breakpoint-man.svelte";

    let { frame }: { frame: Frame } = $props();

    const cmdFrame = new FrameActions(studioDoc.historyManager);

    async function updateFrameName(newName: string) {
        cmdFrame.updateFrame(frame.id, { name: newName });
    }

    async function updateFrameLeft(newLeft: string) {
        cmdFrame.updateFrameProp(frame.id, { left: newLeft }, bpm.current);
    }
    async function updateFrameTop(newTop: string) {
        cmdFrame.updateFrameProp(frame.id, { top: newTop }, bpm.current);
    }

    async function updateFrameWidth(newWidth: string) {
        cmdFrame.updateFrameProp(frame.id, { width: newWidth }, bpm.current);
    }

    async function updateFrameHeight(newHeight: string) {
        cmdFrame.updateFrameProp(frame.id, { height: newHeight }, bpm.current);
    }

    async function updateFramePadding(newPadding: string) {
        cmdFrame.updateFrameProp(frame.id, { padding: newPadding }, bpm.current);
    }
</script>

<div class="bg-white text-sm w-full h-full flex flex-col gap-x-2">
    <div class='border-b border-gray-200 py-2 px-4'>프레임</div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>이름 :</span>
        <EditableText 
            value={frame.name} 
            onSave={updateFrameName}
            placeholder="프레임 이름"
            class="flex-1"
        />
    </div>

    <!-- <div class='p-2 flex items-center gap-2'>
        <span>레이아웃 :</span>
        <EditableSelect 
            value={frame.prop[bpm.current]?.layout || 'block'}
            onSave={updateFrameLayout}
            placeholder="block"
            class="flex-1"
        />
    </div> -->

    <div class='p-2 flex items-center gap-2'>
        <span>X :</span>
        <EditableSize 
            value={frame.prop[bpm.current]?.left || '10px'}
            onSave={updateFrameLeft}
            placeholder="10px"
            class="flex-1"
        />
    </div>

    <div class='p-2 flex items-center gap-2'>
        <span>Y :</span>
        <EditableSize 
            value={frame.prop[bpm.current]?.top || '10px'}
            onSave={updateFrameTop}
            placeholder="10px"
            class="flex-1"
        />
    </div>
    <div class='p-2 flex items-center gap-2'>
        <span>너비 :</span>
        <EditableSize 
            value={frame.prop[bpm.current]?.width || '200px'}
            onSave={updateFrameWidth}
            placeholder="200px"
            class="flex-1"
        />
    </div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>높이 :</span>
        <EditableSize 
            value={frame.prop[bpm.current]?.height || '150px'}
            onSave={updateFrameHeight}
            placeholder="150px"
            class="flex-1"
        />
    </div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>패딩 :</span>
        <EditableSize 
            value={frame.prop[bpm.current]?.padding || '16px'} 
            onSave={updateFramePadding}
            placeholder="16px"
            class="flex-1"
        />
    </div>
    
</div>
