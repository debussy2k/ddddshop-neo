import type { Widget, BaseWidgetProp, LayoutType, JustifyContent, AlignItems } from "../../types";
import type { BreakPoint } from "$lib/studio/breakpoint-man.svelte";

export interface Frame {
    id: string;
    type: 'frame';
    name: string;
    parentId: string; // Section의 child로 사용될 때의 부모 ID
    children: Widget[]; // child Widget 객체들

    prop: Record<BreakPoint, BaseWidgetProp & {
        layout: LayoutType;
        justifyContent: JustifyContent;
        alignItems: AlignItems;
    }>;
}

export type FramePropValue = Frame['prop'][keyof Frame['prop']];
// Frame 생성시 사용하는 타입 (name은 선택적)
export type FrameInput = Partial<Omit<Frame, 'id' | 'type' | 'name' | 'children' | 'parentId'>> & {
    name?: string;
    parentId: string;
};
