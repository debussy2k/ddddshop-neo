import type { BaseWidgetProp, HorizontalAlign } from "$lib/studio/types";
import { util } from "$lib/studio/util";


export namespace constraintsUtil {
	export function createHorzAlignProps(newHorzAlign: HorizontalAlign, currentProp: BaseWidgetProp, parentWidth: number) {
		let obj: Partial<BaseWidgetProp> = {};
		if (newHorzAlign === 'left') {
			let left = util.getLeftValuePx(currentProp, parentWidth);
			obj = {
				horzAlign: "left",
				left: left,
				width: util.getWidthValuePx(currentProp, parentWidth),
				right: 'auto',
			}
		}
		else if (newHorzAlign === 'right') {
			let right = util.getRightValuePx(currentProp, parentWidth);
			obj = {
				horzAlign: "right",
				left: 'auto',
				width: util.getWidthValuePx(currentProp, parentWidth),
				right: right,
			}
		}
		else if (newHorzAlign === 'both') {
			let left = util.getLeftValuePx(currentProp, parentWidth);
			let right = util.getRightValuePx(currentProp, parentWidth);
			obj = {
				horzAlign: "both",
				left: left,
				right: right,
				width: 'auto',
			}
		}
		else if (newHorzAlign === 'center') {
			let centerOffsetX = util.getCenterOffsetX(currentProp, parentWidth);
			let child_width_half = util.getNumberPart(util.getWidthValuePx(currentProp, parentWidth))/2;
			let left = `calc(50% + ${centerOffsetX} - ${child_width_half}px)`;
			obj = {
				horzAlign: "center",
				left: left,
				width: util.getWidthValuePx(currentProp, parentWidth),
				right: 'auto',
				centerOffsetX: util.getNumberPart(centerOffsetX),
			}
		}
		else {
			console.error(`invalid horz align`, newHorzAlign);
		}	

		return obj;
	}
}
