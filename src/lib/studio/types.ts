import type { Section } from "./widgets/section/section-actions";
import type { Sandbox } from "./widgets/sandbox/sandbox-actions";
import type { SimpleImage } from "./widgets/simple-image/simple-image-actions";
import type { Showcase } from "./widgets/showcase/showcase-actions";
export type { Section, Sandbox, SimpleImage, Showcase };

type Widget = Sandbox | SimpleImage | Showcase; // Widget은 Sandbox외 다른 type이 추가될 예정임
export type { Widget };

export interface DocState {
    sections: Section[];
}

