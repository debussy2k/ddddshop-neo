import type { Section } from "./widgets/section/section.type";
import type { Frame } from "./widgets/frame/frame.type";
import type { Sandbox } from "./widgets/sandbox/sandbox.type";
import type { SimpleImage } from "./widgets/simple-image/simple-image.type";
import type { Showcase } from "./widgets/showcase/showcase.type";
export type { Section, Frame, Sandbox, SimpleImage, Showcase };

type Widget = Section |Frame | Sandbox | SimpleImage | Showcase; // Widget은 Sandbox외 다른 type이 추가될 예정임
export type { Widget };

type CompositeWidget = Section | Frame;
export type { CompositeWidget };

export interface DocState {
    sections: Section[];
}


export type LayoutType = "block" | "flex-row" | "flex-col" | "grid";

// 위젯의 기본 위치/크기 속성을 나타내는 공통 인터페이스
export interface BaseWidgetProp {
    left: string;
    top: string;
    width: string;
    height: string;
}

