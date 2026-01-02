<script lang="ts">	
	import { onMount } from 'svelte';
	import type { Sandbox } from '$lib/studio/widgets/sandbox';
	import type { Context } from '$lib/studio/context.svelte';
    import  { getShopicusAPI }  from '$lib/service/api.config';
	import type { ShowcaseCompPropValue } from "./showcase.ctype";
	import * as du from '$lib/studio/widgets/common/doc-util';

	let { data, context }: { data: Sandbox; context: Context } = $props();

	let showcaseData:any  = $state<any>({});
	let currentCompProp = $derived(du.resolveProp<ShowcaseCompPropValue>(data.compProp, context.break));


	onMount(() => {
		console.log('Showcase mounted', data);
		let api = getShopicusAPI();
		api.productDataApi.shopShowcasesList({
			code: "for_teacher"
		}).then(res => {
			showcaseData = res.data;
		});
	});
</script>


<div class='rounded-lg'>
	<div class='text-center text-gray-700 font-medium' style={`font-size: 16px; font-weight: normal;`}>
		{showcaseData.title}
	</div>
	<div  class='text-center text-gray-900 text-2xl'>
		{showcaseData.desc}
	</div>	

    <div class="grid gap-4 mt-6" style="grid-template-columns: repeat({currentCompProp.columns}, minmax(0, 1fr))">
		{#each showcaseData.categories ?? [] as item}
			<div class='flex flex-col items-center'>
				<div class='aspect-square'>
					<img src={item.imageUrl} alt={item.promoText} class='object-cover' />
				</div>
				<div class='text-sm whitespace-nowrap'>{item.promoText}</div>
			</div>
		{/each}
    </div>	
</div>
