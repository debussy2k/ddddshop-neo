<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeAPI } from '$lib/config/api.config';	
	import { getShopicusAPI } from '$lib/service/shopicus.api';

	onMount(async () => {
		console.log('login-tv-callback');

		const provider = 'tvill';
		// URL에서 auth_key 파라미터 가져오기
		const urlParams = new URLSearchParams(window.location.search);
		const loginKey = urlParams.get('auth_key');
		const secondaryLoginKey = urlParams.get('auth_key2');

		console.log('loginKey:', loginKey);
		console.log('secondaryLoginKey:', secondaryLoginKey);	
		console.log('provider:', provider);	

		if (loginKey) {
			try {
				await signInExternal(provider, loginKey, secondaryLoginKey || '');
			} catch (error) {
				console.error('로그인 실패:', error);
			}
		}
	});

	async function signInExternal(provider: string, loginKey: string, secondaryLoginKey: string) {
		try {
			initializeAPI();
			const api = getShopicusAPI();
			
			const loginData = {
				provider: provider,
				loginKey: loginKey,
				secondaryLoginKey: secondaryLoginKey
			};

			console.log('로그인 시도:', loginData);

			const result = await api.accountApi.externalSignInCreate(loginData);
			
			console.log('로그인 성공!');
			console.log('사용자 정보:', result);
			
			return result;
		} catch (error) {
			console.error('외부 로그인 API 호출 실패:', error);
			throw error;
		}
	}
</script>

<div>login-tv-callback</div>