<script lang="ts">
	import { onMount } from "svelte";
    import type { Showcase } from "./showcase.type";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import  { getShopicusAPI }  from '$lib/service/api.config';
    import { bpm } from "$lib/studio/breakpoint-man.svelte";

    let { data: data }: { data: Showcase } = $props();

	let showcaseData:any  = $state<any>({});

	onMount(async () => {
		console.log('SandboxWidget mounted', data);
		let api = getShopicusAPI();
		await loadShowcaseData();
	});

	export async function loadShowcaseData () {
		if (!data.showcaseCode || data.showcaseCode.trim() === "") return;

		let api = getShopicusAPI();
		let res = await api.productDataApi.shopShowcasesList({
			code: data.showcaseCode
		});
		showcaseData = res.data;
	}

    function handleClick(event: MouseEvent) {
        studioDoc.activeId = data.id;
        // 이벤트 버블링 방지
        event.stopPropagation();
    }

    // 현재 쇼케이스가 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === data.id);
    function getShowcaseClasses(isActive: boolean): string {
        const baseClasses = `border border-blue-400 rounded-lg p-4 cursor-pointer w-[200px] h-[100px]`;
        const activeClasses = 'bg-white border-blue-600';
        const inactiveClasses = 'bg-white ';

        let mobileClass = "w-full h-auto ";
        let tabletClass = ""; //"@3xl:w-full @3xl:h-[220px]";
		let desktopClass = ""; //"@3xl:w-full @3xl:h-auto";

        return `${baseClasses} ${mobileClass} ${tabletClass} ${desktopClass} ${isActive ? activeClasses : inactiveClasses} `;
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
	<div class='text-center text-gray-700 font-medium'
		style={`font-size: ${data.prop?.[bpm.current]?.titleFontSize}px; font-style: ${data.prop?.[bpm.current]?.titleFontStyle};`}
	>
		{showcaseData.title}
	</div>
	<div  class='text-center text-gray-900 text-2xl'>
		{showcaseData.desc}
	</div>
    <div class="grid grid-cols-4 gap-4 mt-6  @3xl:grid-cols-8">
		{#each showcaseData.categories as item}
			<div class='flex flex-col items-center'>
				<div class='aspect-square'>
					<img src={item.imageUrl} alt={item.promoText} class='object-cover' />
				</div>
				<div class='text-sm whitespace-nowrap'>{item.promoText}</div>
			</div>
		{/each}
    </div>
</div>
