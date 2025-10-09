import type { BaseWidgetProp, CompositeWidget, DocState, LayoutType, Widget, ContainerProp, NonSectionWidget } from "../../types";
import type { SectionPropValue } from "../section/section.type";
import type { FramePropValue } from "../frame/frame.type";
import type { BreakPoint } from "$lib/studio/breakpoint-man.svelte";
import { getComputedVal } from "$lib/studio/widgets/common/computed-value-util";

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

export function isParentContainer(id: string, draft: DocState): boolean {
	const parent = getParentByChildId(id, draft);
	if (!parent) return false;
	return isContainer(parent);
}


// CSS 객체를 문자열로 변환하는 헬퍼 함수
function styleObjectToString(styleObj: Record<string, string | number>): string {
    return Object.entries(styleObj)
        .map(([key, value]) => {
            // camelCase를 kebab-case로 변환
            const kebabKey = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
            return `${kebabKey}: ${value};`;
        })
        .join('\n            ');
}


/**
 * 리프 위젯(자식이 없는 위젯)의 기본 스타일 문자열을 생성합니다.
 * 
 * 부모의 레이아웃 타입에 따라 position 속성을 결정하고, 
 * position이 absolute인 경우에만 left, top 값을 포함합니다.
 * 
 * @param prop 위젯의 위치/크기 속성 객체 (left, top, width, height)
 * @param parentLayout 부모 위젯의 레이아웃 타입
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
export function getBaseStyleOfLeafWidget(prop: BaseWidgetProp, parentLayout: LayoutType) {
    // block인 경우 absolute, 그 외(즉 auto layout인 경우)는 relative. 이렇게 하는 이유는 
    // auto layout(flex-row, flex-col, grid)인 경우 부모에 따라 위치가 결정되어야 하기 때문에 relative로 설정함
    const styleObj: Record<string, string | number> = {};
    
    // 수평 정렬 스타일 추가
    Object.assign(styleObj, getHorizontalStyles(prop, parentLayout));
    Object.assign(styleObj, getVerticalStyles(prop, parentLayout));


    if (parentLayout === 'block') {
        styleObj.position = 'absolute';
    }
    if (isLayoutFlexBox(parentLayout)) {
        /*
            flex-row, flex-col인 경우 컴포넌트가 줄어들지 않도록 설정
            항목들 flexbox를 넘어가면 자동으로 줄어들어서 표시되는데, 이때 컴포넌트가 줄어들지 않도록 설정
        */
        styleObj.position = 'relative';
        styleObj.left = '0px';
        styleObj.top = '0px';
        styleObj.flexShrink = 0;
    }
    else if (parentLayout === 'grid') {
        styleObj.position = 'relative';
        styleObj.left = '0px';
        styleObj.top = '0px';
    }

    // 객체를 CSS 문자열로 변환하여 리턴
    return styleObjectToString(styleObj);
}

function getHorizontalStyles(prop: BaseWidgetProp, parentLayout: LayoutType): Record<string, string | number> {
    const styleObj: Record<string, string | number> = {};

    if (prop.horzAlign === 'left') {
        styleObj.left = prop.left;
        styleObj.width = prop.width;
    }
    else if (prop.horzAlign === 'right') {
        styleObj.width = prop.width;
        styleObj.right = prop.right;
    }
    else if (prop.horzAlign === 'both') {
        styleObj.left = prop.left;
        styleObj.right = prop.right;
    }
    else if (prop.horzAlign === 'center') {
        styleObj.left = prop.left;
        styleObj.width = prop.width;
    }
    else if (prop.horzAlign === 'scale') {
        styleObj.left = prop.left;
        styleObj.width = prop.width;
        styleObj.right = prop.right;
    }
    else {
        styleObj.left = prop.left;
        styleObj.width = prop.width;
    }

    // full-width 설정
    if (prop.sizeConstraints?.fullWidth) {
        if (parentLayout === 'flex-row') {
            styleObj.flexGrow = 1;
            styleObj.flexBasis = 0;
        }
        else if (parentLayout === 'flex-col') {
            // width가 교차축에 대한 것일 때
            styleObj.width = '100%';
        }
    }
	else if (prop.sizeConstraints?.hugContentsWidth) {
		styleObj.width = 'fit-content';
	}

    // min-width, max-width는 fullWidth 설정뒤에 할 것 (순서에 영향을 받음)
    if (prop.sizeConstraints?.hasMinWidth) {
        styleObj.minWidth = `${prop.sizeConstraints.minWidth}px`;
    }
    if (prop.sizeConstraints?.hasMaxWidth) {
        styleObj.maxWidth = `${prop.sizeConstraints.maxWidth}px`;
    }
    
    return styleObj;
}


