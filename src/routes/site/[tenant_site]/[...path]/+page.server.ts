import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({locals, params}) => {
	console.log('\n## page.server.ts load');
    console.log('- locals.site:', locals.site);

	const path = params.path;
	console.log('- params.path:', path);
    
	return {
		site: locals.site
	};
}