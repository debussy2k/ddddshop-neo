import type { HorizontalAlign } from "./types";


export namespace util {
	/**
	 * 픽셀 값에서 숫자 추출
	 */
	export function getNumberPart(param: string) {
		return Number(param.replace('px', ''));

	}	

	export function toPercent(val: number, parentWidth: number, decimal: number = 2) {
		return round(val/parentWidth*100, decimal)
	}	

	export function round(val: number, decimal: number = 2) {
		return Math.round(val * Math.pow(10, decimal)) / Math.pow(10, decimal);
	}

}