<script lang="ts">
	import { onMount } from "svelte";
	import type { ContainerPropValue } from "../../types";
    import type { Frame } from "./frame.type";
    import { studioDoc } from "../../studio-doc.svelte";
    import { canvasManager } from "../../canvas-manager.svelte"; // 추가
    import { cmdFrame as cmd } from "$lib/studio/command";
	import { getComputedVal } from "../common/computed-value-util";
	import CommonProperty from "../common/common-property.svelte";
	import type { Context } from "$lib/studio/context.svelte";

    let { data, context }: { data: Frame; context: Context } = $props();
    let currentProp = $derived(data.prop?.[context.break]);
    let parentProp:ContainerPropValue = $derived(studioDoc.getParentByChildId(data.id)?.prop?.[context.break] as ContainerPropValue);
    let refreshTrigger = $state(0);
	let computedVal = $derived.by(() => {
        // console.log("parentSize", canvasManager.currentWidth)
        canvasManager.currentWidth; // 의존성만 추가. canvas크기가 변경되어도 반응하도록 함.
        canvasManager.needUpdate;   // 의존성만 추가. 
        refreshTrigger;
        return getComputedVal(data, context.break);
    })

    onMount(() => {
        refreshTrigger++;
    });

</script>

<div class="bg-white text-sm w-full h-full flex flex-col gap-x-2">
    <div class='border-b border-gray-200 py-2 px-4'>프레임</div>
	{#if parentProp}
		<CommonProperty data={data} cmd={cmd} {parentProp} {currentProp} {computedVal} {context} />
	{/if}
</div>
