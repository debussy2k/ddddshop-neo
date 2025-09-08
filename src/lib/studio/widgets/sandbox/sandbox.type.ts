export interface Sandbox {
    id: string;
    type: 'sandbox';
    name: string;
    text: string;
    parentId?: string; // Section의 child로 사용될 때의 부모 ID
}

// Sandbox 생성시 사용하는 타입 (name은 선택적)
export type SandboxInput = Omit<Sandbox, 'id' | 'type' | 'name'> & {
    name?: string;
};
