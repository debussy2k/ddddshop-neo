import interact from 'interactjs'
import type { ResizeEvent } from '@interactjs/types'
import * as util from '$lib/studio/util'
import { studioDoc } from '$lib/studio/studio-doc.svelte'
import type { BaseWidgetProp, SizeConstraints } from '$lib/studio/types'
import * as constraintsUtilHorz from './constraints-util-horz'
import * as constraintsUtilVert from './constraints-util-vert'

export type WidthMinMax = {
	hasMinWidth: boolean;
	minWidth: number;
	hasMaxWidth: boolean;
	maxWidth: number;
	hasMinHeight: boolean;
	minHeight: number;
	hasMaxHeight: boolean;
	maxHeight: number;	
}

type ContextInfo = {
	left: number;
	right: number;
    top: number;
    bottom: number;
	parentWidth: number;
	parentHeight: number;
}

export interface ResizableConfig {
    id: string;
    element: HTMLElement|SVGElement;
    getCurrentProp: () => BaseWidgetProp; // 현재 크기/위치 정보는 reactive하기 때문에 함수로 전달
	getParentSize: () => { width: number; height: number };
    updateCallback: (id: string, updatedProps: Partial<BaseWidgetProp>) => void;
    minSize?: { width: number; height: number };
    maxSize?: { width: number; height: number };
    edges?: { top?: boolean; left?: boolean; bottom?: boolean; right?: boolean };
}

export function unsetup(element: HTMLElement | SVGElement) {
	interact(element).resizable(false);
}

/**
 * min, max 값 변경을 감지하는 함수
 * @param currentProp 현재 크기/위치 정보
 * @param prevMinMaxHash 이전 min, max 값 해시
 * @returns 현재 min, max 값 해시와 변경 여부
 */
export function detectMinMaxChanges(sizeConstraints: SizeConstraints, prevMinMaxHash:string) {
	const currentMinMaxValues = {
		hasMinWidth: sizeConstraints.hasMinWidth,
		minWidth: sizeConstraints.minWidth,
		hasMaxWidth: sizeConstraints.hasMaxWidth,
		maxWidth: sizeConstraints.maxWidth,
		hasMinHeight: sizeConstraints.hasMinHeight,
		minHeight: sizeConstraints.minHeight,
		hasMaxHeight: sizeConstraints.hasMaxHeight,
		maxHeight: sizeConstraints.maxHeight
	};

	// 약간 비효율적인 방법이지만, 코드 간결성을 위해 사용.
	const currentHash = JSON.stringify(currentMinMaxValues);
	
	return {
		currentHash,
		changed: prevMinMaxHash !== currentHash
	}
}

/**
 * 요소를 리사이즈 가능하게 만드는 범용 함수
 * @param config 리사이즈 설정 객체
 */
