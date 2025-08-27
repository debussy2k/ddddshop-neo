<script lang="ts">
	import { onMount } from 'svelte';
	import GlobalNavigation from '$lib/components/GlobalNavigation.svelte';
	import cloudIf from '$lib/components/cloudif';
	import TopSection from '$lib/components/TopSection.svelte';
	import { JsonView } from '@zerodevx/svelte-json-view';
	import type { PageData } from './$types';
	import { backendStore } from '$lib/stores/backend.store.svelte';
	
	let productCategories = $derived(backendStore.getCategories())
	let showcaseForTeacher = $derived(backendStore.getShowcase("for_teacher"));
	let showcaseTopEight = $derived(backendStore.getShowcase("top_eight"));
	let showcaseMustMake = $derived(backendStore.getShowcase("must_make"));
	let showcaseMdPick = $derived(backendStore.getShowcase("md_pick"));
	let showcaseBestSeller = $derived(backendStore.getShowcase("best_seller"));
	let bannerSub = $derived(backendStore.getBanner("sub"));

	onMount(async () => {
	});

	function handleCategoryClick(category: any) {
		console.log('선택된 카테고리:', category);
		
		// 카테고리 클릭 시 해당 카테고리 페이지로 이동
		const categorySlug = generateCategorySlug(category);
		if (categorySlug) {
			window.location.href = `/category/${categorySlug}`;
		}
	}

	function generateCategorySlug(category: any): string | null {
		// 카테고리 이름을 기반으로 slug 생성
		if (category.name) {
			// 한글을 영문으로 매핑
			const slugMap: { [key: string]: string } = {
				'도서': 'book',
				'전자제품': 'electronics',
				'의류': 'clothing',
				'식품': 'food',
				'가구': 'furniture',
				'스포츠': 'sports'
			};
			
			return slugMap[category.name] || category.name.toLowerCase().replace(/\s+/g, '-');
		}
		return null;
	}
</script>

<div class='p-2 border-b border-gray-200'>
	<a href="/admin" class='text-sm text-gray-500'>admin</a>
	<a href="/admin/studio" class='text-sm text-gray-500'>studio</a>
</div>


<TopSection />
<!-- Global Navigation Bar -->
<GlobalNavigation 
	categories={productCategories || []} 
	isVisible={true}
	onCategoryClick={handleCategoryClick}
/>

<div class='p-4'>
	<div class="text-xs">
		<div>Categories</div>
		<JsonView json={productCategories} depth={0} />
	</div>
	
	<div>
		<div>Showcases</div>
		<JsonView json={showcaseForTeacher} depth={0} />
	</div>
	
	<div>
		<div>Top Eight</div>
		<JsonView json={showcaseTopEight} depth={0} />
	</div>
	
	<div>
		<div>Must Make</div>
		<JsonView json={showcaseMustMake} depth={0} />
	</div>
	
	<div>
		<div>Md Pick</div>
		<JsonView json={showcaseMdPick} depth={0} />
	</div>
	
	<div>
		<div>Best Seller</div>
		<JsonView json={showcaseBestSeller} depth={0} />
	</div>
	
	<div>
		<div>Banner Sub</div>
		<JsonView json={bannerSub} depth={0} />
	</div>

</div>	
