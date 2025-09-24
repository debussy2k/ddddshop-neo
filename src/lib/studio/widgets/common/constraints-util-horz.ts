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
			let leftPercent = util.toPercent(getLeftValue(currentProp, parentWidth), parentWidth);
			let rightPercent = util.toPercent(getRightValue(currentProp, parentWidth), parentWidth);
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
		let left = getLeftValue(prop, parentWidth);
		let width = getWidthValue(prop, parentWidth);
		let centerOffsetX =  (left + width/2) - parentWidth/2;
		return util.round(centerOffsetX, 2);
	}	
}
