<script lang="ts">
	import { studioDoc } from "./studio-doc.svelte";
    import type { Section } from "./types";
    import { cmdSection } from "./command";
    let doc = $derived(studioDoc.document);

    function deleteSection(section: Section) {
        cmdSection.removeSection(section.id);
    }
</script>

<div class='border w-full flex-1 h-full overflow-y-auto'>
    {#each doc.sections as section}
        <div class="group relative flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer transition-colors">
            <span>{section.name}</span>
            <button 
                class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1"
                onclick={() => deleteSection(section)}
                title="섹션 삭제"
            >
                ✕
            </button>
        </div>
    {/each}
    
</div>

