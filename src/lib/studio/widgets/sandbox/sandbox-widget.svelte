<script lang="ts">
    import type { Sandbox } from "./sandbox-actions";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";

    let { data: data }: { data: Sandbox } = $props();

    function handleClick(event: MouseEvent) {
        studioDoc.activeId = data.id;
        // 이벤트 버블링 방지
        event.stopPropagation();
    }

    // 현재 샌드박스가 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === data.id);
</script>

<div 
    class={`border border-green-400 rounded-lg p-4 cursor-pointer w-[200px] h-[100px]  ${
        isActive 
            ? 'bg-green-100 hover:bg-green-200 border-green-600' 
            : 'bg-green-50 hover:bg-green-100'
    }`}
    onclick={(e) => handleClick(e as MouseEvent)}
    role="button"
    tabindex="0"
    onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e);
        }
    }}
>
    <div class="flex flex-col items-center justify-center ">
        <div class="text-center text-gray-700 font-medium">
            {data.text}
        </div>
    </div>
</div>
