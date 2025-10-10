import interact from 'interactjs'
import type { DragEvent } from '@interactjs/types'
import * as util from '$lib/studio/util'
import { studioDoc } from '$lib/studio/studio-doc.svelte'
import type { BaseWidgetProp } from '$lib/studio/types'
import * as constraintsUtilHorz from './constraints-util-horz'
import * as constraintsUtilVert from './constraints-util-vert'


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

export type DraggableConfig = {
    id: string;
    element: HTMLElement|SVGElement;
    getCurrentProp: () => LayoutProp; // 현재 위치 정보는 reactive하기 때문에 함수로 전달
	getParentSize: () => { width: number; height: number };
    updateCallback: (id: string, updatedProps: Partial<LayoutProp>) => void;
}

export function unsetup(element: HTMLElement | SVGElement) {
	interact(element).draggable(false);
}

/**
 * 요소를 드래그 가능하게 만드는 범용 함수
 * @param config 드래그 설정 객체
 */
export function setupDraggable(config: DraggableConfig): void {
	let ctx: ContextInfo;
    interact(config.element).draggable({
        listeners: {
            start: (event: DragEvent) => {
                event.stopPropagation();
                studioDoc.historyManager.setBatchMode();
				ctx = newContext(config.getCurrentProp());
            },
            move: (event: DragEvent) => {
				const newPosition = getNewPosition(event, ctx);
                config.updateCallback(config.id, newPosition);
                event.stopPropagation();
            },
            end: (event: DragEvent) => {
				const newPosition = getNewPosition(event, ctx);
                config.updateCallback(config.id, newPosition);

                studioDoc.historyManager.commitBatch();
                event.stopPropagation();
			}
        }
    });

	function newContext(prop: LayoutProp) : ContextInfo {
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

	function getNewPosition(event: DragEvent, ctx: ContextInfo) : Partial<LayoutProp> {
		const prop = config.getCurrentProp();
		const horzPos: Partial<LayoutProp> =  calcHorzProps(event, prop, ctx);
		const vertPos: Partial<LayoutProp> = calcVertProps(event, prop, ctx);

		return {
			...horzPos,
			...vertPos
		}
	}

    function calcHorzProps(event: DragEvent, prop: LayoutProp, ctx: ContextInfo) : Partial<LayoutProp> {
		let horzPos: Partial<LayoutProp>;

		// horizontal
		if (prop.horzAlign === 'left') {
			horzPos = {
				left: Math.round(util.getNumberPart(prop.left || '0')) + event.dx + 'px',
				right: 'auto'
			}
		}
		else if (prop.horzAlign === 'right') {
			horzPos = {
				right: Math.round(util.getNumberPart(prop.right || '0')) - event.dx + 'px',
				left: 'auto'
			}
		}
		else if (prop.horzAlign === 'both') {
			// left가 정수값이 되도록 처리. 
			const val = util.getNumberPart(prop.left || '0');
			const deciaml = val - Math.floor(val);
			const dx = event.dx - deciaml;
			horzPos = {
				left: util.getNumberPart(prop.left || '0') + dx + 'px',
				right: util.getNumberPart(prop.right || '0') - dx + 'px'
			}
		}
		else if (prop.horzAlign === 'center') {
			const newCenterOffsetX = (prop.centerOffsetX || 0) + event.dx;
			horzPos = {
				left: `calc(50% + ${newCenterOffsetX}px - ${util.getNumberPart(prop.width || '0')/2}px)`,
				centerOffsetX: newCenterOffsetX,
			}
		}
		else if (prop.horzAlign === 'scale') {
			if (event.type === 'dragend') {
				horzPos = {
					left: 100 * ctx.left / ctx.parentWidth + '%',
					right: 100 * ctx.right / ctx.parentWidth + '%'
				}
			}
			else {
				// left가 정수값이 되도록 처리. 
				const val = ctx.left;
				const deciaml = val - Math.floor(val);
				const dx = event.dx - deciaml;

				// drag 하는 동안은 px값으로 계산함
				ctx.left += dx;
				ctx.right -= dx;
				horzPos = {
					left: ctx.left + 'px',
					right: ctx.right + 'px'
				}
			}
		}
		else {
			horzPos = {
				left: util.getNumberPart(prop.left || '0') + event.dx + 'px',
				right: 'auto'
			}
		}      
        
        return horzPos;
    }

    function calcVertProps(event: DragEvent, prop: LayoutProp, ctx: ContextInfo) : Partial<LayoutProp> {
		let vertPos: Partial<LayoutProp>;

		// vertical
		if (prop.vertAlign === 'top') {
			vertPos = {
				top: Math.round(util.getNumberPart(prop.top || '0')) + event.dy + 'px',
				bottom: 'auto'
			}
		}
		else if (prop.vertAlign === 'bottom') {
			vertPos = {
				bottom: Math.round(util.getNumberPart(prop.bottom || '0')) - event.dy + 'px',
				top: 'auto'
			}
		}
		else if (prop.vertAlign === 'both') {
			const val = util.getNumberPart(prop.top || '0');
			const deciaml = val - Math.floor(val);
			const dy = event.dy - deciaml;

			vertPos = {
				top: util.getNumberPart(prop.top || '0') + dy + 'px',
				bottom: util.getNumberPart(prop.bottom || '0') - dy + 'px'
			}
		}
		else if (prop.vertAlign === 'center') {
			const newCenterOffsetY = (prop.centerOffsetY || 0) + event.dy;
			vertPos = {
				top: `calc(50% + ${newCenterOffsetY}px - ${util.getNumberPart(prop.height || '0')/2}px)`,
				centerOffsetY: newCenterOffsetY,
			}
		}
		else if (prop.vertAlign === 'scale') {
			if (event.type === 'dragend') {
				vertPos = {
					top: 100 * ctx.top / ctx.parentHeight + '%',
					bottom: 100 * ctx.bottom / ctx.parentHeight + '%'
				}
			}
			else {
				const val = ctx.top;
				const deciaml = val - Math.floor(val);
				const dy = event.dy - deciaml;

				ctx.top += dy;
				ctx.bottom -= dy;
				vertPos = {
					top: ctx.top + 'px',
					bottom: ctx.bottom + 'px'
				}
			}
		}
		else {
			vertPos = {
				top: Math.round(util.getNumberPart(prop.top || '0')) + event.dy + 'px',
				bottom: 'auto'
			}
		}      
        
        return vertPos;
	}
}
