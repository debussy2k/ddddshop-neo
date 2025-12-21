import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals, params}) => {
	console.log('\n## page.server.ts load');
    console.log('- locals.site:', locals.site);

	const path = "/" + params.path;
	console.log('- params.path:', path);
    
	const key = locals.site?.tenant_id + '-' + locals.site?.site_id;
	const pathMap = getPathMap(key);
	
	// pathMap이 없거나 path가 pathMap에 존재하지 않는 경우 안내 페이지 표시
	if (pathMap === null || !pathMap[path as keyof typeof pathMap]) {
		return {
			notFound: true,
			path: path,
			site: locals.site,
			tenantSiteKey: key,
			pageComponentPath: null,
			pathMap: null
		};
	}
	
	return {
		notFound: false,
		path: path,
		site: locals.site,
		tenantSiteKey: key,
		pageComponentPath: pathMap[path as keyof typeof pathMap].componentPath,
		pathMap: pathMap
	};
}

function getPathMap(key: string) {
	if (key === 'tville-ddddshop') {
		return {
			'/': {
				component: 'home',
				componentPath: `std/home.svelte`,
			},
			'/about': {
				component: 'about',
				componentPath: `std/about.svelte`,
			},
		}
	}
	return null;
}