import { SITE_CONFIG } from './site.config';
import { initializeShopicusAPI } from '../service/shopicus.api';

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

// API 초기화 함수
export function initializeAPI() {
	try {
		initializeShopicusAPI(API_CONFIG);
		console.log('Shopicus API가 성공적으로 초기화되었습니다.');
	} catch (error) {
		console.error('Shopicus API 초기화 실패:', error);
		throw error;
	}
}

// 환경 변수 타입 정의
export interface EnvironmentVariables {
	VITE_SHOPICUS_API_BASE_URL?: string;
}

// 설정 객체 내보내기
export { API_CONFIG };
