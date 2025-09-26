import type { Widget, LayoutType, JustifyContent, AlignItems } from '../../types';
import type { BreakPoint } from '$lib/studio/breakpoint-man.svelte';

export interface Section {
    id: string;
    type: 'section';
    name: string;
    content?: any;
    parentId: string;
    children: Widget[]; // child Widget 객체들

	prop: Record<BreakPoint, {
		height: string; // frame에는 없는 속성.
		layout: LayoutType;
        justifyContent: JustifyContent;
        alignItems: AlignItems;        
	}>;
}

export type SectionPropValue = Section['prop'][keyof Section['prop']];

// 섹션 생성시 사용하는 타입 (name은 선택적)
export type SectionInput = Partial<Omit<Section, 'id' | 'type' | 'name' | 'children' | 'parentId'>> & {
    name?: string;
};
