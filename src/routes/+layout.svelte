<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount, onDestroy } from 'svelte';
	import type { LayoutData } from './$types';
    import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	let { children, data }: { children: any; data: LayoutData } = $props();

	// 네비게이션 대화상자 상태
	let showDialog = $state(false);

		
	// 네비게이션 메뉴 항목들
	const navigationItems = [
		{ label: 'Admin', url: '/admin' },
		{ label: 'Tenant Site', url: '/site/tville-ddddshop' },
		{ label: 'Studio', url: '/admin/studio' },		
		{ label: 'Component Test', url: '/component-test' },
		{ label: 'Site Test', url: '/admin/site-test' },
		{ label: 'DnD Test', url: '/dnd-test' },
	];

    // 키보드 단축키 핸들러
    function handleKeydown(event: KeyboardEvent) {
		// console.log('handleKeydown', event, event.key);
		// Ctrl+Shift+M
		if ((event.ctrlKey || event.metaKey) && event.key === '0') {
			console.log('Ctrl+Shift+0');
			event.preventDefault();
			showDialog = !showDialog;
		}
		// ESC로 대화상자 닫기
		if (event.key === 'Escape') {
			showDialog = false;
		}
	}

	// 네비게이션 항목 클릭 핸들러
	function handleNavigation(url: string) {
		showDialog = false;
		goto(url);
	}

	onMount(async () => {
		console.log('onMount');
        // 브라우저 환경에서만 전역 키보드 이벤트 리스너 추가
        if (browser) {
            document.addEventListener('keydown', handleKeydown);
        }
	});
	onDestroy(() => {
		if (browser) {
			document.removeEventListener('keydown', handleKeydown);
		}
	});

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}


<!-- 네비게이션 대화상자 -->
{#if showDialog}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg shadow-xl p-6 w-80 max-w-md">
			<div class="flex justify-between items-center mb-4">
				<h2 class="text-lg font-semibold text-gray-800">페이지 이동</h2>
				<button 
					class="text-gray-400 hover:text-gray-600"
					onclick={() => showDialog = false}
					aria-label="대화상자 닫기"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>
			
			<div class="space-y-2">
				{#each navigationItems as item}
					<button
						class="w-full text-left px-4 py-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-gray-700 hover:text-gray-900"
						onclick={() => handleNavigation(item.url)}
					>
						<div class="font-medium">{item.label}</div>
						<div class="text-sm text-gray-500">{item.url}</div>
					</button>
				{/each}
			</div>
			
			<div class="mt-6 text-center">
				<p class="text-xs text-gray-400">
					Ctrl+0으로 다시 열거나 ESC로 닫기
				</p>
			</div>
		</div>
	</div>
{/if}
