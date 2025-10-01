import { SITE_CONFIG } from '../config/site.config';
import { initializeShopicusAPI, getShopicusAPI as _getShopicusAPI } from './shopicus.api';

// API 기본 설정
const API_CONFIG = {
	baseUrl: import.meta.env.VITE_SHOPICUS_API_BASE_URL || SITE_CONFIG.backendApiUrl,
	baseApiParams: {
		credentials: 'include' as RequestCredentials,
		headers: {
			'Content-Type': 'application/json',
			'SP-MallCode': SITE_CONFIG.mallCode // 호출하는 곳의 domain이 확정적이지 못한 경우 전달한 MallCode가 사용됨
		}
	}
};

let initialized = false;

// API 초기화 함수
function initializeAPI() {
	if (initialized) {
		return;
	}

	try {
		initializeShopicusAPI(API_CONFIG);
		console.log('Shopicus API가 성공적으로 초기화되었습니다.');
		initialized = true;
	} catch (error) {
		console.error('Shopicus API 초기화 실패:', error);
		throw error;
	}
}

export function getShopicusAPI() {
	initializeAPI();
	return _getShopicusAPI();
}