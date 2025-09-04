<script lang="ts">
    import { onMount } from 'svelte';
    // import { loginResult } from '$lib/service/login-result.service';
	import { getShopicusAPI } from '$lib/service/api.config';
    import { JsonView } from '@zerodevx/svelte-json-view';
    import { setUser, isLogined, getCurrentUser } from '$lib/stores/auth.store.svelte';

	let userLoggedIn = $derived(isLogined());
	let currentUser = $derived(getCurrentUser());
    let api= getShopicusAPI();

    onMount(() => {
        api.accountApi.getCurrentUser().then((res) => {
            console.log(res);
            setUser(res.data);
        });
    });

	function loginAsTeacher() {
		let login_callback_url = `http://localhost:7000/page-loader-plugin/login-callback`;

		// 로그인을 했던 페이지를 기록하고, 로그인 후 다시 띄움
		let url_to_landing_after_login = location.href;
		localStorage.setItem('url_to_landing_after_login', url_to_landing_after_login);

		let url = `https://shop.teacherville.co.kr/pod/login?mode=pod_page&callback_url=${login_callback_url}`;
		window.open(url, '_self');
	}

	async function handleLogout() {
		await api.accountApi.logout();
		// 로그아웃 후 현재 페이지 새로고침
		window.location.reload();
	}
</script>

<div class="flex h-[48px] items-center justify-between border-b border-gray-200 px-4">
	<div class="flex items-center">뚝딱샵 내지 로더 플러그인</div>
	<div class="flex items-center gap-3">
        <!-- <JsonView json={loginResult.currentLoginResult} depth={0} /> -->
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
