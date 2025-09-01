<script lang="ts">
    import type { SimpleImage } from "./simple-image-actions";
    import { SimpleImageActions } from "./simple-image-actions";
    import { EditableText } from "$lib/components/studio-ui/editable-text";
    import { EditableSize } from "$lib/components/studio-ui/editable-size";
    import { studioDoc } from "../../studio-doc.svelte";

    let { simpleImage }: { simpleImage: SimpleImage } = $props();

    const cmdSimpleImage = new SimpleImageActions(studioDoc.historyManager);

    async function updateSimpleImageName(newName: string) {
        cmdSimpleImage.updateSimpleImage(simpleImage.id, { name: newName });
    }

    async function updateSimpleImageUrl(newUrl: string) {
        cmdSimpleImage.updateSimpleImage(simpleImage.id, { url: newUrl });
    }

    async function updateSimpleImageAlt(newAlt: string) {
        cmdSimpleImage.updateSimpleImage(simpleImage.id, { alt: newAlt });
    }

    async function updateSimpleImageWidth(newWidth: string) {
        cmdSimpleImage.updateSimpleImage(simpleImage.id, { width: newWidth });
    }

    async function updateSimpleImageHeight(newHeight: string) {
        cmdSimpleImage.updateSimpleImage(simpleImage.id, { height: newHeight });
    }
</script>

<div class="bg-white text-sm w-full h-full flex flex-col gap-x-2">
    <div class='border-b border-gray-200 py-2 px-4'>이미지</div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>이름 :</span>
        <EditableText 
            value={simpleImage.name} 
            onSave={updateSimpleImageName}
            placeholder="이미지 이름"
            class="flex-1"
        />
    </div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>URL :</span>
        <EditableText 
            value={simpleImage.url} 
            onSave={updateSimpleImageUrl}
            placeholder="이미지 URL"
            class="flex-1"
        />
    </div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>Alt :</span>
        <EditableText 
            value={simpleImage.alt || ''} 
            onSave={updateSimpleImageAlt}
            placeholder="대체 텍스트"
            class="flex-1"
        />
    </div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>너비 :</span>
        <EditableSize 
            value={simpleImage.width || ''} 
            onSave={updateSimpleImageWidth}
            placeholder="예: 300px, 100%"
            class="flex-1"
        />
    </div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>높이 :</span>
        <EditableSize 
            value={simpleImage.height || ''} 
            onSave={updateSimpleImageHeight}
            placeholder="예: 200px, auto"
            class="flex-1"
        />
    </div>
</div>
