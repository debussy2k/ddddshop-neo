type HorzProp = {
	left: string;
	right: string;
	width: string;
}

export namespace util {
	/**
	 * 픽셀 값에서 숫자 추출
	 */
	export function getNumberPart(param: string) {
		return parseInt(param.replace('px', ''));

	}	

	export function getLeftValuePx(prop: HorzProp, parentWidth: number) {
		if (prop.left === 'auto') {
			let left = parentWidth - (getNumberPart(prop.width) + getNumberPart(prop.right));
			return left + 'px';
		}
		else {
			return prop.left;
		}
	}
	export function getRightValuePx(prop: HorzProp, parentWidth: number) {
		if (prop.right === 'auto') {
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
}