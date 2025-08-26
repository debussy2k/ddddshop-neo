import { writable } from 'svelte/store';
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

// 스토어 생성
export const authStore = writable<AuthStore>(initialState);

// 사용자 로그인 함수
export function setUser(user: User | null) {
	authStore.update(state => ({
		...state,
		user,
		error: null
	}));
}

// 사용자 로그아웃 함수
export function logout() {
	authStore.update(state => ({
		...state,
		user: null,
	error: null
	}));
}

// 로딩 상태 설정 함수
export function setLoading(isLoading: boolean) {
	authStore.update(state => ({
		...state,
		isLoading
	}));
}

// 에러 설정 함수
export function setError(error: string | null) {
	authStore.update(state => ({
		...state,
		error
	}));
}

// 로그인 상태 확인 함수
export function isLogined(): boolean {
	let currentState: AuthStore | undefined;
	authStore.subscribe(state => {
		currentState = state;
	})();
	return currentState?.user !== null;
}

// 현재 사용자 정보 가져오기 함수
export function getCurrentUser(): User | null {
	let currentState: AuthStore | undefined;
	authStore.subscribe(state => {
		currentState = state;
	})();
	return currentState?.user || null;
}

// 스토어 구독을 위한 헬퍼 함수
export function subscribeToAuth(callback: (state: AuthStore) => void) {
	return authStore.subscribe(callback);
}
