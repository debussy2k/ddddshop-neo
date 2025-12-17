// src/lib/server/hooks/errors.ts
import type { Handle } from '@sveltejs/kit';

export const errors: Handle = async ({ event, resolve }) => {   
    try {
        return await resolve(event);
    } catch (err) {
        console.error('Unhandled error:', {
            path: event.url.pathname,
            err
        });
        throw err; // SvelteKit 기본 에러 처리로 넘김
    }
};