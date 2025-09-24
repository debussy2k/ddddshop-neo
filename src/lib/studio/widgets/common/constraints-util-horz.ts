import type { BaseWidgetProp, HorizontalAlign } from "$lib/studio/types";
import { util } from "$lib/studio/util";

type HorzProp = {
	left: string;
	right: string;
	width: string;
	centerOffsetX: number;
	horzAlign: HorizontalAlign;
}


export namespace constraintsUtilHorz {
	export function createHorzAlignProps(newHorzAlign: HorizontalAlign, currentProp: BaseWidgetProp, parentWidth: number) {
		let obj: Partial<BaseWidgetProp> = {};
		if (newHorzAlign === 'left') {
			let left = getLeftValuePx(currentProp, parentWidth);
			obj = {
				horzAlign: "left",
				left: left,
				width: getWidthValuePx(currentProp, parentWidth),
				right: 'auto',
				centerOffsetX: 0
			}
		}
		else if (newHorzAlign === 'right') {
			let right = getRightValuePx(currentProp, parentWidth);
			obj = {
				horzAlign: "right",
				left: 'auto',
				width: getWidthValuePx(currentProp, parentWidth),
				right: right,
				centerOffsetX: 0
			}
		}
		else if (newHorzAlign === 'both') {
			let left = getLeftValuePx(currentProp, parentWidth);
			let right = getRightValuePx(currentProp, parentWidth);
			obj = {
				horzAlign: "both",
				left: left,
				right: right,
				width: 'auto',
				centerOffsetX: 0
			}
		}
		else if (newHorzAlign === 'center') {
			let centerOffsetX = getCenterOffsetX(currentProp, parentWidth);
			let child_width_half = getWidthValue(currentProp, parentWidth)/2;
			let left = `calc(50% + ${centerOffsetX}px - ${child_width_half}px)`;
			obj = {
				horzAlign: "center",
				left: left,
				width: getWidthValuePx(currentProp, parentWidth),
				right: 'auto',
				centerOffsetX: centerOffsetX,
			}
		}
		else if (newHorzAlign === 'scale') {
			let leftPercent = toPercent(getLeftValue(currentProp, parentWidth), parentWidth);
			let rightPercent = toPercent(getRightValue(currentProp, parentWidth), parentWidth);
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

	export function getNumberPart(param: string) {
		return Number(param.replace('px', ''));
	}	
	export function toPercent(val: number, parentWidth: number, decimal: number = 2) {
		return Number(val/parentWidth*100).toFixed(decimal);
	}	

	export function getLeftValue(prop: HorzProp, parentWidth: number):number {
		if (prop.horzAlign === 'center') {
			let left = parentWidth/2 + prop.centerOffsetX - getNumberPart(prop.width)/2;
			return left;
		}
		else if (prop.horzAlign === 'scale') {
			let left = 0;
			if (prop.left.slice(-1) === '%')
				left = parentWidth * Number(prop.left.replace('%', '')) / 100;
			else
				left = getNumberPart(prop.left);
			return left;
		}
		else if (prop.left === 'auto') {
			let left = parentWidth - (getNumberPart(prop.width) + getNumberPart(prop.right));
			return left;
		}
		else {
			return getNumberPart(prop.left);
		}

	}
	export function getLeftValuePx(prop: HorzProp, parentWidth: number) {
		return getLeftValue(prop, parentWidth) + 'px';
	}
	
	export function getRightValue(prop: HorzProp, parentWidth: number):number {
		if (prop.horzAlign === 'center') {
			let right = parentWidth/2 - prop.centerOffsetX - getNumberPart(prop.width)/2;
			return right;
		}
		else if (prop.horzAlign === 'scale') {
			let right = 0;
			if (prop.right.slice(-1) === '%')
				right = parentWidth * Number(prop.right.replace('%', '')) / 100;
			else
				right = getNumberPart(prop.right);
			return right;
		}
		else if (prop.right === 'auto') {
			let right = parentWidth - (getNumberPart(prop.left) + getNumberPart(prop.width));
			return right;
		}
		else {
			return getNumberPart(prop.right);
		}
	}
	export function getRightValuePx(prop: HorzProp, parentWidth: number) {
		return getRightValue(prop, parentWidth) + 'px';
	}

	export function getWidthValue(prop: HorzProp, parentWidth: number):number {
		if (prop.width === 'auto') {
			return parentWidth - (getLeftValue(prop, parentWidth) + getRightValue(prop, parentWidth));
		}
		else {
			return getNumberPart(prop.width);
		}
	}
	export function getWidthValuePx(prop: HorzProp, parentWidth: number) {
		return getWidthValue(prop, parentWidth) + 'px';
	}

	export function getCenterOffsetX(prop: HorzProp, parentWidth: number):number {
		let left = getLeftValue(prop, parentWidth);
		let width = getWidthValue(prop, parentWidth);
		let centerOffsetX =  (left + width/2) - parentWidth/2;
		return centerOffsetX;
	}	
}
