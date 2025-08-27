<script lang="ts">
	import { onMount } from 'svelte';
	import GlobalNavigation from '$lib/components/GlobalNavigation.svelte';
	import cloudIf from '$lib/components/cloudif';
	import TopSection from '$lib/components/TopSection.svelte';
	import { JsonView } from '@zerodevx/svelte-json-view';
	import type { PageData } from './$types';
	import { categoryStore } from '$lib/stores/category.store.svelte';
	import { showcaseStore } from '$lib/stores/showcase.store.svelte';
	
	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	let productCategories = $state<any>(categoryStore.getCategories())
		
	let showcaseForTeacher = $derived(showcaseStore.getShowcase("for_teacher"));
	let showcaseTopEight = $derived(showcaseStore.getShowcase("top_eight"));
	let showcaseMustMake = $derived(showcaseStore.getShowcase("must_make"));
	let showcaseMdPick = $derived(showcaseStore.getShowcase("md_pick"));
	let showcaseBestSeller = $derived(showcaseStore.getShowcase("best_seller"));

	onMount(async () => {
		// API 초기화
		try {
		} catch (error) {
			console.error('초기화 오류:', error);
		}
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

<TopSection />
<!-- Global Navigation Bar -->
<GlobalNavigation 
	categories={categoryStore.getCategories() || []} 
	isVisible={true}
	onCategoryClick={handleCategoryClick}
/>

<div class="text-xs">
	<div>Categories</div>
	<JsonView json={categoryStore.getCategories()} depth={0} />
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


