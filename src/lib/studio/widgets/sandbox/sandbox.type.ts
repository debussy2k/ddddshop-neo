import type { BreakPoint } from "$lib/studio/breakpoint-man.svelte";

export interface Sandbox {
    id: string;
    type: 'sandbox';
    name: string;
    text: string;
    parentId: string; // Section의 child로 사용될 때의 부모 ID
    prop: Record<BreakPoint, {
        left: string;
        top: string;
        width: string;
        height: string;
    }>;
}

export type SandboxPropValue = Sandbox['prop'][keyof Sandbox['prop']];
// Sandbox 생성시 사용하는 타입 (name은 선택적)
export type SandboxInput = Partial<Omit<Sandbox, 'id' | 'type' | 'name'>> & {
    // 반드시 포함되어야 하는 항목
    name?: string;
    parentId: string;
};
