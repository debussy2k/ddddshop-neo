import type { Section } from "./widgets/section/section.type";
import type { Frame } from "./widgets/frame/frame.type";
import type { Sandbox } from "./widgets/sandbox/sandbox.type";
import type { SimpleImage } from "./widgets/simple-image/simple-image.type";
import type { Showcase } from "./widgets/showcase/showcase.type";
export type { Section, Frame, Sandbox, SimpleImage, Showcase };

type Widget = Section |Frame | Sandbox | SimpleImage | Showcase; // Widget은 Sandbox외 다른 type이 추가될 예정임
export type { Widget };

// children을 가지는 위젯
type CompositeWidget = Section | Frame;
export type { CompositeWidget };

export interface DocState {
    sections: Section[];
}

// 위젯의 기본 위치/크기 속성을 나타내는 공통 인터페이스
export type BaseWidgetProp = {
    left: string;
    width: string;
    right: string;
	centerOffsetX: number;
    top: string;
    height: string;
    bottom: string;
	centerOffsetY: number;
    horzAlign: HorizontalAlign;
    vertAlign: VerticalAlign;
}

export type LayoutType = "block" | "flex-row" | "flex-col" | "grid";
export type HorizontalAlign = "left" | "right" | "both" | "center" | "scale";
export type VerticalAlign = "top" | "bottom" | "both" | "center" | "scale";