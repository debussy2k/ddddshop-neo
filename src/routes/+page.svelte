<script lang="ts">
	import { onMount } from 'svelte';
	import GlobalNavigation from '$lib/components/GlobalNavigation.svelte';
	import cloudIf from '$lib/components/cloudif';
	import TopSection from '$lib/components/TopSection.svelte';
	import { JsonView } from '@zerodevx/svelte-json-view';
	import type { PageData } from './$types';
	import { categoryStore } from '$lib/stores/category.store.svelte';
	
	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();

	let productCategories = $state<any>(categoryStore.getCategories());

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
	<JsonView json={categoryStore.getCategories()} depth={1} />
</div>
