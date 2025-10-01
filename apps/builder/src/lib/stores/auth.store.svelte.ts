import type { ShopUser } from '$lib/service/shopicus.api';

type User = ShopUser;

interface AuthStore {
	user: User | null;
	isLoading: boolean;
	error: string | null;
}

// 초기 상태
const initialState: AuthStore = {
	user: null,
	isLoading: false,
	error: null
};

// Svelte 5 runes를 사용한 반응형 스토어
export const authStore = $state<AuthStore>(initialState);

// 로그인 상태 확인 함수 (반응형)
export function isLogined() {
	return authStore.user !== null;
}

// 현재 사용자 정보 함수 (반응형)
export function getCurrentUser() {
	return authStore.user;
}

// 사용자 로그인 함수
export function setUser(user: User | null) {
	authStore.user = user;
	authStore.error = null;
}

// 사용자 로그아웃 함수
export function logout() {
	authStore.user = null;
	authStore.error = null;
}

// 로딩 상태 설정 함수
export function setLoading(isLoading: boolean) {
	authStore.isLoading = isLoading;
}

// 에러 설정 함수
export function setError(error: string | null) {
	authStore.error = error;
}
