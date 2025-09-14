import type { BreakPoint } from '$lib/studio/breakpoint-man.svelte';

export interface Showcase {
    id: string;
    type: 'showcase';
    name: string;
    parentId: string; // Section의 child로 사용될 때의 부모 ID

	showcaseCode: string;
	prop: Record<BreakPoint, {
		titleFontSize: number;
		titleFontStyle: string;
		descFontSize: number;
		descFontStyle: string;
	}>;
}

export type ShowcasePropValue = Showcase['prop'][keyof Showcase['prop']];
export type ShowcaseInput = Partial<Omit<Showcase, 'id' | 'type'>>;
