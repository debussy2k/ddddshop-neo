import type { DocState, Widget } from "../../types";

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
}