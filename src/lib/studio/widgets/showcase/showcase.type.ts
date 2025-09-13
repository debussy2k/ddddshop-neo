export interface Showcase {
    id: string;
    type: 'showcase';
    name: string;
    parentId: string; // Section의 child로 사용될 때의 부모 ID

	showcaseCode: string;
}

// Showcase 생성시 사용하는 타입 (name은 선택적)
export type ShowcaseInput = Omit<Showcase, 'id' | 'type' | 'name'> & {
    name?: string;
	showcaseCode?: string;
};
