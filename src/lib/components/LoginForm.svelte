<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { getShopicusAPI } from '../service/shopicus.api';
	import type { LoginForm as LoginFormType } from '../service/shopicus.api';

	const dispatch = createEventDispatcher<{
		loginSuccess: { user: any };
		loginError: { error: string };
	}>();

	let userId = '';
	let password = '';
	let rememberMe = false;
	let isLoading = false;
	let errorMessage = '';

	async function handleLogin() {
		if (!userId.trim() || !password.trim()) {
			errorMessage = '사용자 ID와 비밀번호를 입력해주세요.';
			return;
		}

		isLoading = true;
		errorMessage = '';

		try {
			const api = getShopicusAPI();
			if (!api) {
				throw new Error('API가 초기화되지 않았습니다.');
			}

			const loginData: LoginFormType = {
				id: userId.trim(),
				password: password.trim(),
				rememberMe
			};

			const response = await api.accountApi.signIn(loginData);
			
			if (response.data) {
				dispatch('loginSuccess', { user: response.data });
				userId = '';
				password = '';
				rememberMe = false;
			} else {
				throw new Error('로그인에 실패했습니다.');
			}
		} catch (error: any) {
			console.error('로그인 오류:', error);
			
			if (error.error?.isLockedOut) {
				errorMessage = '계정이 잠겼습니다. 관리자에게 문의하세요.';
			} else if (error.error?.isNotAllowed) {
				errorMessage = '로그인이 허용되지 않습니다.';
			} else if (error.error?.requiresTwoFactor) {
				errorMessage = '2단계 인증이 필요합니다.';
			} else {
				errorMessage = error.message || '로그인 중 오류가 발생했습니다.';
			}
			
			dispatch('loginError', { error: errorMessage });
		} finally {
			isLoading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleLogin();
		}
	}
</script>

<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
	<h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">로그인</h2>
	
	{#if errorMessage}
		<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm" role="alert">
			{errorMessage}
		</div>
	{/if}

	<form on:submit|preventDefault={handleLogin} class="space-y-4">
		<div>
			<label for="userId" class="block text-sm font-medium text-gray-700 mb-2">
				사용자 ID
			</label>
			<input
				id="userId"
				type="text"
				bind:value={userId}
				on:keypress={handleKeyPress}
				placeholder="사용자 ID를 입력하세요"
				required
				disabled={isLoading}
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
			/>
		</div>

		<div>
			<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
				비밀번호
			</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				on:keypress={handleKeyPress}
				placeholder="비밀번호를 입력하세요"
				required
				disabled={isLoading}
				class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
			/>
		</div>

		<div class="flex items-center">
			<label class="flex items-center cursor-pointer text-sm text-gray-600">
				<input
					type="checkbox"
					bind:checked={rememberMe}
					disabled={isLoading}
					class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
				/>
				로그인 상태 유지
			</label>
		</div>

		<button 
			type="submit" 
			disabled={isLoading}
			class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
		>
			{#if isLoading}
				<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
				로그인 중...
			{:else}
				로그인
			{/if}
		</button>
	</form>

	<div class="mt-6 pt-4 border-t border-gray-200 text-center text-sm">
		<a href="#" class="text-blue-600 hover:text-blue-800 hover:underline">아이디 찾기</a>
		<span class="mx-2 text-gray-400">|</span>
		<a href="#" class="text-blue-600 hover:text-blue-800 hover:underline">비밀번호 찾기</a>
	</div>
</div>
