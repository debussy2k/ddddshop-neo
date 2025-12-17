import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals, params}) => {
	console.log('\n## page.server.ts load');
    console.log('- locals.site:', locals.site);

	const path = "/" + params.path;
	console.log('- params.path:', path);
    
	const key = locals.site?.tenant_id + '-' + locals.site?.site_id;
	const pathMap = getPathMap(key);
	
	return {
		path: path,
		site: locals.site,
		tenant_site_key: locals.site?.tenant_id + '-' + locals.site?.site_id,
		pageComponentPath: pathMap[path].componentPath,
		pathMap: pathMap
	};
}

function getPathMap(key: string) {
	if (key === 'tville-ddddshop') {
		return {
			'/': {
				component: 'home',
				componentPath: `./pageComponent/${key}/home`,
			},
			'/about': {
				component: 'about',
				componentPath: `./pageComponent/${key}/about`,
			},
			'/about_copy1': {
				component: 'about_copy1',
				componentPath: `./pageComponent/${key}/about_copy1`,
			},			
		}
	}
	return null;
}