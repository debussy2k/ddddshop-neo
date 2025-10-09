
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

export function round2(val: number) {
	return Math.round(val * Math.pow(10, 2)) / Math.pow(10, 2);
}