function getVerticalStyles(prop: BaseWidgetProp, parentLayout: LayoutType): Record<string, string | number> {
    const styleObj: Record<string, string | number> = {};
    
    if (prop.vertAlign === 'top') {
        styleObj.top = prop.top;
        styleObj.height = prop.height;
    }
    else if (prop.vertAlign === 'bottom') {
        styleObj.height = prop.height;
        styleObj.bottom = prop.bottom;
    }
    else if (prop.vertAlign === 'both') {
        styleObj.top = prop.top;
        styleObj.bottom = prop.bottom;
    }
    else if (prop.vertAlign === 'center') {
        styleObj.top = prop.top;
        styleObj.height = prop.height;
    }
    else if (prop.vertAlign === 'scale') {
        styleObj.top = prop.top;
        styleObj.height = prop.height;
        styleObj.bottom = prop.bottom;
    }
    else {
        styleObj.top = prop.top;
        styleObj.height = prop.height;
    }

    // full-height 설정
    if (prop.sizeConstraints?.fullHeight) {
        if (parentLayout === 'flex-col') {
            styleObj.flexGrow = 1;
            styleObj.flexBasis = 0;
        }
        else if (parentLayout === 'flex-row') {
            // height가 교차축에 대한 것일 때
            styleObj.height = '100%';
        }
    }

    // min-height, max-height는 fullHeight 설정뒤에 할 것 (순서에 영향을 받음)
    if (prop.sizeConstraints?.hasMinHeight) {
        styleObj.minHeight = `${prop.sizeConstraints.minHeight}px`;
    }
    if (prop.sizeConstraints?.hasMaxHeight) {
        styleObj.maxHeight = `${prop.sizeConstraints.maxHeight}px`;
    }

    return styleObj;
}

export function isContainer(data: Widget | undefined) : boolean {
    return !!data && (data.type === 'frame' || data.type === 'section');
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
		hugContentsWidth: false,
		hugContentsHeight: false,
        fullWidth: false,
        fullHeight: false,
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
 * Widget의 computed 값을 사용하여 prop을 업데이트합니다.
 * align을 left, top으로 변경하고 computed 값으로 위치/크기를 설정합니다.
 * 
 * @param child 업데이트할 위젯
 * @param breakPoint 현재 breakpoint
 */
function applyComputedValuesToChild(
    child: NonSectionWidget,
    breakPoint: BreakPoint
): void {
    const computed = getComputedVal(child);
    
    // align을 left, top으로 변경하고 computed 값 설정
    child.prop[breakPoint].horzAlign = 'left';
    child.prop[breakPoint].vertAlign = 'top';
    child.prop[breakPoint].left = `${computed.left}px`;
    child.prop[breakPoint].top = `${computed.top}px`;
    child.prop[breakPoint].width = `${computed.width}px`;
    child.prop[breakPoint].height = `${computed.height}px`;
    child.prop[breakPoint].right = `${computed.right}px`;
    child.prop[breakPoint].bottom = `${computed.bottom}px`;
    child.prop[breakPoint].centerOffsetX = 0;
    child.prop[breakPoint].centerOffsetY = 0;
}

/**
 * layout이 변경될 때 children의 sizeConstraints를 재설정합니다.
 * 
 * - flexbox layout으로 변경되면:
 *   1. children 중 sizeConstraints가 없는 경우에만 기본값으로 설정합니다.
 *   2. 모든 children의 computed 값으로 위치/크기를 적용합니다.
 * 
 * - 그 외의 layout으로 변경되면:
 *   1. children의 sizeConstraints를 제거합니다.
 *      (단, child가 frame이고 해당 frame의 layout이 flexbox인 경우는 제외)
 *   2. 모든 children의 computed 값으로 위치/크기를 적용합니다.
 * 
 * @param children 자식 위젯 배열
 * @param newLayout 변경될 새로운 layout
 * @param breakPoint 현재 breakpoint
 */
export function updateChildrenSizeConstraintsOnLayoutChange(
    children: NonSectionWidget[],
    newLayout: LayoutType,
    breakPoint: BreakPoint,
): void {
    if (isLayoutFlexBox(newLayout)) {
        // children의 sizeConstraints를 기본값으로 설정
        children.forEach(child => {
            if (child.prop[breakPoint].sizeConstraints === undefined) {
                child.prop[breakPoint].sizeConstraints = getDefaultSizeConstraints();
            }

            // computed 값으로 위치/크기 설정
            applyComputedValuesToChild(child, breakPoint);
        });
    } else {
        // children의 sizeConstraints를 제거함
        children.forEach(child => {
            if (child.type === 'frame' && isLayoutFlexBox(child.prop[breakPoint].layout)) {
                //
            }
            else {
                // console.log("delete sizeConstraints", child.id);
                delete child.prop[breakPoint].sizeConstraints;
            }
			
			// computed 값으로 위치/크기 설정
			applyComputedValuesToChild(child, breakPoint);
        });
    }
}