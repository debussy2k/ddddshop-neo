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
        <div class="group relative flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 cursor-pointer text-sm">
            <div class="flex items-center gap-1.5 flex-1 min-w-0">
                <!-- Figma 스타일 아이콘 -->
                <div class="w-4 h-4 flex items-center justify-center">
                    <div class="w-3 h-3 bg-purple-500 rounded-sm flex items-center justify-center">
                        <div class="w-1.5 h-1.5 bg-white rounded-xs"></div>
                    </div>
                </div>
                <span class="text-gray-800 truncate font-medium">{section.name}</span>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <!-- 눈 아이콘 -->
                <button class="w-4 h-4 text-gray-500 hover:text-gray-700 transition-colors" title="보기 토글" aria-label='Open section'>
                    <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 2C4.5 2 1.7 4.4 1 8c.7 3.6 3.5 6 7 6s6.3-2.4 7-6c-.7-3.6-3.5-6-7-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                </button>
                <!-- 삭제 아이콘 -->
                <button 
                    class="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors mr-1"
                    onclick={() => deleteSection(section)}
                    title="삭제"
                    aria-label='Delete section'
                >
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4L4 12M4 4l8 8"/>
                    </svg>
                </button>
            </div>
        </div>
    {/each}
    
</div>

