import { persisted } from 'svelte-persisted-store'

export const showDebugInfo = persisted('show-debug-info', false);
export const showPageData = persisted('show-page-data', false);
export const devMode = persisted('dev-mode', false);

export const showAllItemNames = persisted('showAllItemNames', false);
export const hideBaseData = persisted('hide-base-data', false);

export const productFormSingleColumn = persisted('product-form-single-column', false);

export const preference = persisted('product-form-preference', {
    singleColumn: false,
    showAllParams: false,
    showParamTooltip: true
});