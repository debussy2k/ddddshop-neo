import type { BaseWidgetProp, VerticalAlign } from "$lib/studio/types";
import * as util from "$lib/studio/util";

type VertProp = {
	top: string;
	bottom: string;
	height: string;
	centerOffsetY: number;
	vertAlign: VerticalAlign;
}


export function createVertAlignProps(newVertAlign: VerticalAlign, currentProp: BaseWidgetProp, parentHeight: number) {
	let obj: Partial<BaseWidgetProp> = {};
	if (newVertAlign === 'top') {
		const top = getTopValuePx(currentProp, parentHeight);
		obj = {
			vertAlign: "top",
			top: top,
			height: getHeightValuePx(currentProp, parentHeight),
			bottom: 'auto',
			centerOffsetY: 0
		}
	}
	else if (newVertAlign === 'bottom') {
		const bottom = getBottomValuePx(currentProp, parentHeight);
		obj = {
			vertAlign: "bottom",
			top: 'auto',
			height: getHeightValuePx(currentProp, parentHeight),
			bottom: bottom,
			centerOffsetY: 0
		}
	}
	else if (newVertAlign === 'both') {
		const top = getTopValuePx(currentProp, parentHeight);
		const bottom = getBottomValuePx(currentProp, parentHeight);
		obj = {
			vertAlign: "both",
			top: top,
			bottom: bottom,
			height: 'auto',
			centerOffsetY: 0
		}
	}
	else if (newVertAlign === 'center') {
		const centerOffsetY = getCenterOffsetY(currentProp, parentHeight);
		const child_height_half = getHeightValue(currentProp, parentHeight)/2;
		const top = `calc(50% + ${centerOffsetY}px - ${child_height_half}px)`;
		obj = {
			vertAlign: "center",
			top: top,
			height: getHeightValuePx(currentProp, parentHeight),
			bottom: 'auto',
			centerOffsetY: centerOffsetY,
		}
	}
	else if (newVertAlign === 'scale') {
		const topPercent = util.toPercent(getTopValue(currentProp, parentHeight), parentHeight);
		const bottomPercent = util.toPercent(getBottomValue(currentProp, parentHeight), parentHeight);
		obj = {
			vertAlign: "scale",
			top: topPercent + '%',
			height: "auto",
			bottom: bottomPercent + '%',
			centerOffsetY: 0
		}
	}
	else {
		console.error(`invalid vert align`, newVertAlign);
	}	

	return obj;
}


export function getTopValue(prop: VertProp, parentHeight: number):number {
	let val = 0;
	if (prop.vertAlign === 'center') {
		const top = parentHeight/2 + prop.centerOffsetY - util.getNumberPart(prop.height)/2;
		val = top;
	}
	else if (prop.vertAlign === 'scale') {
		let top = 0;
		if (prop.top.slice(-1) === '%')
			top = parentHeight * Number(prop.top.replace('%', '')) / 100;
		else
			top = util.getNumberPart(prop.top);
		val = top;
	}
	else if (prop.top === 'auto') {
		const top = parentHeight - (util.getNumberPart(prop.height) + util.getNumberPart(prop.bottom));
		val = top;
	}
	else {
		val = util.getNumberPart(prop.top);
	}

	return util.round(val, 2);
}
export function getTopValuePx(prop: VertProp, parentHeight: number) {
	return getTopValue(prop, parentHeight) + 'px';
}

export function getBottomValue(prop: VertProp, parentHeight: number):number {
	let val = 0;
	if (prop.vertAlign === 'center') {
		const bottom = parentHeight/2 - prop.centerOffsetY - util.getNumberPart(prop.height)/2;
		val = bottom;
	}
	else if (prop.vertAlign === 'scale') {
		let bottom = 0;
		if (prop.bottom.slice(-1) === '%')
			bottom = parentHeight * Number(prop.bottom.replace('%', '')) / 100;
		else
			bottom = util.getNumberPart(prop.bottom);
		val = bottom;
	}
	else if (prop.bottom === 'auto') {
		const bottom = parentHeight - (util.getNumberPart(prop.top) + util.getNumberPart(prop.height));
		val = bottom;
	}
	else {
		val = util.getNumberPart(prop.bottom);
	}

	return util.round(val, 2);
}
export function getBottomValuePx(prop: VertProp, parentHeight: number) {
	return getBottomValue(prop, parentHeight) + 'px';
}

