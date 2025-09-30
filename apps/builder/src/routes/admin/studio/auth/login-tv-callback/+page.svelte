<script lang="ts">
	import { onMount } from 'svelte';
	import { getShopicusAPI } from '$lib/service/api.config';	
	import { loginResult } from '$lib/service/login-result.service';

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

				// 로그인 후 이동할 URL 가져오기
				const urlToLandingAfterLogin = localStorage.getItem('url_to_landing_after_login');
				
				// localStorage에서 제거
				localStorage.removeItem('url_to_landing_after_login');

				// 저장된 URL이 있으면 해당 페이지로 이동, 없으면 홈으로 이동
				window.location.href = urlToLandingAfterLogin || '/';
			} catch (error) {
				console.error('로그인 실패:', error);
			}
		}
	});

	async function signInExternal(provider: string, loginKey: string, secondaryLoginKey: string) {
		try {
			// 로그인 시도 정보를 서비스에 저장
			loginResult.saveLoginAttempt(provider, loginKey, secondaryLoginKey);

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
			
			// 로그인 성공 결과를 서비스에 업데이트
			loginResult.updateLoginSuccess(result);
			
			return result;
		} catch (error) {
			console.error('외부 로그인 API 호출 실패:', error);
			
			// 로그인 실패 결과를 서비스에 업데이트
			loginResult.updateLoginFailure(error instanceof Error ? error.message : String(error));
			
			throw error;
		}
	}
</script>

<div>login-tv-callback</div>