export function setupResizable(config: ResizableConfig): void {
	let ctx: ContextInfo;
    
	interact(config.element).resizable(false);

	const { min, max } = calculateMinMaxSizes();

    interact(config.element).resizable({
        edges: config.edges || { top: true, left: true, bottom: true, right: true },
        modifiers: [
            interact.modifiers.restrictSize({
                min: min,
				max: max
            }),
			// 향후 필요시 사용할 것.
			// interact.modifiers.aspectRatio({
			// 	ratio: 'preserve',   // 현재 비율 유지
			// 	// ratio: 16 / 9,     // 고정된 비율 (예: 16:9)
			//   }),			
        ],
        listeners: {
            start: (event: ResizeEvent) => {
                event.stopPropagation();
                studioDoc.historyManager.setBatchMode();
				const currentProp = config.getCurrentProp();
				ctx = newContext(currentProp);
				
				console.log('resizablestart', ctx);
				// hugContentsWidth가 true이고 수평 방향으로 리사이즈 하는 경우 -> fullWidth나 hugContentsWidth를 해제
				if (currentProp.sizeConstraints?.hugContentsWidth && (event.edges?.left || event.edges?.right)) {
					config.updateCallback(config.id, {
						sizeConstraints: {
							...currentProp.sizeConstraints,
							fullWidth: false,
							hugContentsWidth: false,
						},
						width: currentProp.width,
					});
				}
				// hugContentsHeight가 true이고 수직 방향으로 리사이즈 하는 경우 -> fullHeight나 hugContentsHeight를 해제
				if (currentProp.sizeConstraints?.hugContentsHeight && (event.edges?.top || event.edges?.bottom)) {
					config.updateCallback(config.id, {
						sizeConstraints: {
							...currentProp.sizeConstraints,
							fullHeight: false,
							hugContentsHeight: false,
						},
						height: currentProp.height,
					});
				}
            },
            move: (event: ResizeEvent) => {
				// console.log('move', event.deltaRect);
				const newPosition = getNewPosition(event, ctx);
                config.updateCallback(config.id, newPosition);
            },
            end: (event: ResizeEvent) => {
				const newPosition = getNewPosition(event, ctx);
				config.updateCallback(config.id, newPosition);

                studioDoc.historyManager.commitBatch();
                event.stopPropagation();
            }
        }
    });

	// min, max 값 계산 함수
	function calculateMinMaxSizes() {
		let min = { width: 1, height: 1 };
		let max = { width: Infinity, height: Infinity };

		// config.getCurrentProp()에서 min/max 속성들 확인
		const currentProp = config.getCurrentProp();
		
		if (currentProp.sizeConstraints) {
			const sizeConstraints = currentProp.sizeConstraints;
			// getCurrentProp의 min/max 속성들을 반영
			if (sizeConstraints.hasMinWidth && typeof sizeConstraints.minWidth === 'number') {
				min.width = sizeConstraints.minWidth;
			}
			if (sizeConstraints.hasMinHeight && typeof sizeConstraints.minHeight === 'number') {
				min.height = sizeConstraints.minHeight;
			}
			if (sizeConstraints.hasMaxWidth && typeof sizeConstraints.maxWidth === 'number') {
				max.width = sizeConstraints.maxWidth;
			}
			if (sizeConstraints.hasMaxHeight && typeof sizeConstraints.maxHeight === 'number') {
				max.height = sizeConstraints.maxHeight;
			}
		}

		// config.minSize, config.maxSize가 있으면 우선 사용
		if (config.minSize) {
			min = config.minSize;
		}
		if (config.maxSize) {
			max = config.maxSize;
		}

		return { min, max };
	}
	
	function newContext(prop: BaseWidgetProp) : ContextInfo {
        const parentSize = config.getParentSize();
        // prop.horzAlign이 'scale'인 경우에만 필요한 설정임.
        const ctxInfo: ContextInfo = {
            left: constraintsUtilHorz.getLeftValue(prop, parentSize.width),
            right: constraintsUtilHorz.getRightValue(prop, parentSize.width),
            top: constraintsUtilVert.getTopValue(prop, parentSize.height),
            bottom: constraintsUtilVert.getBottomValue(prop, parentSize.height),
            parentWidth: parentSize.width,
            parentHeight: parentSize.height

        };

		return ctxInfo;
	}

	function getNewPosition(event: ResizeEvent, ctx: ContextInfo) : Partial<BaseWidgetProp> {
		const prop = config.getCurrentProp();
		const horzPos = calcHorzProps(event, prop, ctx);
		const vertPos = calcVertProps(event, prop, ctx);

		const result: Partial<BaseWidgetProp> = {
			...horzPos,
			...vertPos
		};

		// width 또는 height 변화가 있으면 fill container 속성을 제거함
		if (prop.sizeConstraints?.fullWidth || prop.sizeConstraints?.fullHeight) {
			result.sizeConstraints = {
				...prop.sizeConstraints,
			}
			if (event.deltaRect?.width !== 0) {
				result.sizeConstraints.fullWidth = false;
			}
			if (event.deltaRect?.height !== 0) {
				result.sizeConstraints.fullHeight = false;
			}
		}

		return result;
	}

    function calcHorzProps(event: ResizeEvent, prop: BaseWidgetProp, ctx: ContextInfo) : Partial<Pick<BaseWidgetProp, 'left' | 'right' | 'width' | 'centerOffsetX'>> {
		let horzPos: Partial<BaseWidgetProp>;
		let deltaRect = event.deltaRect || { left: 0, width: 0, top: 0, height: 0, right: 0, bottom: 0 };

		// resizeend에 deltaRect의 right나 width가 0이 아닌 값이 있어 오작동하는 것을 방지하기 위해 초기화
		if (event.type === 'resizeend')
			deltaRect = { left: 0, width: 0, top: 0, height: 0, right: 0, bottom: 0 };

		// horizontal
		if (prop.horzAlign === 'left') {
			horzPos = {
				left: Math.round(util.getNumberPart(prop.left || '0')) + deltaRect?.left + 'px',
				width: Math.round(util.getNumberPart(prop.width || '0')) + deltaRect?.width + 'px',
				right: 'auto'
			}
		}
		else if (prop.horzAlign === 'right') {
			horzPos = {
				right: Math.round(util.getNumberPart(prop.right || '0')) - deltaRect?.right + 'px',
				width: Math.round(util.getNumberPart(prop.width || '0')) + deltaRect?.width + 'px',
				left: 'auto'
			}
		}
		else if (prop.horzAlign === 'both') {
			horzPos = {
				left: Math.round(util.getNumberPart(prop.left || '0')) + deltaRect?.left + 'px',
				right: Math.round(util.getNumberPart(prop.right || '0')) - deltaRect?.right + 'px',
				width: 'auto',
			}
		}
		else if (prop.horzAlign === 'center') {
			// console.log('center', deltaRect);
			const newWidth = util.getNumberPart(prop.width || '0') + deltaRect?.width;
			let newCenterOffsetX = prop.centerOffsetX || 0;
			if (deltaRect?.left !== 0) {
				newCenterOffsetX += deltaRect?.left/2
			}
			else if (deltaRect?.right !== 0) {
				newCenterOffsetX += deltaRect?.right/2
			}

			horzPos = {
				left: `calc(50% + ${newCenterOffsetX}px  - ${newWidth/2}px)`,
				width: newWidth + 'px',
				centerOffsetX: newCenterOffsetX,
			}
		}
		else if (prop.horzAlign === 'scale') {
			// console.log('scale', deltaRect);
			if (event.type === 'resizeend') {
				horzPos = {
					left: 100 * ctx.left / ctx.parentWidth + '%',
					right: 100 * ctx.right / ctx.parentWidth + '%'
				}
			}
			else {
				ctx.left = Math.round(ctx.left) + deltaRect?.left;
				ctx.right = Math.round(ctx.right) - deltaRect?.right;
				horzPos = {
					left: ctx.left + 'px',
					right: ctx.right + 'px',
					width: 'auto'
				}
			}
		}
        else {
			horzPos = {
				left: Math.round(util.getNumberPart(prop.left || '0')) + deltaRect?.left + 'px',
				width: Math.round(util.getNumberPart(prop.width || '0')) + deltaRect?.width + 'px',
				right: 'auto'
			}
        }

        return horzPos;
    }

    function calcVertProps(event: ResizeEvent, prop: BaseWidgetProp, ctx: ContextInfo) : Partial<Pick<BaseWidgetProp, 'top' | 'bottom' | 'height' | 'centerOffsetY'>> {
		let vertPos: Partial<BaseWidgetProp>;
		let deltaRect = event.deltaRect || { left: 0, width: 0, top: 0, height: 0, right: 0, bottom: 0 };

		// resizeend에 deltaRect의 right나 width가 0이 아닌 값이 있어 오작동하는 것을 방지하기 위해 초기화
		if (event.type === 'resizeend')
			deltaRect = { left: 0, width: 0, top: 0, height: 0, right: 0, bottom: 0 };
		
		// vertical
		if (prop.vertAlign === 'top') {
			vertPos = {
				top: Math.round(util.getNumberPart(prop.top || '0')) + deltaRect?.top + 'px',
				height: Math.round(util.getNumberPart(prop.height || '0')) + deltaRect?.height + 'px',
				bottom: 'auto'
			}
		}
		else if (prop.vertAlign === 'bottom') {
			vertPos = {
				bottom: Math.round(util.getNumberPart(prop.bottom || '0')) - deltaRect?.bottom + 'px',
				height: Math.round(util.getNumberPart(prop.height || '0')) + deltaRect?.height + 'px',
				top: 'auto'
			}
		}
		else if (prop.vertAlign === 'both') {
			vertPos = {
				top: Math.round(util.getNumberPart(prop.top || '0')) + deltaRect?.top + 'px',
				bottom: Math.round(util.getNumberPart(prop.bottom || '0')) - deltaRect?.bottom + 'px',
				height: 'auto',
			}
		}
		else if (prop.vertAlign === 'center') {
			const newHeight = util.getNumberPart(prop.height || '0') + deltaRect?.height;
			let newCenterOffsetY = prop.centerOffsetY || 0;
			if (deltaRect?.top !== 0) {
				newCenterOffsetY += deltaRect?.top/2
			}
			else if (deltaRect?.bottom !== 0) {
				newCenterOffsetY += deltaRect?.bottom/2
			}

			vertPos = {
				top: `calc(50% + ${newCenterOffsetY}px  - ${newHeight/2}px)`,
				height: newHeight + 'px',
				centerOffsetY: newCenterOffsetY,
			}
		}
		else if (prop.vertAlign === 'scale') {
			if (event.type === 'resizeend') {
				vertPos = {
					top: 100 * ctx.top / ctx.parentHeight + '%',
					bottom: 100 * ctx.bottom / ctx.parentHeight + '%'
				}
			}
			else {
				ctx.top = Math.round(ctx.top) + deltaRect?.top;
				ctx.bottom = Math.round(ctx.bottom) - deltaRect?.bottom;
				vertPos = {
					top: ctx.top + 'px',
					bottom: ctx.bottom + 'px',
					height: 'auto'
				}
			}
		}
        else {
			vertPos = {
				top: Math.round(util.getNumberPart(prop.top || '0')) + deltaRect?.top + 'px',
				height: Math.round(util.getNumberPart(prop.height || '0')) + deltaRect?.height + 'px',
				bottom: 'auto'
			}
        }

        return vertPos;
    }
}
