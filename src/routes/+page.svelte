<script lang="ts">
	import { onMount } from 'svelte';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import GlobalNavigation from '$lib/components/GlobalNavigation.svelte';
	import { initializeAPI } from '$lib/config/api.config';
	import cloudIf from '$lib/components/cloudif';
	import TopSection from '$lib/components/TopSection.svelte';
	import { loginResult } from '$lib/service/login-result.service';	
	import { JsonView } from '@zerodevx/svelte-json-view';
	import type { PageData } from './$types';
	
	interface Props {
		data: PageData;
	}
	
	let { data }: Props = $props();

	let showLoginForm = $state(false);
	let productCategories = $state<any>(null);
	let isLoadingCategories = $state(false);
	let categoriesError = $state<string | null>(null);

	onMount(async () => {
		// API 초기화
		try {
			initializeAPI();
			
			// 제품 카테고리 가져오기
			await loadProductCategories();
		} catch (error) {
			console.error('초기화 오류:', error);
		}
	});

	async function loadProductCategories() {
		isLoadingCategories = true;
		categoriesError = null;
		
		try {
			const categories = await cloudIf.getProductCategories();
			productCategories = categories;
			console.log('제품 카테고리:', categories);
		} catch (error) {
			console.error('제품 카테고리 로딩 오류:', error);
			categoriesError = '제품 카테고리를 불러오는 중 오류가 발생했습니다.';
		} finally {
			isLoadingCategories = false;
		}
	}

	function handleLoginSuccess(event: CustomEvent) {
		console.log('로그인 성공:', event.detail.user);
		// 로그인 성공 후 로그인 폼 숨기기
		showLoginForm = false;
	}

	function handleLoginError(event: CustomEvent) {
		console.error('로그인 오류:', event.detail.error);
		// 로그인 오류 처리
	}

	function toggleLoginForm() {
		showLoginForm = !showLoginForm;
	}

	function closeLoginForm() {
		showLoginForm = false;
	}

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
	categories={productCategories || []} 
	isVisible={true}
	onCategoryClick={handleCategoryClick}
/>

<JsonView json={data} />


<main>	
	<!-- 제품 카테고리 섹션 -->
	<div class="categories-section">
		<h2>제품 카테고리</h2>
		
		{#if isLoadingCategories}
			<div class="loading">카테고리를 불러오는 중...</div>
		{:else if categoriesError}
			<div class="error">{categoriesError}</div>
		{:else if productCategories}
			<div class="categories-container">
				<h3>카테고리 데이터 (JSON)</h3>
				<pre class="json-display">{JSON.stringify(productCategories, null, 2)}</pre>
				
				<h3>카테고리 목록</h3>
				<div class="categories-list">
					{#each productCategories as category}
						<div class="category-item">
							<strong>{category.name || '이름 없음'}</strong>
							{#if category.children && category.children.length > 0}
								<div class="subcategories">
									{#each category.children as subcategory}
										<div class="subcategory-item">└ {subcategory.name || '이름 없음'}</div>
									{/each}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div class="no-data">카테고리 데이터가 없습니다.</div>
		{/if}
	</div>
</main>

<style>
	main {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		padding-top: calc(70px + 2rem); /* GNB 높이 + 여백 */
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		gap: 2rem;
	}



	.categories-section {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		max-width: 800px;
		width: 100%;
	}

	.categories-section h2 {
		color: #333;
		margin-bottom: 1.5rem;
		text-align: center;
		font-size: 1.8rem;
	}

	.categories-section h3 {
		color: #555;
		margin: 1.5rem 0 1rem 0;
		font-size: 1.3rem;
	}

	.loading, .error, .no-data {
		text-align: center;
		padding: 2rem;
		color: #666;
		font-size: 1.1rem;
	}

	.error {
		color: #dc3545;
		background: #f8d7da;
		border-radius: 8px;
		border: 1px solid #f5c6cb;
	}

	.json-display {
		background: #f8f9fa;
		border: 1px solid #e9ecef;
		border-radius: 8px;
		padding: 1rem;
		overflow-x: auto;
		font-family: 'Courier New', monospace;
		font-size: 0.9rem;
		line-height: 1.4;
		color: #333;
		max-height: 400px;
		overflow-y: auto;
	}

	.categories-list {
		display: grid;
		gap: 1rem;
		margin-top: 1rem;
	}

	.category-item {
		background: #f8f9fa;
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid #e9ecef;
	}

	.category-item strong {
		color: #333;
		font-size: 1.1rem;
	}

	.subcategories {
		margin-top: 0.5rem;
		margin-left: 1rem;
	}

	.subcategory-item {
		color: #666;
		font-size: 0.9rem;
		margin: 0.25rem 0;
	}
</style>