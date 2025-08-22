import { writable, derived } from 'svelte/store';
import { getShopicusAPI } from '../service/shopicus.api';
import type { ShopUser } from '../service/shopicus.api';

// 사용자 정보 스토어
export const user = writable<ShopUser | null>(null);

// 로그인 상태 스토어
export const isAuthenticated = derived(user, ($user) => !!$user);

// 로딩 상태 스토어
export const isLoading = writable(false);

// 에러 메시지 스토어
export const errorMessage = writable<string | null>(null);

// 로그인 함수
export async function login(userId: string, password: string, rememberMe: boolean = false) {
	isLoading.set(true);
	errorMessage.set(null);

	try {
		const api = getShopicusAPI();
		if (!api) {
			throw new Error('API가 초기화되지 않았습니다.');
		}

		const response = await api.accountApi.signIn({
			id: userId,
			password,
			rememberMe
		});

		if (response.data) {
			user.set(response.data);
			
			// 로컬 스토리지에 사용자 정보 저장 (rememberMe가 true인 경우)
			if (rememberMe) {
				localStorage.setItem('shopicus_user', JSON.stringify(response.data));
			}
			
			return { success: true, user: response.data };
		} else {
			throw new Error('로그인에 실패했습니다.');
		}
	} catch (error: any) {
		console.error('로그인 오류:', error);
		
		let message = '로그인 중 오류가 발생했습니다.';
		
		if (error.error?.isLockedOut) {
			message = '계정이 잠겼습니다. 관리자에게 문의하세요.';
		} else if (error.error?.isNotAllowed) {
			message = '로그인이 허용되지 않습니다.';
		} else if (error.error?.requiresTwoFactor) {
			message = '2단계 인증이 필요합니다.';
		} else if (error.message) {
			message = error.message;
		}
		
		errorMessage.set(message);
		return { success: false, error: message };
	} finally {
		isLoading.set(false);
	}
}

// 로그아웃 함수
export async function logout() {
	try {
		const api = getShopicusAPI();
		if (api) {
			await api.accountApi.logout();
		}
	} catch (error) {
		console.error('로그아웃 오류:', error);
	} finally {
		// 로컬 상태 정리
		user.set(null);
		localStorage.removeItem('shopicus_user');
	}
}

// 현재 사용자 정보 가져오기
export async function getCurrentUser() {
	try {
		const api = getShopicusAPI();
		if (!api) {
			return null;
		}

		const response = await api.accountApi.getCurrentUser();
		if (response.data) {
			user.set(response.data);
			return response.data;
		}
	} catch (error) {
		console.error('사용자 정보 가져오기 오류:', error);
		// 로그인 상태가 아닌 경우 사용자 정보 제거
		user.set(null);
	}
	
	return null;
}

// 로컬 스토리지에서 사용자 정보 복원
export function restoreUserFromStorage() {
	try {
		const storedUser = localStorage.getItem('shopicus_user');
		if (storedUser) {
			const userData = JSON.parse(storedUser);
			user.set(userData);
			return userData;
		}
	} catch (error) {
		console.error('저장된 사용자 정보 복원 오류:', error);
		localStorage.removeItem('shopicus_user');
	}
	
	return null;
}

// 초기화 시 저장된 사용자 정보 복원
export function initializeAuth() {
	restoreUserFromStorage();
}
