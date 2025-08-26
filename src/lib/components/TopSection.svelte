<script lang="ts">
	function loginAsTeacher() {
		let login_callback_url = `http://localhost:7000/auth/login-tv-callback`;

		// 로그인을 했던 페이지를 기록하고, 로그인 후 다시 띄움
		let url_to_landing_after_login = location.href;
		localStorage.setItem('url_to_landing_after_login', url_to_landing_after_login);

		let url = `https://shop.teacherville.co.kr/pod/login?mode=pod_page&callback_url=${login_callback_url}`;
		window.open(url, '_self');
	}
</script>

<div class="flex h-[48px] items-center justify-between border-b border-gray-200 px-4">
	<div class="flex items-center">ddddShop</div>
	<div class="flex items-center">
		<button class="text-gray-500" onclick={loginAsTeacher}>
			<span class="text-gray-500">Login</span>
		</button>
	</div>
</div>
