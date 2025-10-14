import type { BaseWidgetProp, BaseContainerProp } from "$lib/studio/types";
import * as du from "$lib/studio/widgets/common/doc-util";

/**
 * Frame 위젯의 기본 스타일을 생성합니다.
 * @param currentProp - 현재 프레임의 속성
 * @param parentProp - 부모 요소의 속성
 * @param onStyleApplied - 스타일 적용 후 실행할 콜백 (refreshTrigger 업데이트용)
 */
export function getFrameCurrentStyle(
	currentProp: Readonly<BaseWidgetProp & BaseContainerProp>,
	parentProp: Readonly<BaseWidgetProp & BaseContainerProp>,
	onStyleApplied?: () => void
): string {
	let style = du.getBaseStyleOfLeafWidget(currentProp, parentProp.layout || 'block');

	if (currentProp.layout === 'flex-row') {
		style += `column-gap: ${currentProp.gap}px;`;
	}
	else if (currentProp.layout === 'flex-col') {
		style += `row-gap: ${currentProp.gap}px;`;
	}

	// style 변경 후 computedVal을 다시 계산되도록 하기 위해 콜백 실행
	if (onStyleApplied) {
		requestAnimationFrame(() => {
			onStyleApplied();
		});
	}

	return style;
}

/**
 * Frame 위젯의 레이아웃 스타일을 생성합니다.
 * @param currentProp - 현재 프레임의 속성
 */
export function getFrameLayoutStyle(
	currentProp: Readonly<BaseWidgetProp & BaseContainerProp>
): string {
	let style = "";

	// display
	if (currentProp.layout === 'block') {
		style += "display: block;";
	}
	else if (currentProp.layout === 'flex-row') {
		/*
			align-content:start; --> 기본 값이 stretch여서 row간 간격이 발생하는 문제가 발생하는 것을 방지하기 위해 추가함.
		*/
		style += `display: flex; flex-direction: row; align-content:start; column-gap: ${currentProp.gap}px; row-gap: ${currentProp.verticalGap}px;`;
		if (currentProp.wrap) 
			style += "flex-wrap: wrap;";
	}
	else if (currentProp.layout === 'flex-col') {
		style += `display: flex; flex-direction: column; row-gap: ${currentProp.gap}px;`;
	}
	else if (currentProp.layout === 'grid') {
		style += "display: grid;";
	}

	if (currentProp.layout === 'flex-row' || currentProp.layout === 'flex-col') {
		// justify-content
		if (currentProp.justifyContent === 'start') {
			style += "justify-content: flex-start;";
		}
		else if (currentProp.justifyContent === 'end') {
			style += "justify-content: flex-end;";
		}
		else if (currentProp.justifyContent === 'center') {
			style += "justify-content: center;";
		}
		else if (currentProp.justifyContent === 'space-between') {
			style += "justify-content: space-between;";
		}

		// 교차축 정렬 옵션 : align-items 또는 align-content(wrap인 경우)
		if (currentProp.wrap === false) {
			if (currentProp.alignItems === 'start') {
				style += `align-items: flex-start;`;
			}
			else if (currentProp.alignItems === 'end') {
				style += `align-items: flex-end;`;
			}
			else if (currentProp.alignItems === 'center') {
				style += `align-items: center;`;
			}
			else if (currentProp.alignItems === 'space-between') {
				style += `align-items: space-between;`;
			}
		}
		else {
			/*
				정리
					align-items: 한 줄 아이템 단위의 정렬을 지정함.
					align-content: 줄 묶음 단위의 정렬을 지정함.

				"align-items: flex-start"를 지정하는 이유
					- wrap인 경우 각 줄에 있는 아이템은 수직방향(=교차축)으로 높이가 가장 큰 아이템 높이에 맞춰짐.
					- 이를 방지하기 위해 align-items를 flex-start로 설정.
					- align-items의 기본값은 stretch이기 때문임.
			*/
			style += `align-items: flex-start;`;

			// align-content은 "줄 묶음" 단위의 정렬을 지정함.
			if (currentProp.alignItems === 'start') {
				style += `align-content: flex-start;`;
			}
			else if (currentProp.alignItems === 'end') {
				style += `align-content: flex-end;`;
			}
			else if (currentProp.alignItems === 'center') {
				style += `align-content: center;`;
			}
			else if (currentProp.alignItems === 'space-between') {
				style += `align-content: space-between;`;
			}
		}

		// padding
		style += `padding-left: ${currentProp.paddingLeft}px; padding-right: ${currentProp.paddingRight}px; padding-top: ${currentProp.paddingTop}px; padding-bottom: ${currentProp.paddingBottom}px;`;
	}

	return style;
}
