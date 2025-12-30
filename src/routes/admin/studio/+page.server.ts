import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const tenant = url.searchParams.get('tenant') || 'default';
    const path = url.searchParams.get('path') || 'default';
    const docKey = `studio_doc_${tenant}_${path}`;

    return {
        docKey
    };
};

