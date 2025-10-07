<script lang="ts">
    import { onMount } from "svelte";
    import type { Sandbox } from "./sandbox.type";
    import { studioDoc } from "../../studio-doc.svelte";
    import { bpm } from "../../breakpoint-man.svelte";
    import { canvasManager } from "../../canvas-manager.svelte"; // 추가
    import { cmdSandbox as cmd } from "$lib/studio/command";
    import { getComputedVal } from "$lib/studio/widgets/common/computed-value-util";
	import CommonProperty from "../common/common-property.svelte";

    let { data }: { data: Sandbox } = $props();
    let currentProp = $derived(data.prop?.[bpm.current]);
    let parentProp = $derived(studioDoc.getParentByChildId(data.id)?.prop?.[bpm.current]);
    let computedVal = $derived.by(() => {
        // console.log("parentSize", canvasManager.currentWidth)
        canvasManager.currentWidth; // 의존성만 추가. canvas크기가 변경되어도 반응하도록 함.
        canvasManager.needUpdate;   // 의존성만 추가. 
        return getComputedVal(data);
    })
  
    onMount(() => {
    });


    function updateSandboxText(newText: string) {
        cmd.update(data.id, { text: newText });
    }

    function updateSandboxName(newName: string) {
        cmd.update(data.id, { name: newName });
    }
</script>

<div class="relative bg-white text-sm w-full h-full flex flex-col gap-x-2">
    <div class='border-b border-gray-200 py-2 px-4'>샌드박스</div>
    
    <!-- <div class='p-2 flex items-center gap-2'>
        <span>이름 :</span>
        <EditableText 
            value={sandbox.name} 
            onSave={updateSandboxName}
            placeholder="샌드박스 이름"
            class="flex-1"
        />
    </div> -->
    
    <!-- <div class='p-2 flex items-center gap-2'>
        <span>T :</span>
        <EditableText 
            value={sandbox.text} 
            onSave={updateSandboxText}
            placeholder="표시할 텍스트"
            class="flex-1"
        />
    </div> -->

	{#if parentProp}
		<CommonProperty data={data} cmd={cmd} {parentProp} {currentProp} {computedVal} />
	{/if}
</div>