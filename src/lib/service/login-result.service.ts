export interface LoginResult {
	provider: string;
	loginKey: string;
	secondaryLoginKey?: string;
	userInfo?: any;
	timestamp: Date;
	success: boolean;
	error?: string;
}

export class LoginResultService {
	private currentLoginResult: LoginResult | null = null;

	public constructor() {}

	/**
	 * 로그인 시도 정보를 저장
	 */
	public saveLoginAttempt(provider: string, loginKey: string, secondaryLoginKey?: string): void {
		const loginAttempt: LoginResult = {
			provider,
			loginKey,
			secondaryLoginKey,
			timestamp: new Date(),
			success: false
		};

		this.currentLoginResult = loginAttempt;
		
		console.log('로그인 시도 저장:', loginAttempt);
	}

	/**
	 * 로그인 성공 결과를 업데이트
	 */
	public updateLoginSuccess(userInfo: any): void {
		if (this.currentLoginResult) {
			this.currentLoginResult.success = true;
			this.currentLoginResult.userInfo = userInfo;
			
			console.log('로그인 성공 업데이트:', this.currentLoginResult);
		}
	}

	/**
	 * 로그인 실패 결과를 업데이트
	 */
	public updateLoginFailure(error: string): void {
		if (this.currentLoginResult) {
			this.currentLoginResult.success = false;
			this.currentLoginResult.error = error;
			
			console.log('로그인 실패 업데이트:', this.currentLoginResult);
		}
	}

	/**
	 * 현재 로그인 결과 가져오기
	 */
	public getCurrentLoginResult(): LoginResult | null {
		return this.currentLoginResult;
	}

	/**
	 * 로그인 결과 초기화
	 */
	public clearLoginResult(): void {
		this.currentLoginResult = null;
		console.log('로그인 결과 초기화 완료');
	}
}

export const loginResultService = new LoginResultService();
