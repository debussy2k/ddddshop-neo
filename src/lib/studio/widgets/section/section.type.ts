export interface Section {
    id: string;
    type: 'section';
    name: string;
    content?: any;
    children?: Widget[]; // child Widget 객체들

    height: string;
}

// 섹션 생성시 사용하는 타입 (name은 선택적)
export type SectionInput = Omit<Section, 'id' | 'type' | 'name'> & {
    name?: string;
};
