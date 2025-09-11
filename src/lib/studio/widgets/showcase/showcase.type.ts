export interface Showcase {
    id: string;
    type: 'showcase';
    name: string;
    text: string;
    parentId?: string; // Section의 child로 사용될 때의 부모 ID
}

// Showcase 생성시 사용하는 타입 (name은 선택적)
export type ShowcaseInput = Omit<Showcase, 'id' | 'type' | 'name'> & {
    name?: string;
};
