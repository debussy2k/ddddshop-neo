<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import cloudIf from '$lib/components/cloudif';

	// 페이지 파라미터
	$: slug = $page.params.slug;
	
	// 카테고리 정보
	let category: any = null;
	let products: any[] = [];
	let filteredProducts: any[] = [];
	let isLoading = true;
	let error: string | null = null;
	
	// 정렬 및 필터링
	let sortBy = 'name';
	let priceRange = { min: 0, max: 1000000 };
	
	// 카테고리별 상품 데이터 (실제로는 API에서 가져와야 함)
	const categoryData = {
		'book': {
			name: '도서',
			title: '도서 카테고리',
			description: '다양한 도서를 만나보세요',
			bannerImageUrl: 'https://via.placeholder.com/1200x300/4A90E2/FFFFFF?text=도서+카테고리',
			products: [
				{
					id: 1,
					name: '프로그래밍 기초',
					price: 25000,
					imageUrl: 'https://via.placeholder.com/200x250/FF6B6B/FFFFFF?text=프로그래밍+기초',
					description: '프로그래밍의 기초를 배우는 책'
				},
				{
					id: 2,
					name: '웹 개발 완벽 가이드',
					price: 32000,
					imageUrl: 'https://via.placeholder.com/200x250/4ECDC4/FFFFFF?text=웹+개발+가이드',
					description: '웹 개발의 모든 것을 담은 책'
				},
				{
					id: 3,
					name: '데이터 구조와 알고리즘',
					price: 28000,
					imageUrl: 'https://via.placeholder.com/200x250/45B7D1/FFFFFF?text=데이터+구조',
					description: '효율적인 프로그래밍을 위한 필수 지식'
				},
				{
					id: 8,
					name: '인공지능 입문',
					price: 35000,
					imageUrl: 'https://via.placeholder.com/200x250/FF8C42/FFFFFF?text=AI+입문',
					description: 'AI의 기본 개념과 활용법'
				}
			]
		},
		'electronics': {
			name: '전자제품',
			title: '전자제품 카테고리',
			description: '최신 전자제품을 확인하세요',
			bannerImageUrl: 'https://via.placeholder.com/1200x300/FF6B6B/FFFFFF?text=전자제품+카테고리',
			products: [
				{
					id: 4,
					name: '스마트폰',
					price: 800000,
					imageUrl: 'https://via.placeholder.com/200x250/96CEB4/FFFFFF?text=스마트폰',
					description: '최신 스마트폰'
				},
				{
					id: 5,
					name: '노트북',
					price: 1200000,
					imageUrl: 'https://via.placeholder.com/200x250/FFEAA7/FFFFFF?text=노트북',
					description: '고성능 노트북'
				},
				{
					id: 9,
					name: '무선 이어폰',
					price: 150000,
					imageUrl: 'https://via.placeholder.com/200x250/FF6B6B/FFFFFF?text=무선+이어폰',
					description: '노이즈 캔슬링 무선 이어폰'
				},
				{
					id: 10,
					name: '스마트워치',
					price: 300000,
					imageUrl: 'https://via.placeholder.com/200x250/4ECDC4/FFFFFF?text=스마트워치',
					description: '건강 모니터링 스마트워치'
				}
			]
		},
		'clothing': {
			name: '의류',
			title: '의류 카테고리',
			description: '스타일리시한 의류를 만나보세요',
			bannerImageUrl: 'https://via.placeholder.com/1200x300/FF8C42/FFFFFF?text=의류+카테고리',
			products: [
				{
					id: 6,
					name: '캐주얼 티셔츠',
					price: 15000,
					imageUrl: 'https://via.placeholder.com/200x250/FF6B6B/FFFFFF?text=티셔츠',
					description: '편안한 캐주얼 티셔츠'
				},
				{
					id: 7,
					name: '데님 팬츠',
					price: 45000,
					imageUrl: 'https://via.placeholder.com/200x250/4ECDC4/FFFFFF?text=데님팬츠',
					description: '클래식한 데님 팬츠'
				},
				{
					id: 11,
					name: '후드 집업',
					price: 35000,
					imageUrl: 'https://via.placeholder.com/200x250/45B7D1/FFFFFF?text=후드집업',
					description: '편안한 후드 집업'
				}
			]
		},
		'food': {
			name: '식품',
			title: '식품 카테고리',
			description: '신선하고 맛있는 식품을 만나보세요',
			bannerImageUrl: 'https://via.placeholder.com/1200x300/96CEB4/FFFFFF?text=식품+카테고리',
			products: [
				{
					id: 12,
					name: '유기농 과일 세트',
					price: 25000,
					imageUrl: 'https://via.placeholder.com/200x250/FF8C42/FFFFFF?text=유기농+과일',
					description: '신선한 유기농 과일 세트'
				},
				{
					id: 13,
					name: '프리미엄 커피',
					price: 18000,
					imageUrl: 'https://via.placeholder.com/200x250/FF6B6B/FFFFFF?text=프리미엄+커피',
					description: '고급 원두 커피'
				}
			]
		},
		'furniture': {
			name: '가구',
			title: '가구 카테고리',
			description: '편안하고 아름다운 가구를 만나보세요',
			bannerImageUrl: 'https://via.placeholder.com/1200x300/45B7D1/FFFFFF?text=가구+카테고리',
			products: [
				{
					id: 14,
					name: '모던 소파',
					price: 800000,
					imageUrl: 'https://via.placeholder.com/200x250/FFEAA7/FFFFFF?text=모던+소파',
					description: '세련된 디자인의 모던 소파'
				},
				{
					id: 15,
					name: '책상 세트',
					price: 350000,
					imageUrl: 'https://via.placeholder.com/200x250/96CEB4/FFFFFF?text=책상+세트',
					description: '실용적인 책상과 의자 세트'
				}
			]
		},
		'sports': {
			name: '스포츠',
			title: '스포츠 카테고리',
			description: '활동적인 라이프스타일을 위한 스포츠 용품',
			bannerImageUrl: 'https://via.placeholder.com/1200x300/FF6B6B/FFFFFF?text=스포츠+카테고리',
			products: [
				{
					id: 16,
					name: '운동화',
					price: 120000,
					imageUrl: 'https://via.placeholder.com/200x250/4ECDC4/FFFFFF?text=운동화',
					description: '편안한 러닝 운동화'
				},
				{
					id: 17,
					name: '요가 매트',
					price: 25000,
					imageUrl: 'https://via.placeholder.com/200x250/FF8C42/FFFFFF?text=요가+매트',
					description: '안전하고 편안한 요가 매트'
				}
			]
		}
	};

	onMount(() => {
		loadCategoryData();
	});

	function loadCategoryData() {
		try {
			isLoading = true;
			error = null;
			
			// slug에 해당하는 카테고리 데이터 찾기
			if (slug && categoryData[slug as keyof typeof categoryData]) {
				category = categoryData[slug as keyof typeof categoryData];
			} else {
				category = categoryData['book']; // 기본값
			}
			products = category.products || [];
			filteredProducts = [...products];
			
			// 페이지 제목 설정
			document.title = `${category.title} - DDDD Shop Neo`;
			
		} catch (err) {
			error = '카테고리 정보를 불러오는데 실패했습니다.';
			console.error('카테고리 로딩 오류:', err);
		} finally {
			isLoading = false;
		}
	}

	function formatPrice(price: number): string {
		return price.toLocaleString('ko-KR') + '원';
	}

	function handleProductClick(product: any) {
		console.log('상품 클릭:', product);
		// 여기에 상품 상세 페이지로 이동하는 로직 추가
	}

	function addToCart(product: any) {
		console.log('장바구니에 추가:', product);
		// 여기에 장바구니 추가 로직 구현
		alert(`${product.name}이(가) 장바구니에 추가되었습니다.`);
	}

	function sortProducts() {
		filteredProducts = [...products].sort((a, b) => {
			switch (sortBy) {
				case 'name':
					return a.name.localeCompare(b.name);
				case 'price-low':
					return a.price - b.price;
				case 'price-high':
					return b.price - a.price;
				default:
					return 0;
			}
		});
	}

	function filterByPrice() {
		filteredProducts = products.filter(product => 
			product.price >= priceRange.min && product.price <= priceRange.max
		);
	}

	$: if (products.length > 0) {
		sortProducts();
		filterByPrice();
	}
