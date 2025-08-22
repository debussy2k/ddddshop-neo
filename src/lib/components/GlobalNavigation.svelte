<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let categories: any[] = [];
	export let isVisible: boolean = true;

	const dispatch = createEventDispatcher<{
		categoryClick: { category: any };
	}>();

	let activeCategory: any = null;
	let isMobileMenuOpen = false;

	function handleCategoryClick(category: any) {
		dispatch('categoryClick', { category });
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	function handleCategoryHover(category: any) {
		activeCategory = category;
	}

	function handleCategoryLeave() {
		activeCategory = null;
	}
</script>

<nav class="gnb" class:visible={isVisible}>
	<div class="gnb-container">
		<!-- 로고 영역 -->
		<div class="gnb-logo">
			<a href="/" class="logo-link">
				<span class="logo-text">DDDD Shop Neo</span>
			</a>
		</div>

		<!-- 메인 메뉴 -->
		<div class="gnb-menu">
			<ul class="menu-list">
				{#each categories as category}
					<li 
						class="menu-item"
						class:has-submenu={category.children && category.children.length > 0}
						on:mouseenter={() => handleCategoryHover(category)}
						on:mouseleave={handleCategoryLeave}
					>
						<a 
							href="#" 
							class="menu-link"
							on:click|preventDefault={() => handleCategoryClick(category)}
						>
							{category.name || '카테고리'}
							{#if category.children && category.children.length > 0}
								<span class="dropdown-arrow">▼</span>
							{/if}
						</a>

						<!-- 서브메뉴 -->
						{#if category.children && category.children.length > 0 && activeCategory === category}
							<div class="submenu">
								<div class="submenu-content">
									<div class="submenu-grid">
										{#each category.children as childCategory}
											<div class="submenu-column">
												<h4 class="submenu-title">
													<a 
														href="#" 
														class="submenu-title-link"
														on:click|preventDefault={() => handleCategoryClick(childCategory)}
													>
														{childCategory.name || '서브카테고리'}
													</a>
												</h4>
												{#if childCategory.children && childCategory.children.length > 0}
													<ul class="submenu-list">
														{#each childCategory.children as grandChild}
															<li class="submenu-list-item">
																<a 
																	href="#" 
																	class="submenu-list-link"
																	on:click|preventDefault={() => handleCategoryClick(grandChild)}
																>
																	{grandChild.name || '하위카테고리'}
																</a>
															</li>
														{/each}
													</ul>
												{/if}
											</div>
										{/each}
									</div>
								</div>
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		</div>

		<!-- 우측 메뉴 (검색, 로그인 등) -->
		<div class="gnb-actions">
			<button class="search-button" aria-label="검색">
				🔍
			</button>
			<button class="mobile-menu-toggle" on:click={toggleMobileMenu} aria-label="메뉴 열기">
				☰
			</button>
		</div>
	</div>

	<!-- 모바일 메뉴 -->
	{#if isMobileMenuOpen}
		<div class="mobile-menu-overlay" on:click={closeMobileMenu}></div>
		<div class="mobile-menu">
			<div class="mobile-menu-header">
				<h3>메뉴</h3>
				<button class="close-button" on:click={closeMobileMenu} aria-label="메뉴 닫기">
					×
				</button>
			</div>
			<ul class="mobile-menu-list">
				{#each categories as category}
					<li class="mobile-menu-item">
						<a 
							href="#" 
							class="mobile-menu-link"
							on:click|preventDefault={() => {
								handleCategoryClick(category);
								closeMobileMenu();
							}}
						>
							{category.name || '카테고리'}
						</a>
						{#if category.children && category.children.length > 0}
							<ul class="mobile-submenu">
								{#each category.children as subcategory}
									<li class="mobile-submenu-item">
										<a 
											href="#" 
											class="mobile-submenu-link"
											on:click|preventDefault={() => {
												handleCategoryClick(subcategory);
												closeMobileMenu();
											}}
										>
											{subcategory.name || '서브카테고리'}
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</nav>

<style>
	.gnb {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: white;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		transition: all 0.3s ease;
	}

	.gnb.visible {
		transform: translateY(0);
	}

	.gnb-container {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 2rem;
		height: 70px;
	}

	.gnb-logo {
		flex-shrink: 0;
	}

	.logo-link {
		text-decoration: none;
		color: #333;
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: bold;
		color: #007bff;
	}

	.gnb-menu {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.menu-list {
		display: flex;
		list-style: none;
		margin: 0;
		padding: 0;
		gap: 0;
	}

	.menu-item {
		position: relative;
	}

	.menu-link {
		display: flex;
		align-items: center;
		padding: 1rem 1.5rem;
		text-decoration: none;
		color: #333;
		font-weight: 500;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.menu-link:hover {
		color: #007bff;
		background-color: #f8f9fa;
	}

	.dropdown-arrow {
		margin-left: 0.5rem;
		font-size: 0.8rem;
		transition: transform 0.2s ease;
	}

	.menu-item:hover .dropdown-arrow {
		transform: rotate(180deg);
	}

	.submenu {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		background: white;
		border: 1px solid #e9ecef;
		border-radius: 8px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		min-width: 600px;
		z-index: 1001;
	}

	.submenu-content {
		padding: 1.5rem;
	}

	.submenu-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
	}

	.submenu-column {
		min-width: 0;
	}

	.submenu-title {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 600;
		color: #333;
		border-bottom: 2px solid #007bff;
		padding-bottom: 0.5rem;
	}

	.submenu-title-link {
		text-decoration: none;
		color: #333;
		transition: color 0.2s ease;
	}

	.submenu-title-link:hover {
		color: #007bff;
	}

	.submenu-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.submenu-list-item {
		margin: 0.5rem 0;
	}

	.submenu-list-link {
		display: block;
		padding: 0.5rem 0;
		text-decoration: none;
		color: #666;
		font-size: 0.9rem;
		transition: all 0.2s ease;
		border-radius: 4px;
		padding-left: 0.5rem;
	}

	.submenu-list-link:hover {
		color: #007bff;
		background-color: #f8f9fa;
		padding-left: 0.75rem;
	}

	.gnb-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.search-button {
		background: none;
		border: none;
		font-size: 1.2rem;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 50%;
		transition: background-color 0.2s ease;
	}

	.search-button:hover {
		background-color: #f8f9fa;
	}

	.mobile-menu-toggle {
		display: none;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}

	.mobile-menu-toggle:hover {
		background-color: #f8f9fa;
	}

	.mobile-menu-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	.mobile-menu {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: 300px;
		background: white;
		box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
		z-index: 1001;
		transform: translateX(100%);
		animation: slideIn 0.3s ease forwards;
	}

	@keyframes slideIn {
		to {
			transform: translateX(0);
		}
	}

	.mobile-menu-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #e9ecef;
	}

	.mobile-menu-header h3 {
		margin: 0;
		color: #333;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s ease;
	}

	.close-button:hover {
		background-color: #f8f9fa;
	}

	.mobile-menu-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.mobile-menu-item {
		border-bottom: 1px solid #f1f3f4;
	}

	.mobile-menu-link {
		display: block;
		padding: 1rem 1.5rem;
		text-decoration: none;
		color: #333;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.mobile-menu-link:hover {
		background-color: #f8f9fa;
	}

	.mobile-submenu {
		list-style: none;
		margin: 0;
		padding: 0;
		background: #f8f9fa;
	}

	.mobile-submenu-item {
		border-bottom: 1px solid #e9ecef;
	}

	.mobile-submenu-link {
		display: block;
		padding: 0.75rem 2rem;
		text-decoration: none;
		color: #666;
		font-size: 0.9rem;
		transition: background-color 0.2s ease;
	}

	.mobile-submenu-link:hover {
		background-color: #e9ecef;
		color: #333;
	}

	/* 반응형 디자인 */
	@media (max-width: 768px) {
		.gnb-menu {
			display: none;
		}

		.mobile-menu-toggle {
			display: block;
		}

		.gnb-container {
			padding: 0 1rem;
		}

		.logo-text {
			font-size: 1.2rem;
		}
	}

	@media (min-width: 769px) {
		.mobile-menu-toggle {
			display: none;
		}
	}
</style>
