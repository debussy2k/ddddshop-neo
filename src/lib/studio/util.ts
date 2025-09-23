import type { HorizontalAlign } from "./types";


export namespace util {
	/**
	 * 픽셀 값에서 숫자 추출
	 */
	export function getNumberPart(param: string) {
		return Number(param.replace('px', ''));

	}	


}