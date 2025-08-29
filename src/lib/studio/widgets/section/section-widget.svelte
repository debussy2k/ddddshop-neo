<script lang="ts">
    import type { Section } from "./section-actions";
    import { studioDoc } from "../../studio-doc.svelte";

    let { section }: { section: Section } = $props();

    function handleClick() {
        studioDoc.activeId = section.id;
    }

    // 현재 섹션이 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === section.id);
</script>

<div 
    class={`border-b border-blue-500 border-dotted cursor-pointer ${
        isActive 
            ? 'bg-blue-200 hover:bg-blue-300 border-solid' 
            : 'bg-red-100 hover:bg-red-200'
    }`}
    style:height={section.height}
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
    {section.name}
</div>
