import type { Section } from "./widgets/section/section-actions";
import type { Sandbox } from "./widgets/sandbox/sandbox-actions";
export type { Section, Sandbox };

type Widget = Sandbox; // Widget은 Sandbox외 다른 type이 추가될 예정임
export type { Widget };

export interface DocState {
    sections: Section[];
}

