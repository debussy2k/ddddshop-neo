
// API 설정
const BASE_URL = import.meta.env.VITE_SHOPICUS_API_BASE_URL || 'https://admin.ddddshop.co.kr';
const MALL_CODE = 'sptville';

// 타입 정의
interface RequestOptions {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    query?: Record<string, any>;
    body?: any;
    headers?: Record<string, string>;
}

interface ApiResponse<T = any> {
    data: T;
    ok: boolean;
    status: number;
    error?: any;
}

// 유틸리티 함수들
function encodeQueryParam(key: string, value: any): string {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
        typeof value === 'number' ? value : `${value}`
    )}`;
}

function addQueryParam(query: Record<string, any>, key: string): string {
    return encodeQueryParam(key, query[key]);
}

function addArrayQueryParam(query: Record<string, any>, key: string): string {
    const value = query[key];
    return value.map((v: any) => encodeQueryParam(key, v)).join('&');
}

function toQueryString(rawQuery?: Record<string, any>): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
        .map((key) =>
            Array.isArray(query[key])
                ? addArrayQueryParam(query, key)
                : addQueryParam(query, key)
        )
        .join('&');
}

// 독립적인 API 요청 함수
async function apiRequest<T = any>(options: RequestOptions): Promise<ApiResponse<T>> {
    const { path, method, query, body, headers = {} } = options;
    
    // 기본 헤더 설정
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'SP-MallCode': MALL_CODE
    };
    
    // 최종 헤더 병합
    const finalHeaders = { ...defaultHeaders, ...headers };
    
    // URL 구성
    const queryString = query ? toQueryString(query) : '';
    const url = `${BASE_URL}${path}${queryString ? `?${queryString}` : ''}`;
    
    // fetch 옵션 구성
    const fetchOptions: RequestInit = {
        method,
        credentials: 'include',
        headers: finalHeaders
    };
    
    // body가 있는 경우 추가
    if (body && (method === 'POST' || method === 'PUT')) {
        fetchOptions.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, fetchOptions);
        
        let data: T;
        try {
            data = await response.json();
        } catch {
            data = null as T;
        }
        
        const result: ApiResponse<T> = {
            data,
            ok: response.ok,
            status: response.status
        };
        
        if (!response.ok) {
            result.error = data;
            throw result;
        }
        
        return result;
    } catch (error) {
        if (error && typeof error === 'object' && 'data' in error) {
            throw error; // 이미 ApiResponse 형태의 에러
        }
        throw {
            data: null,
            ok: false,
            status: 0,
            error: error
        } as ApiResponse<T>;
    }
}

export default class ShopicusFunc {
    static async getChildUsers(query: any) {
        const response = await apiRequest({
            path: '/AccountApi/ChildUsers/CurrentUser',
            method: 'GET',
            query: query
        });
        console.log(response);
        return response.data.result || [];
    }

 
    static async getCartItems(query: any) {
        const response = await apiRequest({
            path: '/OrderApi/Cart',
            method: 'GET',
            query: query
        });
        console.log(response);
        return response.data;
    }
}