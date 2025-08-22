<script lang="ts">
	import { onMount } from 'svelte';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import { initializeAPI } from '$lib/config/api.config';
	import { user, isAuthenticated, initializeAuth } from '$lib/stores/auth.store';

	let showLoginForm = false;

	onMount(() => {
		// API 초기화
		try {
			initializeAPI();
			// 인증 상태 초기화
			initializeAuth();
		} catch (error) {
			console.error('초기화 오류:', error);
		}
	});

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
</script>

<main>
	{#if $isAuthenticated}
		<div class="welcome-section">
			<h1>환영합니다, {$user?.username || '사용자'}님!</h1>
			<p>로그인이 완료되었습니다.</p>
			<div class="user-info">
				<p><strong>사용자 ID:</strong> {$user?.userid}</p>
				<p><strong>이메일:</strong> {$user?.email || '정보 없음'}</p>
				<p><strong>멤버십:</strong> {$user?.membershipName || '일반'}</p>
				<p><strong>가입일:</strong> {$user?.registerDate ? new Date($user.registerDate).toLocaleDateString('ko-KR') : '정보 없음'}</p>
			</div>
		</div>
	{:else}
		<div class="welcome-section">
			<h1>DDDD Shop Neo에 오신 것을 환영합니다!</h1>
			<p>쇼핑을 시작하려면 로그인해주세요.</p>
			
			{#if showLoginForm}
				<div class="login-container">
					<div class="login-header">
						<h2>로그인</h2>
						<button class="close-button" on:click={closeLoginForm} aria-label="닫기">
							×
						</button>
					</div>
					<LoginForm 
						on:loginSuccess={handleLoginSuccess}
						on:loginError={handleLoginError}
					/>
				</div>
			{:else}
				<button class="login-button" on:click={toggleLoginForm}>
					로그인
				</button>
			{/if}
		</div>
	{/if}
</main>

<style>
	main {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.welcome-section {
		background: white;
		padding: 3rem;
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		text-align: center;
		max-width: 600px;
	}

	.welcome-section h1 {
		color: #333;
		margin-bottom: 1rem;
		font-size: 2rem;
	}

	.welcome-section p {
		color: #666;
		margin-bottom: 2rem;
		font-size: 1.1rem;
	}

	.user-info {
		text-align: left;
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 8px;
		margin-top: 2rem;
	}

	.user-info p {
		margin: 0.5rem 0;
		color: #555;
	}

	.user-info strong {
		color: #333;
	}

	.login-button {
		background-color: #007bff;
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 8px;
		font-size: 1.1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
	}

	.login-button:hover {
		background-color: #0056b3;
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
	}

	.login-container {
		position: relative;
		margin-top: 2rem;
		padding: 2rem;
		background: #f8f9fa;
		border-radius: 8px;
		border: 1px solid #e9ecef;
	}

	.login-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.login-header h2 {
		margin: 0;
		color: #333;
		font-size: 1.3rem;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		color: #666;
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		background-color: #e9ecef;
		color: #333;
	}
</style>