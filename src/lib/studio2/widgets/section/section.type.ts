import type { NonSectionWidget, BaseContainerProp } from '../../types';
import type { BreakPoint } from '$lib/studio/breakpoint-man.svelte';

export interface Section {
    id: string;
    type: 'section';
    name: string;
    // parentId: string;
    // children: NonSectionWidget[]; // child Widget 객체들

	prop: Record<BreakPoint, BaseContainerProp & {
		height: string; // section에서만 사용하는 속성.
	}>;
}

export type SectionPropValue = Section['prop'][keyof Section['prop']];

// 섹션 생성시 사용하는 타입 (name은 선택적)
export type SectionInput = Partial<Omit<Section, 'id' | 'type' | 'name' | 'children' | 'parentId'>> & {
    name?: string;
};
