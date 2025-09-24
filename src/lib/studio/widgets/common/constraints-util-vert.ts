import type { BaseWidgetProp, VerticalAlign } from "$lib/studio/types";
import { util } from "$lib/studio/util";

type VertProp = {
	top: string;
	bottom: string;
	height: string;
	centerOffsetY: number;
	vertAlign: VerticalAlign;
}


export namespace constraintsUtilVert {
	export function createVertAlignProps(newVertAlign: VerticalAlign, currentProp: BaseWidgetProp, parentHeight: number) {
		let obj: Partial<BaseWidgetProp> = {};
		if (newVertAlign === 'top') {
			let top = getTopValuePx(currentProp, parentHeight);
			obj = {
				vertAlign: "top",
				top: top,
				height: getHeightValuePx(currentProp, parentHeight),
				bottom: 'auto',
				centerOffsetY: 0
			}
		}
		else if (newVertAlign === 'bottom') {
			let bottom = getBottomValuePx(currentProp, parentHeight);
			obj = {
				vertAlign: "bottom",
				top: 'auto',
				height: getHeightValuePx(currentProp, parentHeight),
				bottom: bottom,
				centerOffsetY: 0
			}
		}
		else if (newVertAlign === 'both') {
			let top = getTopValuePx(currentProp, parentHeight);
			let bottom = getBottomValuePx(currentProp, parentHeight);
			obj = {
				vertAlign: "both",
				top: top,
				bottom: bottom,
				height: 'auto',
				centerOffsetY: 0
			}
		}
		else if (newVertAlign === 'center') {
			let centerOffsetY = getCenterOffsetY(currentProp, parentHeight);
			let child_height_half = getHeightValue(currentProp, parentHeight)/2;
			let top = `calc(50% + ${centerOffsetY}px - ${child_height_half}px)`;
			obj = {
				vertAlign: "center",
				top: top,
				height: getHeightValuePx(currentProp, parentHeight),
				bottom: 'auto',
				centerOffsetY: centerOffsetY,
			}
		}
		else if (newVertAlign === 'scale') {
			let topPercent = toPercent(getTopValue(currentProp, parentHeight), parentHeight);
			let bottomPercent = toPercent(getBottomValue(currentProp, parentHeight), parentHeight);
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

	export function getNumberPart(param: string) {
		return Number(param.replace('px', ''));
	}	
	export function toPercent(val: number, parentHeight: number, decimal: number = 2) {
		return Number(val/parentHeight*100).toFixed(decimal);
	}	

	export function getTopValue(prop: VertProp, parentHeight: number):number {
		if (prop.vertAlign === 'center') {
			let top = parentHeight/2 + prop.centerOffsetY - getNumberPart(prop.height)/2;
			return top;
		}
		else if (prop.vertAlign === 'scale') {
			let top = 0;
			if (prop.top.slice(-1) === '%')
				top = parentHeight * Number(prop.top.replace('%', '')) / 100;
			else
				top = getNumberPart(prop.top);
			return top;
		}
		else if (prop.top === 'auto') {
			let top = parentHeight - (getNumberPart(prop.height) + getNumberPart(prop.bottom));
			return top;
		}
		else {
			return getNumberPart(prop.top);
		}

	}
	export function getTopValuePx(prop: VertProp, parentHeight: number) {
		return getTopValue(prop, parentHeight) + 'px';
	}
	
	export function getBottomValue(prop: VertProp, parentHeight: number):number {
		if (prop.vertAlign === 'center') {
			let bottom = parentHeight/2 - prop.centerOffsetY - getNumberPart(prop.height)/2;
			return bottom;
		}
		else if (prop.vertAlign === 'scale') {
			let bottom = 0;
			if (prop.bottom.slice(-1) === '%')
				bottom = parentHeight * Number(prop.bottom.replace('%', '')) / 100;
			else
				bottom = getNumberPart(prop.bottom);
			return bottom;
		}
		else if (prop.bottom === 'auto') {
			let bottom = parentHeight - (getNumberPart(prop.top) + getNumberPart(prop.height));
			return bottom;
		}
		else {
			return getNumberPart(prop.bottom);
		}
	}
	export function getBottomValuePx(prop: VertProp, parentHeight: number) {
		return getBottomValue(prop, parentHeight) + 'px';
	}

	export function getHeightValue(prop: VertProp, parentHeight: number):number {
		if (prop.height === 'auto') {
			return parentHeight - (getTopValue(prop, parentHeight) + getBottomValue(prop, parentHeight));
		}
		else {
			return getNumberPart(prop.height);
		}
	}
	export function getHeightValuePx(prop: VertProp, parentHeight: number) {
		return getHeightValue(prop, parentHeight) + 'px';
	}

	export function getCenterOffsetY(prop: VertProp, parentHeight: number):number {
		let top = getTopValue(prop, parentHeight);
		let height = getHeightValue(prop, parentHeight);
		let centerOffsetY =  (top + height/2) - parentHeight/2;
		return centerOffsetY;
	}	
}
