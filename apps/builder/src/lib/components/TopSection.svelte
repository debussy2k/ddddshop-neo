<script lang="ts">
	import { isLogined, getCurrentUser } from '$lib/stores/auth.store.svelte';
	import { getShopicusAPI } from '$lib/service/shopicus.api';

	// 반응형으로 로그인 상태와 사용자 정보 추적
	let userLoggedIn = $derived(isLogined());
	let currentUser = $derived(getCurrentUser());

	function loginAsTeacher() {
		let login_callback_url = `http://localhost:7000/admin/studio/auth/login-tv-callback`;

		// 로그인을 했던 페이지를 기록하고, 로그인 후 다시 띄움
		let url_to_landing_after_login = location.href;
		localStorage.setItem('url_to_landing_after_login', url_to_landing_after_login);

		let url = `https://shop.teacherville.co.kr/pod/login?mode=pod_page&callback_url=${login_callback_url}`;
		window.open(url, '_self');
	}

	async function handleLogout() {
		const api = getShopicusAPI();
		await api.accountApi.logout();
		// 로그아웃 후 현재 페이지 새로고침
		window.location.reload();
	}
</script>

<div class="flex h-[48px] items-center justify-between border-b border-gray-200 px-4">
	<div class="flex items-center">ddddShop</div>
	<div class="flex items-center gap-3">
		{#if userLoggedIn}
			<span class="text-gray-500">Hello, {currentUser?.username}</span>
			<button 
				class="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 hover:border-red-500 rounded-md transition-colors"
				onclick={handleLogout}
			>
				로그아웃
			</button>
		{:else}
			<button class="text-gray-500" onclick={loginAsTeacher}>
				<span class="text-gray-500">Login</span>
			</button>
		{/if}
	</div>
</div>