</script>

<svelte:head>
	<title>{category?.title || '카테고리'} - DDDD Shop Neo</title>
	<meta name="description" content={category?.description || '카테고리 상품을 확인하세요'} />
</svelte:head>

{#if isLoading}
	<div class="loading-container">
		<div class="loading-spinner"></div>
		<p>카테고리 정보를 불러오는 중...</p>
	</div>
{:else if error}
	<div class="error-container">
		<h2>오류가 발생했습니다</h2>
		<p>{error}</p>
		<button class="retry-button" on:click={loadCategoryData}>다시 시도</button>
	</div>
{:else if category}
	<!-- 배너 섹션 -->
	<div class="category-banner">
		<img src={category.bannerImageUrl} alt={category.title} class="banner-image" />
		<div class="banner-overlay">
			<div class="banner-content">
				<h1 class="category-title">{category.title}</h1>
				<p class="category-description">{category.description}</p>
			</div>
		</div>
	</div>

	<!-- 메인 컨텐츠 -->
	<main class="category-main">
		<div class="container">
			<!-- 브레드크럼 네비게이션 -->
			<nav class="breadcrumb">
				<a href="/" class="breadcrumb-item">홈</a>
				<span class="breadcrumb-separator">/</span>
				<span class="breadcrumb-current">{category.name}</span>
			</nav>

			<!-- 카테고리 정보 -->
			<div class="category-header">
				<h2>{category.name}</h2>
				<p class="product-count">총 {filteredProducts.length}개의 상품</p>
			</div>

			<!-- 정렬 및 필터링 -->
			<div class="filters-section">
				<div class="sort-controls">
					<label for="sort-select">정렬:</label>
					<select id="sort-select" bind:value={sortBy}>
						<option value="name">이름순</option>
						<option value="price-low">가격 낮은순</option>
						<option value="price-high">가격 높은순</option>
					</select>
				</div>
				
				<div class="price-filter">
					<label>가격 범위:</label>
					<div class="price-inputs">
						<input 
							type="number" 
							placeholder="최소가격" 
							bind:value={priceRange.min}
							min="0"
						/>
						<span>~</span>
						<input 
							type="number" 
							placeholder="최대가격" 
							bind:value={priceRange.max}
							min="0"
						/>
					</div>
				</div>
			</div>

			<!-- 상품 목록 -->
			{#if filteredProducts.length > 0}
				<div class="products-grid">
					{#each filteredProducts as product}
						<div class="product-card" on:click={() => handleProductClick(product)}>
							<div class="product-image-container">
								<img src={product.imageUrl} alt={product.name} class="product-image" />
								<div class="product-overlay">
									<button class="view-details-btn">상세보기</button>
								</div>
							</div>
							<div class="product-info">
								<h3 class="product-name">{product.name}</h3>
								<p class="product-description">{product.description}</p>
								<div class="product-footer">
									<div class="product-price">{formatPrice(product.price)}</div>
									<button class="add-to-cart-btn" on:click|stopPropagation={() => addToCart(product)}>
										🛒 장바구니
									</button>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="no-products">
					<p>이 카테고리에 등록된 상품이 없습니다.</p>
				</div>
			{/if}
		</div>
	</main>
{/if}

<style>
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: 2rem;
	}

	.loading-spinner {
		width: 50px;
		height: 50px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #007bff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.error-container {
		text-align: center;
		padding: 4rem 2rem;
	}

	.retry-button {
		background: #007bff;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1rem;
		margin-top: 1rem;
	}

	.retry-button:hover {
		background: #0056b3;
	}

	.category-banner {
		position: relative;
		width: 100%;
		height: 300px;
		overflow: hidden;
		margin-top: 70px; /* GNB 높이만큼 여백 */
	}

	.banner-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.banner-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.banner-content {
		text-align: center;
		color: white;
	}

	.category-title {
		font-size: 3rem;
		font-weight: bold;
		margin: 0 0 1rem 0;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
	}

	.category-description {
		font-size: 1.2rem;
		margin: 0;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	}

	.category-main {
		padding: 3rem 0;
		background: #f8f9fa;
		min-height: 60vh;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		margin-bottom: 2rem;
		padding: 1rem 0;
	}

	.breadcrumb-item {
		color: #007bff;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.breadcrumb-item:hover {
		color: #0056b3;
		text-decoration: underline;
	}

	.breadcrumb-separator {
		margin: 0 0.5rem;
		color: #666;
	}

	.breadcrumb-current {
		color: #333;
		font-weight: 600;
	}

	.category-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.category-header h2 {
		font-size: 2.5rem;
		color: #333;
		margin: 0 0 1rem 0;
	}

	.filters-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		flex-wrap: wrap;
		gap: 1rem;
	}

	.sort-controls, .price-filter {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.sort-controls label, .price-filter label {
		font-weight: 600;
		color: #333;
		white-space: nowrap;
	}

	.sort-controls select {
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.9rem;
		background: white;
	}

	.price-inputs {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.price-inputs input {
		width: 100px;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 0.9rem;
	}

	.price-inputs span {
		color: #666;
		font-weight: 500;
	}

	.product-count {
		font-size: 1.1rem;
		color: #666;
		margin: 0;
	}

	.products-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 2rem;
	}

	.product-card {
		background: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.product-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
	}

	.product-image-container {
		position: relative;
		height: 250px;
		overflow: hidden;
	}

	.product-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.product-card:hover .product-image {
		transform: scale(1.05);
	}

	.product-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.product-card:hover .product-overlay {
		opacity: 1;
	}

	.view-details-btn {
		background: #007bff;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 25px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	.view-details-btn:hover {
		background: #0056b3;
	}

	.product-info {
		padding: 1.5rem;
	}

	.product-name {
		font-size: 1.2rem;
		font-weight: 600;
		color: #333;
		margin: 0 0 0.5rem 0;
		line-height: 1.4;
	}

	.product-description {
		color: #666;
		font-size: 0.9rem;
		margin: 0 0 1rem 0;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.product-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
	}

	.product-price {
		font-size: 1.3rem;
		font-weight: bold;
		color: #007bff;
		margin: 0;
	}

	.add-to-cart-btn {
		background: #28a745;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.add-to-cart-btn:hover {
		background: #218838;
		transform: translateY(-2px);
	}

	.no-products {
		text-align: center;
		padding: 4rem 2rem;
		color: #666;
	}

	/* 반응형 디자인 */
	@media (max-width: 768px) {
		.category-banner {
			height: 200px;
		}

		.category-title {
			font-size: 2rem;
		}

		.category-description {
			font-size: 1rem;
		}

		.container {
			padding: 0 1rem;
		}

		.filters-section {
			flex-direction: column;
			align-items: stretch;
		}

		.sort-controls, .price-filter {
			justify-content: space-between;
		}

		.price-inputs {
			flex: 1;
		}

		.price-inputs input {
			width: 100%;
		}

		.products-grid {
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			gap: 1.5rem;
		}

		.category-header h2 {
			font-size: 2rem;
		}

		.product-footer {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.add-to-cart-btn {
			width: 100%;
		}
	}
</style>
