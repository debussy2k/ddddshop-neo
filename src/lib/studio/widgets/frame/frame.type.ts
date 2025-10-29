import type { BaseWidgetProp, BaseContainerProp, NonSectionWidget } from "../../types";
import type { BreakPoint } from "$lib/studio/breakpoint-man.svelte";

export interface Frame {
    id: string;
    type: 'frame';
    name: string;
    parentId: string; // Section의 child로 사용될 때의 부모 ID
    children: NonSectionWidget[]; // child Widget 객체들

    prop: {
        [K in BreakPoint]: PropByBreakPoint<K>;
    }
}

export type FramePropValue = BaseWidgetProp & BaseContainerProp;

type PropByBreakPoint<B extends BreakPoint> = 
  B extends "desktop" ? FramePropValue : Partial<FramePropValue>;

// Frame 생성시 사용하는 타입 (name은 선택적)
export type FrameInput = Partial<Omit<Frame, 'id' | 'type' | 'name' | 'children' | 'parentId'>> & {
    name?: string;
    parentId: string;
};
