<script lang="ts">
    import type { Sandbox } from "./sandbox-actions";
    import { studioDoc } from "../../studio-doc.svelte";

    let { sandbox }: { sandbox: Sandbox } = $props();

    function handleClick() {
        studioDoc.activeId = sandbox.id;
    }

    // 현재 샌드박스가 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === sandbox.id);
</script>

<div 
    class={`border border-green-400 rounded-lg p-4 cursor-pointer w-[200px] h-[100px]  ${
        isActive 
            ? 'bg-green-100 hover:bg-green-200 border-green-600' 
            : 'bg-green-50 hover:bg-green-100'
    }`}
    onclick={handleClick}
    role="button"
    tabindex="0"
    onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    }}
>
    <div class="flex flex-col items-center justify-center min-h-[100px]">
        <div class="text-center text-gray-700 font-medium">
            {sandbox.text}
        </div>
        <div class="text-xs text-gray-500 mt-2">
            {sandbox.name}
        </div>
    </div>
</div>
