import type { BaseWidgetProp } from "$lib/studio/types";
import { studioDoc } from "$lib/studio/studio-doc.svelte";
import { constraintsUtilHorz } from "./constraints-util-horz";
import { constraintsUtilVert } from "./constraints-util-vert";

export interface ComputedValue {
    parentWidth: number;
    parentHeight: number;
    left: number;
	right: number;
    top: number;
	bottom: number;
    width: number;
    height: number;
}

export interface WidgetData {
    id: string;
    parentId: string;
}

/**
 * 위젯의 계산된 값을 반환합니다.
 * auto, percent로 표시된 값은 계산하여 pixel 단위로 리턴됩니다.
 */
export function getComputedVal(data: WidgetData, currentProp: BaseWidgetProp): ComputedValue {
    let parentComp = studioDoc.getWidget<any>(data.parentId);
    if (parentComp === null) {
        // console.error(`parent not found for widget`, data.id);
        return { parentWidth: 0, parentHeight: 0, left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
    }
    
    let parentWidth = parentComp.getWidth();
    let parentHeight = parentComp.getHeight();
	let left = constraintsUtilHorz.getLeftValue(currentProp, parentWidth);
	let top = constraintsUtilVert.getTopValue(currentProp, parentHeight);
	let width = constraintsUtilHorz.getWidthValue(currentProp, parentWidth);
	let height = constraintsUtilVert.getHeightValue(currentProp, parentHeight);
    
    return {
        parentWidth: parentWidth,
        parentHeight: parentHeight,
        left: left,
        right: parentWidth - (left + width),
        top: top,
        bottom: parentHeight - (top + height),
        width: width,
        height: height
    };
}
