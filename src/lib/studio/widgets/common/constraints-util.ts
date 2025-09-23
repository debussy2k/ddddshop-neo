import type { BaseWidgetProp, HorizontalAlign } from "$lib/studio/types";
import { util } from "$lib/studio/util";

type HorzProp = {
	left: string;
	right: string;
	width: string;
	centerOffsetX: number;
	horzAlign: HorizontalAlign;
}


export namespace constraintsUtil {
	export function createHorzAlignProps(newHorzAlign: HorizontalAlign, currentProp: BaseWidgetProp, parentWidth: number) {
		let obj: Partial<BaseWidgetProp> = {};
		if (newHorzAlign === 'left') {
			let left = getLeftValuePx(currentProp, parentWidth);
			obj = {
				horzAlign: "left",
				left: left,
				width: getWidthValuePx(currentProp, parentWidth),
				right: 'auto',
			}
		}
		else if (newHorzAlign === 'right') {
			let right = getRightValuePx(currentProp, parentWidth);
			obj = {
				horzAlign: "right",
				left: 'auto',
				width: getWidthValuePx(currentProp, parentWidth),
				right: right,
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
			}
		}
		else if (newHorzAlign === 'center') {
			let centerOffsetX = getCenterOffsetX(currentProp, parentWidth);
			let child_width_half = util.getNumberPart(getWidthValuePx(currentProp, parentWidth))/2;
			let left = `calc(50% + ${centerOffsetX} - ${child_width_half}px)`;
			obj = {
				horzAlign: "center",
				left: left,
				width: getWidthValuePx(currentProp, parentWidth),
				right: 'auto',
				centerOffsetX: util.getNumberPart(centerOffsetX),
			}
		}
		else {
			console.error(`invalid horz align`, newHorzAlign);
		}	

		return obj;
	}

	export function getNumberPart(param: string) {
		return parseInt(param.replace('px', ''));

	}	

	export function getLeftValuePx(prop: HorzProp, parentWidth: number) {
		if (prop.horzAlign === 'center') {
			let left = parentWidth/2 + prop.centerOffsetX - getNumberPart(prop.width)/2;
			return left + 'px';
		}
		else if (prop.left === 'auto') {
			let left = parentWidth - (getNumberPart(prop.width) + getNumberPart(prop.right));
			return left + 'px';
		}
		else {
			return prop.left;
		}
	}
	export function getRightValuePx(prop: HorzProp, parentWidth: number) {
		if (prop.horzAlign === 'center') {
			 let right = parentWidth/2 - prop.centerOffsetX - getNumberPart(prop.width)/2;
			 return right + 'px';
		}
		else if (prop.right === 'auto') {
			let right = parentWidth - (getNumberPart(prop.left) + getNumberPart(prop.width));
			return right + 'px';
		}
		else {
			return prop.right;
		}
	}
	export function getWidthValuePx(prop: HorzProp, parentWidth: number) {
		if (prop.width === 'auto') {
			return parentWidth - (getNumberPart(prop.left) + getNumberPart(prop.right)) + 'px';
		}
		else {
			return prop.width;
		}
	}
	export function getCenterOffsetX(prop: HorzProp, parentWidth: number) {
		let left = getNumberPart(getLeftValuePx(prop, parentWidth));
		let width = getNumberPart(getWidthValuePx(prop, parentWidth));
		let centerOffsetX =  (left + width/2) - parentWidth/2;
		return centerOffsetX + 'px';
	}	
}
