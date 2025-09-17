import type { Section } from "./widgets/section/section.type";
import type { Frame } from "./widgets/frame/frame.type";
import type { Sandbox } from "./widgets/sandbox/sandbox.type";
import type { SimpleImage } from "./widgets/simple-image/simple-image.type";
import type { Showcase } from "./widgets/showcase/showcase.type";
export type { Section, Frame, Sandbox, SimpleImage, Showcase };

type Widget = Section |Frame | Sandbox | SimpleImage | Showcase; // Widget은 Sandbox외 다른 type이 추가될 예정임
export type { Widget };

export interface DocState {
    sections: Section[];
}

