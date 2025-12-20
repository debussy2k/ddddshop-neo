<script lang="ts">
    import type { PageData } from './$types';
    import type { PageEnvData } from '@pages/types';
    import { JsonView } from '@zerodevx/svelte-json-view';

    let { data }: { data: PageData } = $props();
	let PageComp = $state<any>(null); // 컴포넌트로 바로 쓰기 위해서는 변수명은 반드시 대문자로 시작.

	let pageEnvData: PageEnvData = {
		path: data.path,
		site: {
			tenant_id: data.site!.tenant_id,
			site_id: data.site!.site_id
		},
		tenantSiteKey: data.tenantSiteKey,
		pageComponentPath: data.pageComponentPath
	}

	/*
		SSR이 작동할 수 있도록 onMount에서 처리하지 않음.
	*/

	// code splitting을 하여 lazy loading을 함.
	const modules = import.meta.glob(`@pages/*/*.svelte`);
	console.log('### modules:', modules);

	// data.pageComponentPath가 변경될 때마다 컴포넌트를 다시 로드
	$effect(() => {
		load(data.pageComponentPath);
	});

	async function load(componentPath: string) {
		const modulePath = `/src/pages/${componentPath}`;
		const loader = modules[modulePath];
		if (loader) {
			PageComp = (await loader() as { default: any }).default;
		} else {
			console.error(`Component not found: ${modulePath}`);
		}
	}

</script>

<!-- <div class="">
    <JsonView json={data} />
</div> -->

<hr>
{#if PageComp}
	<PageComp data={pageEnvData} />
{/if}