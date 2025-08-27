<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { setUser } from '$lib/stores/auth.store';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';

	// import { initializeAPI } from '$lib/service/api.config';	
	import { getShopicusAPI } from '$lib/service/shopicus.api';

	// initializeAPI();

	let { children, data }: { children: any; data: LayoutData } = $props();

	onMount(async () => {
		let api = getShopicusAPI();
		if (api) {
			console.log("user 정보 조회");
			const response = await api.accountApi.getCurrentUser();
			if (response.data) {
				setUser(response.data);
			}
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
