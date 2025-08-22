# DDDD Shop Neo

뚝딱샵의 카테고리 정보를 가져와서 메뉴를 보여주는  기능을 vibe 코딩으로 구현한 테스트 프로젝트입니다.

## 기능

- 사용자 로그인/로그아웃
- 상품 조회
- 장바구니 관리
- 주문 관리

## 설치 및 실행

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Shopicus API 설정
VITE_SHOPICUS_API_BASE_URL=https://api.shopicus.com

# 기타 환경 변수
NODE_ENV=development
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:5173`으로 접속하세요.

## 로그인 기능 사용법

### 1. API 초기화

애플리케이션 시작 시 `src/lib/config/api.config.ts`에서 Shopicus API를 초기화합니다.

### 2. 로그인 컴포넌트

`src/lib/components/LoginForm.svelte` 컴포넌트를 사용하여 로그인 폼을 표시할 수 있습니다.

```svelte
<script>
  import LoginForm from '$lib/components/LoginForm.svelte';
  
  function handleLoginSuccess(event) {
    console.log('로그인 성공:', event.detail.user);
  }
  
  function handleLoginError(event) {
    console.error('로그인 오류:', event.detail.error);
  }
</script>

<LoginForm 
  on:loginSuccess={handleLoginSuccess}
  on:loginError={handleLoginError}
/>
```

### 3. 인증 상태 관리

`src/lib/stores/auth.store.ts`에서 로그인 상태와 사용자 정보를 관리합니다.

```typescript
import { user, isAuthenticated, login, logout } from '$lib/stores/auth.store';

// 로그인
await login('userId', 'password', true);

// 로그아웃
await logout();

// 사용자 정보 접근
$: currentUser = $user;
$: isLoggedIn = $isAuthenticated;
```

## 프로젝트 구조

```
src/
├── lib/
│   ├── components/
│   │   └── LoginForm.svelte      # 로그인 폼 컴포넌트
│   ├── config/
│   │   └── api.config.ts         # API 설정
│   ├── service/
│   │   └── shopicus.api.ts       # Shopicus API 타입 정의
│   └── stores/
│       └── auth.store.ts         # 인증 상태 관리
└── routes/
    └── +page.svelte              # 메인 페이지
```

## API 문서

Shopicus API의 자세한 사용법은 `src/lib/service/shopicus.api.ts` 파일을 참조하세요.

## 라이선스

MIT
