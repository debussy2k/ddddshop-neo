import type { BreakPoint } from "$lib/studio/breakpoint-man.svelte";

export type ShowcaseCompPropValue = {
    columns: number;
}

type PropByBreakPoint<B extends BreakPoint> =
    B extends "desktop" ? ShowcaseCompPropValue : Partial<ShowcaseCompPropValue>;

export type ShowcaseCompProp = {
    [K in BreakPoint]: PropByBreakPoint<K>;
}