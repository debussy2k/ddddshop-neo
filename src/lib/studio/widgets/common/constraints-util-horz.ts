import type { BaseWidgetProp, HorizontalAlign } from "$lib/studio/types";
import * as util from "$lib/studio/util";
import type { ComputedValue } from "./computed-value-util";

type HorzProp = {
	left: string;
	right: string;
	width: string;
	centerOffsetX: number;
	horzAlign: HorizontalAlign;
}

export function createHorzAlignProps(newHorzAlign: HorizontalAlign, currentProp: BaseWidgetProp, computedVal: ComputedValue) {
	let obj: Partial<BaseWidgetProp> = {};
	if (newHorzAlign === 'left') {
		obj = {
			horzAlign: "left",
			left: computedVal.left + 'px',
			width: computedVal.width + 'px',
			right: 'auto',
			centerOffsetX: 0
		}
	}
	else if (newHorzAlign === 'right') {
		obj = {
			horzAlign: "right",
			left: 'auto',
			width: computedVal.width + 'px',
			right: computedVal.right + 'px',
			centerOffsetX: 0
		}
	}
	else if (newHorzAlign === 'both') {
		obj = {
			horzAlign: "both",
			left: computedVal.left + 'px',
			right: computedVal.right + 'px',
			width: 'auto',
			centerOffsetX: 0
		}
	}
	else if (newHorzAlign === 'center') {
		const centerOffsetX = (computedVal.left + computedVal.width/2) - computedVal.parentWidth/2;
		const child_width_half = computedVal.width/2;
		const left = `calc(50% + ${centerOffsetX}px - ${child_width_half}px)`;
		obj = {
			horzAlign: "center",
			left: left,
			width: computedVal.width + 'px',
			right: 'auto',
			centerOffsetX: util.round(centerOffsetX, 2),
		}
	}
	else if (newHorzAlign === 'scale') {
		const leftPercent = util.toPercent(computedVal.left, computedVal.parentWidth);
		const rightPercent = util.toPercent(computedVal.right, computedVal.parentWidth);
		obj = {
			horzAlign: "scale",
			left: leftPercent + '%',
			width: "auto",
			right: rightPercent + '%',
			centerOffsetX: 0
		}
	}
	else {
		console.error(`invalid horz align`, newHorzAlign);
	}	

	return obj;
}

export function getLeftValue(prop: HorzProp, parentWidth: number):number {
	let val = 0;

	if (prop.horzAlign === 'center') {
		val = parentWidth/2 + prop.centerOffsetX - util.getNumberPart(prop.width)/2;
	}
	else if (prop.horzAlign === 'scale') {
		if (prop.left.slice(-1) === '%')
			val = parentWidth * Number(prop.left.replace('%', '')) / 100;
		else
			val = util.getNumberPart(prop.left);
	}
	else if (prop.left === 'auto') {
		val = parentWidth - (util.getNumberPart(prop.width) + util.getNumberPart(prop.right));
	}
	else {
		val = util.getNumberPart(prop.left);
	}

	return util.round(val, 2);
}
export function getLeftValuePx(prop: HorzProp, parentWidth: number) {
	return getLeftValue(prop, parentWidth) + 'px';
}

export function getRightValue(prop: HorzProp, parentWidth: number):number {
	let val = 0;
	if (prop.horzAlign === 'center') {
		val = parentWidth/2 - prop.centerOffsetX - util.getNumberPart(prop.width)/2;
	}
	else if (prop.horzAlign === 'scale') {
		val = 0;
		if (prop.right.slice(-1) === '%')
			val = parentWidth * Number(prop.right.replace('%', '')) / 100;
		else
			val = util.getNumberPart(prop.right);
	}
	else if (prop.right === 'auto') {
		val = parentWidth - (util.getNumberPart(prop.left) + util.getNumberPart(prop.width));
	}
	else {
		val = util.getNumberPart(prop.right);		
	}

	return util.round(val, 2);
}
export function getRightValuePx(prop: HorzProp, parentWidth: number) {
	return getRightValue(prop, parentWidth) + 'px';
}

