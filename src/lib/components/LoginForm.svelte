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
				// 로그인 성공 후 폼 초기화
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

<div class="login-form">
	<h2>로그인</h2>
	
	{#if errorMessage}
		<div class="error-message" role="alert">
			{errorMessage}
		</div>
	{/if}

	<form on:submit|preventDefault={handleLogin}>
		<div class="form-group">
			<label for="userId">사용자 ID</label>
			<input
				id="userId"
				type="text"
				bind:value={userId}
				on:keypress={handleKeyPress}
				placeholder="사용자 ID를 입력하세요"
				required
				disabled={isLoading}
			/>
		</div>

		<div class="form-group">
			<label for="password">비밀번호</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				on:keypress={handleKeyPress}
				placeholder="비밀번호를 입력하세요"
				required
				disabled={isLoading}
			/>
		</div>

		<div class="form-group checkbox-group">
			<label class="checkbox-label">
				<input
					type="checkbox"
					bind:checked={rememberMe}
					disabled={isLoading}
				/>
				<span class="checkmark"></span>
				로그인 상태 유지
			</label>
		</div>

		<button 
			type="submit" 
			class="login-button" 
			disabled={isLoading}
		>
			{#if isLoading}
				<span class="loading-spinner"></span>
				로그인 중...
			{:else}
				로그인
			{/if}
		</button>
	</form>

	<div class="login-links">
		<a href="#" class="link">아이디 찾기</a>
		<span class="separator">|</span>
		<a href="#" class="link">비밀번호 찾기</a>
	</div>
</div>

<style>
	.login-form {
		max-width: 400px;
		margin: 0 auto;
		padding: 2rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	h2 {
		text-align: center;
		margin-bottom: 2rem;
		color: #333;
		font-size: 1.5rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #555;
	}

	input[type="text"],
	input[type="password"] {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}

	input[type="text"]:focus,
	input[type="password"]:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
	}

	input:disabled {
		background-color: #f5f5f5;
		cursor: not-allowed;
	}

	.checkbox-group {
		display: flex;
		align-items: center;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		cursor: pointer;
		font-size: 0.9rem;
		color: #666;
	}

	.checkbox-label input[type="checkbox"] {
		width: auto;
		margin-right: 0.5rem;
	}

	.login-button {
		width: 100%;
		padding: 0.75rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.login-button:hover:not(:disabled) {
		background-color: #0056b3;
	}

	.login-button:disabled {
		background-color: #6c757d;
		cursor: not-allowed;
	}

	.loading-spinner {
		width: 16px;
		height: 16px;
		border: 2px solid #ffffff;
		border-top: 2px solid transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.error-message {
		background-color: #f8d7da;
		color: #721c24;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
		border: 1px solid #f5c6cb;
		font-size: 0.9rem;
	}

	.login-links {
		text-align: center;
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid #eee;
	}

	.link {
		color: #007bff;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.link:hover {
		text-decoration: underline;
	}

	.separator {
		margin: 0 0.5rem;
		color: #ccc;
	}
</style>
