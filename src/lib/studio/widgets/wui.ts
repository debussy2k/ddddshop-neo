import interact from 'interactjs'
import type { DragEvent } from '@interactjs/types'
import { util } from '$lib/studio/util'
import { studioDoc } from '$lib/studio/studio-doc.svelte'

export namespace wui {
    export interface CurrentPosition {
        left: string;
        top: string;
    }

    export interface DraggableConfig {
        id: string;
        element: HTMLElement;
        getCurrentProp: () => CurrentPosition; // 현재 위치 정보는 reactive하기 때문에 함수로 전달
        updateCallback: (id: string, position: { left: string; top: string }) => void;
    }

    /**
     * 요소를 드래그 가능하게 만드는 범용 함수
     * @param config 드래그 설정 객체
     */
    export function setupDraggable(config: DraggableConfig): void {
        let position = { x: 0, y: 0 };
        
        // 기존 draggable 설정 제거 (중복 방지)
        interact(config.element).unset();
        interact(config.element).draggable({
            listeners: {
                start: (event: DragEvent) => {
                    const currentProp = config.getCurrentProp();
                    position.x = util.getNumberPart(currentProp.left);
                    position.y = util.getNumberPart(currentProp.top);
                    studioDoc.historyManager.setBatchMode();
                },
                move: (event: DragEvent) => {
                    position.x += event.dx;
                    position.y += event.dy;
                    config.updateCallback(config.id, {
                        left: position.x + 'px',
                        top: position.y + 'px'
                    });
                },
                end: (event: DragEvent) => {
                    studioDoc.historyManager.commitBatch();
                }
            }
        });
    }
}