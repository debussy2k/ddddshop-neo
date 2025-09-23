import type { HorizontalAlign } from "./types";

type HorzProp = {
	left: string;
	right: string;
	width: string;
	centerOffsetX: number;
	horzAlign: HorizontalAlign;
}

export namespace util {
	/**
	 * 픽셀 값에서 숫자 추출
	 */
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