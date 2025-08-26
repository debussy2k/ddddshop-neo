import type { LayoutLoad } from './$types';
import { initializeAPI } from '$lib/config/api.config';	
import { getShopicusAPI } from '$lib/service/shopicus.api';

export const load: LayoutLoad = async ({ url }) => {
	let user = null;
	
	// auth 폴더 경로가 아닌 경우에만 실행
	if (!url.pathname.startsWith('/auth')) {
		initializeAPI();

		try {
			// getCurrentUser 함수를 사용하여 현재 사용자 정보를 받아옴
			const api = getShopicusAPI();
			if (api) {
				const response = await api.accountApi.getCurrentUser();
				if (response.data) {
					user = response.data;
					// console.log('현재 사용자:', user);
				}
			}
		} catch (error) {
			console.error('사용자 정보 조회 실패:', error);
			// 에러가 발생해도 페이지 로딩은 계속 진행
		}
	}
	
	return {
		user
	};
};