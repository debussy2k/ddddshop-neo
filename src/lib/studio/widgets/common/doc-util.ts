import type { BaseWidgetProp, CompositeWidget, DocState, LayoutType, Widget } from "../../types";

export namespace du {
    export function findById(id: string, draft: DocState) {
        // 재귀적으로 Widget을 찾는 헬퍼 함수
        function _find(widgets: Widget[] | undefined, targetId: string): Widget | undefined {
            if (!widgets) return undefined;
            
            for (const widget of widgets) {
                if (widget.id === targetId) {
                    return widget;
                }
                // children이 있는 경우 재귀적으로 검색
                if ('children' in widget && widget.children) {
                    const found = _find(widget.children, targetId);
                    if (found) return found;
                }
            }
            return undefined;
        }

        return _find(draft.sections, id);
    }

    export function getParentByChildId(id: string, draft: DocState): CompositeWidget | undefined {
        const widget = findById(id, draft);
        if (!widget) return undefined;
        
        const parent = findById(widget.parentId, draft);
        if (!parent) return undefined;

        return parent as CompositeWidget;
    }

    /**
     * 리프 위젯(자식이 없는 위젯)의 기본 스타일 문자열을 생성합니다.
     * 
     * 부모의 레이아웃 타입에 따라 position 속성을 결정하고, 
     * position이 absolute인 경우에만 left, top 값을 포함합니다.
     * 
     * @param prop 위젯의 위치/크기 속성 객체 (left, top, width, height)
     * @param layout 부모 위젯의 레이아웃 타입
     *   - 'block': absolute positioning (left, top 포함)
     *   - 'flex-row' | 'flex-col' | 'grid': relative positioning (left, top 제외)
     * @returns CSS 스타일 문자열 (position, width, height, 조건부로 left, top)
     * 
     * @example
     * ```typescript
     * // block 레이아웃인 경우
     * const style = getBaseStyleOfLeafWidget(
     *   { left: '10px', top: '20px', width: '100px', height: '50px' }, 
     *   'block'
     * );
     * // 결과: "position: absolute; width: 100px; height: 50px; left: 10px; top: 20px;"
     * 
     * // flex 레이아웃인 경우  
     * const style = getBaseStyleOfLeafWidget(
     *   { left: '10px', top: '20px', width: '100px', height: '50px' }, 
     *   'flex-row'
     * );
     * // 결과: "position: relative; width: 100px; height: 50px;"
     * ```
     */    
    export function getBaseStyleOfLeafWidget(prop: BaseWidgetProp, layout: LayoutType) {
        // block인 경우 absolute, 그 외(즉 auto layout인 경우)는 relative. 이렇게 하는 이유는 
        // auto layout(flex-row, flex-col, grid)인 경우 부모에 따라 위치가 결정되어야 하기 때문에 relative로 설정함

        // 참고: static이면 left, top 값이 무시됨
        let position = layout === 'block' ? 'absolute' : 'static';
        let styles = `
            position: ${position};
		`;

		if (prop.horzAlign === 'left') {
			styles += `
				left: ${prop.left};
				width: ${prop.width};
			`;
		}
		else if (prop.horzAlign === 'right') {
			styles += `
            	width: ${prop.width};
            	right: ${prop.right};
			`
		}
		else  if (prop.horzAlign === 'both') {
			styles += `
				left: ${prop.left};
				right: ${prop.right};
			`;
		}
		else if (prop.horzAlign === 'center') {
			styles += `
				left: ${prop.left};
				width: ${prop.width};
			`;
		}
		else {
			styles += `
				left: ${prop.left};
				width: ${prop.width};
			`;			
		}

		styles += `
            top: ${prop.top};
			height: ${prop.height};
		`;
                
        return styles;
    }
}