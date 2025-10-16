<script lang="ts">
    import type { Showcase } from "./showcase.type";
    import { ShowcaseActions } from "./showcase-actions";
    import { EditableText } from "$lib/components/studio-ui/editable-text";
    import { studioDoc } from "../../studio-doc.svelte";
	import type { Context } from "$lib/studio/context.svelte";

    let { showcase, context }: { showcase: Showcase; context: Context } = $props();

    const cmdShowcase = new ShowcaseActions(studioDoc.historyManager);

    async function updateShowcaseName(newName: string) {
        cmdShowcase.update(showcase.id, { name: newName });
    }

    async function updateShowcaseCode(newCode: string) {
		console.log('showcase', showcase);
		console.log('updateShowcaseCode', newCode);
        await cmdShowcase.update(showcase.id, { showcaseCode: newCode });
    }

	function updateShowcaseTitleFontSize(newFontSize: number) {
		cmdShowcase.updateProp(showcase.id, { titleFontSize: newFontSize }, context.break);
	}

	function updateShowcaseTitleFontWeight(newFontEight: string) {
		cmdShowcase.updateProp(showcase.id, { titleFontWeight: newFontEight }, context.break);
	}

</script>

<div class="bg-white text-sm w-full h-full flex flex-col gap-x-2">
    <div class='border-b border-gray-200 py-2 px-4'>쇼케이스</div>
    
    <div class='p-2 flex items-center gap-2'>
        <span>이름 :</span>
        <EditableText 
            value={showcase.name} 
            onSave={updateShowcaseName}
            placeholder="쇼케이스 이름"
            class="flex-1"
        />
    </div>
    
    <div class='p-2 flex flex-col gap-2'>
        <span>쇼케이스 코드</span>
        <input 
            type="text"
            value={showcase.showcaseCode || ''} 
            onchange={(e) => updateShowcaseCode((e.target as HTMLInputElement).value)}
            placeholder="쇼케이스 코드를 입력하세요"
            class="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
    </div>

	<div class='p-2 mt-4 '>
		<div>쇼케이스 제목</div>
		<div class='space-y-4'>
			<div class=''>
				<span>폰트 크기</span>
				<input
					type="number"
					value={showcase.prop?.[context.break]?.titleFontSize || 16}
					onchange={(e) => updateShowcaseTitleFontSize((e.target as HTMLInputElement).valueAsNumber)}
					placeholder="폰트 크기를 입력하세요"
					class="w-full mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
				/>
			</div>
			<div class=''>
				<span>폰트 두께</span>
				<input
					type="text"
					value={showcase.prop?.[context.break]?.titleFontWeight || "normal"}
					onchange={(e) => updateShowcaseTitleFontWeight((e.target as HTMLInputElement).value)}
					placeholder="폰트 스타일을 입력하세요"
					class="w-full mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
				/>
			</div>
		</div>
	</div>
</div>
