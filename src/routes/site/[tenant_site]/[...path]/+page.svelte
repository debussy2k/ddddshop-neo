<script lang="ts">
    import type { PageData } from './$types';
    import { JsonView } from '@zerodevx/svelte-json-view';

    let { data }: { data: PageData } = $props();
	let pageComp = $state<any>(null);

	/*
		SSR이 작동할 수 있도록 onMount에서 처리하지 않음.
	*/


	// Vite glob으로 모든 pageComponent를 미리 매핑
	const modules = import.meta.glob(`./pageComponent/**/index.svelte`);
	console.log('### modules:', modules);

	load();
	async function load() {
		const modulePath = `${data.pageComponentPath}/index.svelte`;
		const loader = modules[modulePath];
		if (loader) {
			pageComp = (await loader() as { default: any }).default;
		} else {
			console.error(`Component not found: ${modulePath}`);
		}
	}

</script>

<div class="">
    <JsonView json={data} />
</div>

<hr>

Link: <a href="my-link">my-link</a>

<hr>
{@render pageComp?.()}