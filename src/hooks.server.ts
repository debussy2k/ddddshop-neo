
import { sequence } from '@sveltejs/kit/hooks';
import { site } from './site';
import { errors } from './errors';

export const handle = sequence(
    site,
    errors,   // 가장 바깥에서 에러 캐치/정리
);
