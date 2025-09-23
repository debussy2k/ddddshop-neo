import interact from 'interactjs'
import type { DragEvent } from '@interactjs/types'
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

export type DraggableConfig = {
    id: string;
    element: HTMLElement|SVGElement;
    getCurrentProp: () => LayoutProp; // 현재 위치 정보는 reactive하기 때문에 함수로 전달
	getParentSize: () => { width: number; height: number };
    updateCallback: (id: string, updatedProps: Partial<LayoutProp>) => void;
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
				let newPosition = getNewPosition(event, ctx);
                config.updateCallback(config.id, newPosition);
                event.stopPropagation();
            },
            end: (event: DragEvent) => {
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

	function getNewPosition(event: DragEvent, ctx: ContextInfo) : Partial<LayoutProp> {
		const prop = config.getCurrentProp();
		let horzPos: Partial<LayoutProp> =  calcHorzProps(event, prop, ctx);
		let vertPos: Partial<LayoutProp> = calcVertProps(event, prop, ctx);

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
				left: util.getNumberPart(prop.left || '0') + event.dx + 'px',
				right: 'auto'
			}
		}
		else if (prop.horzAlign === 'right') {
			horzPos = {
				right: util.getNumberPart(prop.right || '0') - event.dx + 'px',
				left: 'auto'
			}
		}
		else if (prop.horzAlign === 'both') {
			horzPos = {
				left: util.getNumberPart(prop.left || '0') + event.dx + 'px',
				right: util.getNumberPart(prop.right || '0') - event.dx + 'px'
			}
		}
		else if (prop.horzAlign === 'center') {
			let newCenterOffsetX = (prop.centerOffsetX || 0) + event.dx;
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
				// drag 하는 동안은 px값으로 계산함
				ctx.left += event.dx;
				ctx.right -= event.dx;
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
				top: util.getNumberPart(prop.top || '0') + event.dy + 'px',
				bottom: 'auto'
			}
		}
		else if (prop.vertAlign === 'bottom') {
			vertPos = {
				bottom: util.getNumberPart(prop.bottom || '0') - event.dy + 'px',
				top: 'auto'
			}
		}
		else if (prop.vertAlign === 'both') {
			vertPos = {
				top: util.getNumberPart(prop.top || '0') + event.dy + 'px',
				bottom: util.getNumberPart(prop.bottom || '0') - event.dy + 'px'
			}
		}
		else if (prop.vertAlign === 'center') {
			let newCenterOffsetY = (prop.centerOffsetY || 0) + event.dy;
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
				ctx.top += event.dy;
				ctx.bottom -= event.dy;
				vertPos = {
					top: ctx.top + 'px',
					bottom: ctx.bottom + 'px'
				}
			}
		}
		else {
			vertPos = {
				top: util.getNumberPart(prop.top || '0') + event.dy + 'px',
				bottom: 'auto'
			}
		}      
        
        return vertPos;
	}
}
