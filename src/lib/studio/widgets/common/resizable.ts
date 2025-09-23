import interact from 'interactjs'
import type { ResizeEvent } from '@interactjs/types'
import { util } from '$lib/studio/util'
import { studioDoc } from '$lib/studio/studio-doc.svelte'
import type { BaseWidgetProp } from '$lib/studio/types'
import { constraintsUtilHorz } from './constraints-util-horz'
import { constraintsUtilVert } from './constraints-util-vert'

export type LayoutProp = Pick<BaseWidgetProp, 
    'left' | 'width' | 'right' | 'centerOffsetX' | 'horzAlign' | 
    'top' | 'bottom' | 'height' | 'centerOffsetY' | 'vertAlign'>;

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
    getCurrentProp: () => LayoutProp; // 현재 크기/위치 정보는 reactive하기 때문에 함수로 전달
	getParentSize: () => { width: number; height: number };
    updateCallback: (id: string, updatedProps: Partial<LayoutProp>) => void;
    minSize?: { width: number; height: number };
    edges?: { top?: boolean; left?: boolean; bottom?: boolean; right?: boolean };
}

/**
 * 요소를 리사이즈 가능하게 만드는 범용 함수
 * @param config 리사이즈 설정 객체
 */
export function setupResizable(config: ResizableConfig): void {
	let ctx: ContextInfo;
    
    interact(config.element).resizable({
        edges: config.edges || { top: true, left: true, bottom: true, right: true },
        modifiers: [
            interact.modifiers.restrictSize({
                min: config.minSize || { width: 10, height: 10 }
            })
        ],
        listeners: {
            start: (event: ResizeEvent) => {
                event.stopPropagation();
                studioDoc.historyManager.setBatchMode();
				ctx = newContext(config.getCurrentProp());
            },
            move: (event: ResizeEvent) => {
				// console.log('move', event.deltaRect);
				let newPosition = getNewPosition(event, ctx);
                config.updateCallback(config.id, newPosition);
            },
            end: (event: ResizeEvent) => {
				let newPosition = getNewPosition(event, ctx);
                config.updateCallback(config.id, newPosition);

                studioDoc.historyManager.commitBatch();
                event.stopPropagation();
            }
        }
    });

	function newContext(prop: LayoutProp) : ContextInfo {
        let parentSize = config.getParentSize();
        // prop.horzAlign이 'scale'인 경우에만 필요한 설정임.
        let ctxInfo: ContextInfo = {
            left: constraintsUtilHorz.getLeftValue(prop, parentSize.width),
            right: constraintsUtilHorz.getRightValue(prop, parentSize.width),
            top: constraintsUtilVert.getTopValue(prop, parentSize.height),
            bottom: constraintsUtilVert.getBottomValue(prop, parentSize.height),
            parentWidth: parentSize.width,
            parentHeight: parentSize.height

        };

		return ctxInfo;
	}

	function getNewPosition(event: ResizeEvent, ctx: ContextInfo) : Partial<LayoutProp> {
		const prop = config.getCurrentProp();
		let horzPos: Partial<LayoutProp> = calcHorzProps(event, prop, ctx);
		let vertPos: Partial<LayoutProp> = calcVertProps(event, prop, ctx);

		return {
			...horzPos,
			...vertPos
		}
	}

    function calcHorzProps(event: ResizeEvent, prop: LayoutProp, ctx: ContextInfo) : Partial<LayoutProp> {
		let horzPos: Partial<LayoutProp>;
		let deltaRect = event.deltaRect || { left: 0, width: 0, top: 0, height: 0, right: 0, bottom: 0 };

		// horizontal
		if (prop.horzAlign === 'left') {
			horzPos = {
				left: util.getNumberPart(prop.left || '0') + deltaRect?.left + 'px',
				width: util.getNumberPart(prop.width || '0') + deltaRect?.width + 'px',
				right: 'auto'
			}
		}
		else if (prop.horzAlign === 'right') {
			horzPos = {
				right: util.getNumberPart(prop.right || '0') - deltaRect?.right + 'px',
				width: util.getNumberPart(prop.width || '0') + deltaRect?.width + 'px',
				left: 'auto'
			}
		}
		else if (prop.horzAlign === 'both') {
			horzPos = {
				left: util.getNumberPart(prop.left || '0') + deltaRect?.left + 'px',
				right: util.getNumberPart(prop.right || '0') - deltaRect?.right + 'px',
				width: 'auto',
			}
		}
		else if (prop.horzAlign === 'center') {
			// console.log('center', deltaRect);
			let newWidth = util.getNumberPart(prop.width || '0') + deltaRect?.width;
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
				ctx.left += deltaRect?.left;
				ctx.right -= deltaRect?.right;
				horzPos = {
					left: ctx.left + 'px',
					right: ctx.right + 'px',
					width: 'auto'
				}
			}
		}
        else {
			horzPos = {
				left: util.getNumberPart(prop.left || '0') + deltaRect?.left + 'px',
				width: util.getNumberPart(prop.width || '0') + deltaRect?.width + 'px',
				right: 'auto'
			}
        }

        return horzPos;
    }

    function calcVertProps(event: ResizeEvent, prop: LayoutProp, ctx: ContextInfo) : Partial<LayoutProp> {
		let vertPos: Partial<LayoutProp>;
		let deltaRect = event.deltaRect || { left: 0, width: 0, top: 0, height: 0, right: 0, bottom: 0 };

		// vertical
		if (prop.vertAlign === 'top') {
			vertPos = {
				top: util.getNumberPart(prop.top || '0') + deltaRect?.top + 'px',
				height: util.getNumberPart(prop.height || '0') + deltaRect?.height + 'px',
				bottom: 'auto'
			}
		}
		else if (prop.vertAlign === 'bottom') {
			vertPos = {
				bottom: util.getNumberPart(prop.bottom || '0') - deltaRect?.bottom + 'px',
				height: util.getNumberPart(prop.height || '0') + deltaRect?.height + 'px',
				top: 'auto'
			}
		}
		else if (prop.vertAlign === 'both') {
			vertPos = {
				top: util.getNumberPart(prop.top || '0') + deltaRect?.top + 'px',
				bottom: util.getNumberPart(prop.bottom || '0') - deltaRect?.bottom + 'px',
				height: 'auto',
			}
		}
		else if (prop.vertAlign === 'center') {
			let newHeight = util.getNumberPart(prop.height || '0') + deltaRect?.height;
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
				ctx.top += deltaRect?.top;
				ctx.bottom -= deltaRect?.bottom;
				vertPos = {
					top: ctx.top + 'px',
					bottom: ctx.bottom + 'px',
					height: 'auto'
				}
			}
		}
        else {
			vertPos = {
				top: util.getNumberPart(prop.top || '0') + deltaRect?.top + 'px',
				height: util.getNumberPart(prop.height || '0') + deltaRect?.height + 'px',
				bottom: 'auto'
			}
        }

        return vertPos;
    }
}
