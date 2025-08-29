import type { Section } from "./widgets/section/section-actions";
import type { Sandbox } from "./widgets/sandbox/sandbox-actions";
export type { Section, Sandbox };

export interface DocState {
    sections: Section[];
}

