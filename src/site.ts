import { type Handle, error } from '@sveltejs/kit';

export const site: Handle = async ({ event , resolve }) => {
    console.log('\n## hooks.server.ts -> site.ts start.');
    // 예외 경로(웹훅 등) 처리 필요하면 여기서 빠르게 리턴/스킵
    const pathname = event.url.pathname;
    console.log('- pathname:', pathname);

    // 1) tenant resolve (Host 기반)
    const host = event.request.headers.get('host');
    console.log('- host:', host);

    if (pathname.startsWith('/site')) {
        const info = await resolveTenantSite(pathname);
        event.locals.site = {
            tenant_id: info.tenant_id,
            site_id: info.site_id
        }

        console.log('- event.locals.site:', event.locals.site);
    }


    // // user resolve (여기서는 Bearer 토큰 기반 최소 예시)
    // // 실제 서비스는 쿠키 세션 기반(SSR)로 바꾸는 걸 추천.
    // event.locals.user = await getUserFromBearer(event);


    return resolve(event);
};

async function resolveTenantSite(pathname: string) {
    // pathname는 "/site/motion1-market/..." 형식에 대해 처리함
    const tenant_site = pathname.split('/')[2];
    // tenant_site는 "motion1_market" 형식으로 들어옴. "_"기준으로 첫번째 단어를 tenant_id로 사용. 두번째 단어를 site_id로 사용.
    const tenant_id = tenant_site.split('-')[0];
    const site_id = tenant_site.split('-')[1];
   
    if (tenant_id !== 'tville') {
        error(404, 'Tenant not found');
    }
    if (site_id !== 'ddddshop') {
        error(404, 'Site not found');
    }

    return {
        tenant_id: tenant_id,
        site_id: site_id
    }
}