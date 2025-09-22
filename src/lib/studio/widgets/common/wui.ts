import interact from 'interactjs'
import type { DragEvent, ResizeEvent } from '@interactjs/types'
import { util } from '$lib/studio/util'
import { studioDoc } from '$lib/studio/studio-doc.svelte'
import type { HorizontalAlign } from '$lib/studio/types'

export namespace wui {

    // ------------------------------------------------------------
    // for Draggable
    // ------------------------------------------------------------

    export interface CurrentPosition {
        left: string;
		width: string;
		right: string;
        horzAlign: HorizontalAlign;
        top: string;
    }
    export interface DraggableConfig {
        id: string;
        element: HTMLElement|SVGElement;
        getCurrentProp: () => CurrentPosition; // 현재 위치 정보는 reactive하기 때문에 함수로 전달
        updateCallback: (id: string, position: CurrentPosition) => void;
    }

    /**
     * 요소를 드래그 가능하게 만드는 범용 함수
     * @param config 드래그 설정 객체
     */
    export function setupDraggable(config: DraggableConfig): void {
        
        // 기존 draggable 설정 제거 (중복 방지)
        interact(config.element).draggable({
            listeners: {
                start: (event: DragEvent) => {
                    studioDoc.historyManager.setBatchMode();
                    event.stopPropagation();
                },
                move: (event: DragEvent) => {
					let newPosition = getNewPosition(event);
                    config.updateCallback(config.id, newPosition as CurrentPosition);
                    event.stopPropagation();
                },
                end: (event: DragEvent) => {
                    studioDoc.historyManager.commitBatch();
                    event.stopPropagation();
                }
            }
        });


		function getNewPosition(event: DragEvent) {
			const prop = config.getCurrentProp();
			let horzPos: Partial<CurrentPosition>;
			let vertPos: Partial<CurrentPosition>;

			// horizontal
			if (prop.horzAlign === 'left') {
				horzPos = {
					left: util.getNumberPart(prop.left) + event.dx + 'px',
					right: 'auto'
				}
			}
			else if (prop.horzAlign === 'right') {
				horzPos = {
					right: util.getNumberPart(prop.right) - event.dx + 'px',
					left: 'auto'
				}
			}
			else if (prop.horzAlign === 'both') {
				horzPos = {
					left: util.getNumberPart(prop.left) + event.dx + 'px',
					right: util.getNumberPart(prop.right) - event.dx + 'px'
				}
			}
			else {
				horzPos = {
					left: util.getNumberPart(prop.left) + event.dx + 'px',
					right: 'auto'
				}
			}

			// vertical
			vertPos = {
				top: util.getNumberPart(prop.top) + event.dy + 'px',
			}

			return {
				...horzPos,
				...vertPos
			}
		}
    }

    // ------------------------------------------------------------
    // for Resizable
    // ------------------------------------------------------------

    export interface CurrentDimensions {
        width: string;
        height: string;
        left: string;
        top: string;
    }
    export interface ResizableConfig {
        id: string;
        element: HTMLElement|SVGElement;
        getCurrentProp: () => CurrentDimensions; // 현재 크기/위치 정보는 reactive하기 때문에 함수로 전달
        updateCallback: (id: string, dimensions: { width: string; height: string; left: string; top: string }) => void;
        minSize?: { width: number; height: number };
        edges?: { top?: boolean; left?: boolean; bottom?: boolean; right?: boolean };
    }

    /**
     * 요소를 리사이즈 가능하게 만드는 범용 함수
     * @param config 리사이즈 설정 객체
     */
    export function setupResizable(config: ResizableConfig): void {
        let rect = { width: 0, height: 0, left: 0, top: 0 };

        // 기존 resizable 설정 제거 (중복 방지)
        interact(config.element).resizable({
            edges: config.edges || { top: true, left: true, bottom: true, right: true },
            modifiers: [
                interact.modifiers.restrictSize({
                    min: config.minSize || { width: 10, height: 10 }
                })
            ],
            listeners: {
                start: (event: ResizeEvent) => {
                    studioDoc.historyManager.setBatchMode();
                    const currentProp = config.getCurrentProp();
                    rect.width = util.getNumberPart(currentProp.width);
                    rect.height = util.getNumberPart(currentProp.height);
                    rect.left = util.getNumberPart(currentProp.left);
                    rect.top = util.getNumberPart(currentProp.top);
                },
                move: (event: ResizeEvent) => {
                    rect.width += event.deltaRect?.width || 0;
                    rect.height += event.deltaRect?.height || 0;
                    rect.left += event.deltaRect?.left || 0;
                    rect.top += event.deltaRect?.top || 0;
                    config.updateCallback(config.id, {
                        width: rect.width + 'px',
                        height: rect.height + 'px',
                        left: rect.left + 'px',
                        top: rect.top + 'px'
                    });
                },
                end: (event: ResizeEvent) => {
                    studioDoc.historyManager.commitBatch();
                }
            }
        });
    }
}