export function getHeightValue(prop: VertProp, parentHeight: number):number {
	let val = 0;
	if (prop.height === 'auto') {
		val = parentHeight - (getTopValue(prop, parentHeight) + getBottomValue(prop, parentHeight));
	}
	else {
		val = util.getNumberPart(prop.height);
	}

	return util.round(val, 2);
}
export function getHeightValuePx(prop: VertProp, parentHeight: number) {
	return getHeightValue(prop, parentHeight) + 'px';
}

export function getCenterOffsetY(prop: VertProp, parentHeight: number):number {
	const top = getTopValue(prop, parentHeight);
	const height = getHeightValue(prop, parentHeight);
	const centerOffsetY =  (top + height/2) - parentHeight/2;
	return util.round(centerOffsetY, 2);
}	

/**
 * 위젯의 top 변경 시 각 vertAlign에 따른 속성 업데이트 값을 계산합니다.
 */
export function updateTopConstraints(
	newTop: number, 
	currentProp: BaseWidgetProp, 
	computedVal: { top: number; bottom: number; height: number; parentHeight: number }
): Partial<BaseWidgetProp> {
	if (currentProp.vertAlign === 'top') {
		return { top: newTop + 'px' };
	}
	else if (currentProp.vertAlign === 'bottom') {
		const topDelta = newTop - computedVal.top;
		return { bottom: computedVal.bottom - topDelta + 'px' };
	}
	else if (currentProp.vertAlign === 'both') {
		const topDelta = newTop - computedVal.top;
		return { 
			top: newTop + 'px',
			bottom: computedVal.bottom - topDelta + 'px' 
		};
	}
	else if (currentProp.vertAlign === 'center') {
		const topDelta = newTop - computedVal.top;
		const newCenterOffsetY = currentProp.centerOffsetY + topDelta;
		return { 
			top: `calc(50% + ${newCenterOffsetY}px - ${computedVal.height/2}px)`,
			centerOffsetY: newCenterOffsetY
		};
	}
	else if (currentProp.vertAlign === 'scale') {
		const topDelta = newTop - computedVal.top;
		return {
			top: util.toPercent(newTop, computedVal.parentHeight) + '%',
			bottom: util.toPercent(computedVal.bottom - topDelta, computedVal.parentHeight) + '%'
		}
	}

	return {};
}

/**
 * 위젯의 높이 변경 시 각 vertAlign에 따른 속성 업데이트 값을 계산합니다.
 */
export function updateHeightConstraints(
	newHeight: number, 
	currentProp: BaseWidgetProp, 
	computedVal: { top: number; bottom: number; height: number; parentHeight: number }
): Partial<BaseWidgetProp> {
	if (currentProp.vertAlign === 'top' || currentProp.vertAlign === 'bottom') {
		return { height: newHeight + 'px' };
	}
	else if (currentProp.vertAlign === 'both') {
		const heightDelta = newHeight - computedVal.height;
		return { bottom: computedVal.bottom - heightDelta + 'px' };
	}
	else if (currentProp.vertAlign === 'center') {
		const centerOffsetY = (computedVal.top + newHeight/2) - computedVal.parentHeight/2;
		return { 
			top: `calc(50% + ${centerOffsetY}px - ${newHeight/2}px)`,
			height: newHeight + 'px',
			centerOffsetY: centerOffsetY
		};
	}
	else if (currentProp.vertAlign === 'scale') {
		const heightDelta = newHeight - computedVal.height;
		const computedBottom = computedVal.parentHeight - (computedVal.top + computedVal.height);
		return {
			bottom: computedBottom - heightDelta + 'px'
		};
	}
	
	return {};
}

