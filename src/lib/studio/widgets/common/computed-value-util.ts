import type { Widget } from "$lib/studio/types";
import { studioDoc } from "$lib/studio/studio-doc.svelte";
import { round2 } from "$lib/studio/util";

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


/**
 * 위젯의 계산된 값을 반환합니다.
 * DOM의 getBoundingClientRect()를 사용하여 브라우저가 계산한 실제 픽셀 값을 가져오며,
 * 부모 요소를 기준으로 한 상대 위치(left, right, top, bottom)와 크기(width, height)를 반환합니다.
 */
export function getComputedVal(data: Widget): ComputedValue {
	const defaultResult = { parentWidth: 0, parentHeight: 0, left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
	
	const parentComp = studioDoc.getWidgetSvelteComponent(data.parentId);
	if (parentComp === undefined || parentComp === null) {
		console.error('parentComp is undefined or null');
		return defaultResult;
	}

	const parentEl = parentComp.getElement();
	const svelteComp = studioDoc.getWidgetSvelteComponent(data.id);
	if (svelteComp === undefined || svelteComp === null) {
		console.error('svelteComp is undefined or null');
		return defaultResult;
	}
	const el = svelteComp.getElement();
	if (el === undefined || el === null) {
		console.error('svelteComp.getElement() is undefined or null.');
		return defaultResult;
	}

	// parent와 현재 element의 bounding rect 가져오기
	const parentRect = parentEl.getBoundingClientRect();
	const elRect = el.getBoundingClientRect();

	// parent 기준 상대 위치 계산
	const left = elRect.left - parentRect.left;
	const top = elRect.top - parentRect.top;
	const width = elRect.width;
	const height = elRect.height;
	const right = parentRect.width - (left + width);
	const bottom = parentRect.height - (top + height);

	return {
		parentWidth: round2(parentRect.width),
		parentHeight: round2(parentRect.height),
		left: round2(left),
		right: round2(right),
		top: round2(top),
		bottom: round2(bottom),
		width: round2(width),
		height: round2(height)
	};
	
	/* auto layout이 아닌 경우에만 사용가능한 코드
		const parentWidth = parentComp.getWidth();
		const parentHeight = parentComp.getHeight();
		const left = constraintsUtilHorz.getLeftValue(currentProp, parentWidth);
		const top = constraintsUtilVert.getTopValue(currentProp, parentHeight);
		const width = constraintsUtilHorz.getWidthValue(currentProp, parentWidth);
		const height = constraintsUtilVert.getHeightValue(currentProp, parentHeight);
		
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
	*/
    
}
