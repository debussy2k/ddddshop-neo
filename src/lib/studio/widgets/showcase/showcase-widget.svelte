<script lang="ts">
    import type { Showcase } from "./showcase.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";

    let { data: data }: { data: Showcase } = $props();

    function handleClick(event: MouseEvent) {
        studioDoc.activeId = data.id;
        // 이벤트 버블링 방지
        event.stopPropagation();
    }

    // 현재 쇼케이스가 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === data.id);
    function getShowcaseClasses(isActive: boolean): string {
        const baseClasses = `border border-blue-400 rounded-lg p-4 cursor-pointer w-[200px] h-[100px]`;
        const activeClasses = 'bg-blue-100 hover:bg-blue-200 border-blue-600';
        const inactiveClasses = 'bg-blue-50 hover:bg-blue-100';

        let mobileClass = "w-full h-[100px]";
        let tabletClass = "@3xl:w-[200px] @3xl:h-[120px]";

        return `${baseClasses} ${mobileClass} ${tabletClass} ${isActive ? activeClasses : inactiveClasses} `;
    }

</script>

<div 
    class={getShowcaseClasses(isActive)}
    onclick={(e) => handleClick(e as MouseEvent)}
    role="button"
    tabindex="0"
    onkeydown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as unknown as MouseEvent);
        }
    }}
>
    <div class="flex flex-col items-center justify-center ">
        <div class="text-center text-gray-700 font-medium">
            {data.text}
        </div>
    </div>
</div>
