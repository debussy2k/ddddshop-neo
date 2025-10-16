import type { Section } from "./widgets/section/section.type";
import type { Frame } from "./widgets/frame/frame.type";
import type { Sandbox } from "./widgets/sandbox/sandbox.type";
import type { SimpleImage } from "./widgets/simple-image/simple-image.type";
import type { Showcase } from "./widgets/showcase/showcase.type";
export type { Section, Frame, Sandbox, SimpleImage, Showcase };

export type CanvasMode = "infinite-canvas" | "fixed-canvas";
export type BreakPoint = "desktop" | "tablet" | "mobile";

type Widget = Section | Frame | Sandbox | Showcase; // | SimpleImage | Showcase; // Widget은 Sandbox외 다른 type이 추가될 예정임
export type { Widget };

type NonSectionWidget = Frame | Sandbox;
export type { NonSectionWidget };

// children을 가지는 위젯
type CompositeWidget = Section | Frame;
export type { CompositeWidget };

type ContainerProp = Section['prop'] | Frame['prop'];
export type { ContainerProp };

type ContainerPropValue = ContainerProp[keyof ContainerProp];
export type { ContainerPropValue };

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
    sizeConstraints?: SizeConstraints;
    backgroundColor: string;
}

export type SizeConstraints = {
	hugContentsWidth: boolean;	// 수평 방향 hug-contents
	hugContentsHeight: boolean;	// 수직 방향 hug-contents
	fullWidth: boolean;		// 수평 방향 fill-container
	fullHeight: boolean;	// 수직 방향 fill-container
    hasMinWidth: boolean;
    minWidth: number;
    hasMaxWidth: boolean;
    maxWidth: number;
    hasMinHeight: boolean;
    minHeight: number;
    hasMaxHeight: boolean;
    maxHeight: number;		
}

export type HorizontalAlign = "left" | "right" | "both" | "center" | "scale";
export type VerticalAlign = "top" | "bottom" | "both" | "center" | "scale";
export type LayoutType = "block" | "flex-row" | "flex-col" | "grid";
export type JustifyContent = "start" | "end" | "center" | "space-between";
export type AlignItems = "start" | "end" | "center";

export type BaseContainerProp = {
    layout: LayoutType;
    justifyContent: JustifyContent;
    alignItems: AlignItems;
    gap: number;
    verticalGap: number;
    wrap: boolean;
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number; 
}
