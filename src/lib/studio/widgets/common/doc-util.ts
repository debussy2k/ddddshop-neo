import type { BaseWidgetProp, CompositeWidget, DocState, LayoutType, Widget, ContainerProp, NonSectionWidget } from "../../types";
import type { SectionPropValue } from "../section/section.type";
import type { FramePropValue } from "../frame/frame.type";
import type { BreakPoint } from "$lib/studio/breakpoint-man.svelte";

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

export function hasChild(id: string, draft: DocState): boolean {
    const widget = findById(id, draft);
    if (!widget) return false;
    return 'children' in widget;
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

    // 참고: layout이 flex-row, flex-col이면 항목의 display를 static으로 설정함. 이때 left, top 값이 무시됨
    const position = layout === 'block' ? 'absolute' : 'static';
    let styles = `
        position: ${position};
    `;

    /*
        flex-row, flex-col인 경우 컴포넌트가 줄어들지 않도록 설정
        항목들 flexbox를 넘어가면 자동으로 줄어들어서 표시되는데, 이때 컴포넌트가 줄어들지 않도록 설정
    */
    if (layout === 'flex-row' || layout === 'flex-col') {
        styles += `flex-shrink: 0;`;
    }

    // 수평 정렬 스타일 추가
    styles += getHorizontalStyles(prop);
    styles += getVerticalStyles(prop);
            
    return styles;
}

function getHorizontalStyles(prop: BaseWidgetProp): string {
    if (prop.horzAlign === 'left') {
        return `
            left: ${prop.left};
            width: ${prop.width};
        `;
    }
    else if (prop.horzAlign === 'right') {
        return `
            width: ${prop.width};
            right: ${prop.right};
        `;
    }
    else if (prop.horzAlign === 'both') {
        return `
            left: ${prop.left};
            right: ${prop.right};
        `;
    }
    else if (prop.horzAlign === 'center') {
        return `
            left: ${prop.left};
            width: ${prop.width};
        `;
    }
    else if (prop.horzAlign === 'scale') {
        return `
            left: ${prop.left};
            width: ${prop.width};
            right: ${prop.right};
        `;
    }
    else {
        return `
            left: ${prop.left};
            width: ${prop.width};
        `;
    }
}


function getVerticalStyles(prop: BaseWidgetProp): string {
    if (prop.vertAlign === 'top') {
        return `
            top: ${prop.top};
            height: ${prop.height};
        `;
    }
    else if (prop.vertAlign === 'bottom') {
        return `
            height: ${prop.height};
            bottom: ${prop.bottom};
        `;
    }
    else if (prop.vertAlign === 'both') {
        return `
            top: ${prop.top};
            bottom: ${prop.bottom};
        `;
    }
    else if (prop.vertAlign === 'center') {
        return `
            top: ${prop.top};
            height: ${prop.height};
        `;
    }
    else if (prop.vertAlign === 'scale') {
        return `
            top: ${prop.top};
            height: ${prop.height};
            bottom: ${prop.bottom};
        `;
    }
    else {
        return `
            top: ${prop.top};
            height: ${prop.height};
        `;
    }
}

export function isContainer(data: Widget | undefined) {
    return data && (data.type === 'frame' || data.type === 'section');
}

// 타입 가드 함수들
export function isContainerProps(prop: BaseWidgetProp | FramePropValue | SectionPropValue): prop is FramePropValue | SectionPropValue {
    return 'layout' in prop;
}	

export function isFlexbox(prop: BaseWidgetProp | FramePropValue | SectionPropValue): prop is FramePropValue | SectionPropValue {
    return isContainerProps(prop) && (prop.layout === 'flex-row' || prop.layout === 'flex-col');
}	

export function isLayoutFlexBox(layout: LayoutType) {
    return layout === 'flex-row' || layout === 'flex-col';
}

export function getDefaultSizeConstraints() {
    return {
        hasMinWidth: false,
        minWidth: 0,
        hasMaxWidth: false,
        maxWidth: 0,
        hasMinHeight: false,
        minHeight: 0,
        hasMaxHeight: false,
        maxHeight: 0
    }
}

/**
 * 부모의 layout이 flexbox인 경우 defaultProp의 각 breakpoint에 sizeConstraints를 추가합니다.
 * 
 * @param defaultProp 기본 속성 객체 (mobile, tablet, desktop 포함)
 * @param parentProp 부모의 속성 객체 (각 breakpoint의 layout 확인용)
 */
export function addDefaultSizeConstraints(
    defaultProp: NonSectionWidget['prop'],
    parentProp: ContainerProp
): void {
    // 부모의 layout이 flexbox인 경우 sizeConstraints를 부여함.
    if (isFlexbox(parentProp['mobile'])) {
        defaultProp['mobile'].sizeConstraints = getDefaultSizeConstraints();
    }
    if (isFlexbox(parentProp['tablet'])) {
        defaultProp['tablet'].sizeConstraints = getDefaultSizeConstraints()
    }
    if (isFlexbox(parentProp['desktop'])) {
        defaultProp['desktop'].sizeConstraints = getDefaultSizeConstraints()
    }
}

/**
 * layout이 변경될 때 children의 sizeConstraints를 재설정합니다.
 * flexbox layout으로 변경되면 children의 sizeConstraints를 기본값으로 설정하고,
 * 그 외의 layout으로 변경되면 children의 sizeConstraints를 제거합니다.
 * 
 * @param children 자식 위젯 배열
 * @param newLayout 변경될 새로운 layout
 * @param breakPoint 현재 breakpoint
 */
export function updateChildrenSizeConstraintsOnLayoutChange(
    children: Widget[],
    newLayout: LayoutType,
    breakPoint: BreakPoint
): void {
    if (isLayoutFlexBox(newLayout)) {
        // children의 sizeConstraints를 기본값으로 설정
        children.forEach(child => {
            // 아래 .sizeConstraints 부분 타입 오류는 SimpleImage, Showcase 등에서 발생하는 것이므로 무시함.
            child.prop[breakPoint].sizeConstraints = getDefaultSizeConstraints();
        });
    } else {
        // children의 sizeConstraints를 제거함
        children.forEach(child => {
            // 아래 .sizeConstraints 부분 타입 오류는 SimpleImage, Showcase 등에서 발생하는 것이므로 무시함.
            delete child.prop[breakPoint].sizeConstraints;
        });
    }
}