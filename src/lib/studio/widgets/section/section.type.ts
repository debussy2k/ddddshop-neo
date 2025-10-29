import type { NonSectionWidget, BaseContainerProp } from '../../types';
import type { BreakPoint } from '$lib/studio/breakpoint-man.svelte';

export interface Section {
    id: string;
    type: 'section';
    name: string;
    content?: string;
    parentId: string;
    children: NonSectionWidget[]; // child Widget 객체들

	prop: {
        [K in BreakPoint]: PropByBreakPoint<K>;
    }
}

export type SectionPropValue = BaseContainerProp & {
    height: string;
}

// 조건부 타입으로 prop 매핑
type PropByBreakPoint<B extends BreakPoint> = 
  B extends "desktop" ? SectionPropValue : Partial<SectionPropValue>;

// 섹션 생성시 사용하는 타입 (name은 선택적)
export type SectionInput = Partial<Omit<Section, 'id' | 'type' | 'name' | 'children' | 'parentId'>> & {
    name?: string;
};