export function getWidthValue(prop: HorzProp, parentWidth: number):number {
	let val = 0;
	if (prop.width === 'auto') {
		val = parentWidth - (getLeftValue(prop, parentWidth) + getRightValue(prop, parentWidth));
	}
	else {
		val = util.getNumberPart(prop.width);
	}

	return util.round(val, 2);
}
export function getWidthValuePx(prop: HorzProp, parentWidth: number) {
	return getWidthValue(prop, parentWidth) + 'px';
}

export function getCenterOffsetX(prop: HorzProp, parentWidth: number):number {
	const left = getLeftValue(prop, parentWidth);
	const width = getWidthValue(prop, parentWidth);
	const centerOffsetX =  (left + width/2) - parentWidth/2;
	return util.round(centerOffsetX, 2);
}

/**
 * 위젯의 왼쪽 위치 변경 시 각 horzAlign에 따른 속성 업데이트 값을 계산합니다.
 */
export function updateLeftConstraints(
	newLeft: number, 
	currentProp: BaseWidgetProp, 
	computedVal: { left: number; right: number; width: number; parentWidth: number;  }
): Partial<BaseWidgetProp> {
	if (currentProp.horzAlign === 'left') {
		return { left: newLeft + 'px' };
	}
	else if (currentProp.horzAlign === 'right') {
		const  leftDelta = newLeft - computedVal.left;
		return { right: computedVal.right - leftDelta + 'px' };
	}
	else if (currentProp.horzAlign === 'both') {
		const leftDelta = newLeft - computedVal.left;
		return { 
			left: newLeft + 'px',
			right: computedVal.right - leftDelta + 'px' 
		};
	}
	else if (currentProp.horzAlign === 'center') {
		const leftDelta = newLeft - computedVal.left;
		const newCenterOffsetX = currentProp.centerOffsetX + leftDelta;
		return { 
			left: `calc(50% + ${newCenterOffsetX}px - ${computedVal.width/2}px)`,
			centerOffsetX: newCenterOffsetX
		};
	}
	else if (currentProp.horzAlign === 'scale') {
		const leftDelta = newLeft - computedVal.left;
		return {
			left: util.toPercent(newLeft, computedVal.parentWidth) + '%',
			right: util.toPercent(computedVal.right - leftDelta, computedVal.parentWidth) + '%'
		}
	}

	return {};
}

/**
 * 위젯의 너비 변경 시 각 horzAlign에 따른 속성 업데이트 값을 계산합니다.
 */
export function calculateWidthConstraints(
	newWidth: number, 
	currentProp: BaseWidgetProp, 
	computedVal: { left: number; right: number; width: number; parentWidth: number }
): Partial<Pick<BaseWidgetProp, 'width' | 'left' | 'right' | 'centerOffsetX'>> {
	if (currentProp.horzAlign === 'left' || currentProp.horzAlign === 'right') {
		return { width: newWidth + 'px' };
	}
	else if (currentProp.horzAlign === 'both') {
		const widthDelta = newWidth - computedVal.width;
		return { right: computedVal.right - widthDelta + 'px' };
	}
	else if (currentProp.horzAlign === 'center') {
		const centerOffsetX = (computedVal.left + newWidth/2) - computedVal.parentWidth/2;
		return { 
			left: `calc(50% + ${centerOffsetX}px - ${newWidth/2}px)`,
			width: newWidth + 'px',
			centerOffsetX: centerOffsetX
		};
	}
	else if (currentProp.horzAlign === 'scale') {
		const widthDelta = newWidth - computedVal.width;
		return {
			right: util.toPercent(computedVal.right - widthDelta, computedVal.parentWidth) + '%'
		};
	}
	
	return {};
}
