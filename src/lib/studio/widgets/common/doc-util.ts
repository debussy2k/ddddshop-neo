import type { BaseWidgetProp, CompositeWidget, DocState, LayoutType, Widget, ContainerProp, NonSectionWidget } from "../../types";
import type { SectionPropValue } from "../section/section.type";
import type { FramePropValue } from "../frame/frame.type";
import type { BreakPoint } from "$lib/studio/breakpoint-man.svelte";
import { getComputedVal } from "$lib/studio/widgets/common/computed-value-util";
import * as util from "$lib/studio/util";

export function resolveProp<T>(propRoot: Record<BreakPoint, T|Partial<T>> | undefined, breakPoint: BreakPoint) : T {
    if (!propRoot) {
        throw new Error(`propRoot is undefined (breakPoint: ${breakPoint})`);
    }

    if (breakPoint === 'desktop') {
        return propRoot['desktop'] as T;
    }
    else {
        return deepMerge(propRoot['desktop'] as object, propRoot[breakPoint] as object) as T;
    }
}

function deepMerge<A extends object, B extends object>(a: A, b: B): A & B {
    const out: any = Array.isArray(a) ? [...(a as any)] : { ...(a as any) };
    for (const [k, v] of Object.entries(b as any)) {
        if (v && typeof v === "object" && !Array.isArray(v)) out[k] = deepMerge(out[k] ?? {}, v);
        else out[k] = v;
    }
    return out;
}


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

export function getElementWidth(element: HTMLElement): number {
    const w = window.getComputedStyle(element).width;
    return util.getNumberPart(w);
}
export function getElementHeight(element: HTMLElement): number {
    const h = window.getComputedStyle(element).height;
    return util.getNumberPart(h);
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

    styleObj.backgroundColor = prop.backgroundColor;

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
    else if (prop.sizeConstraints?.hugContentsHeight) {
        styleObj.height = 'fit-content';
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

export function isLayoutFlexBox(layout: LayoutType | undefined) {
    if (!layout) return false;
    return layout === 'flex-row' || layout === 'flex-col';
}

export function isFlexboxRow(prop: BaseWidgetProp | FramePropValue | SectionPropValue): prop is FramePropValue | SectionPropValue {
	return isFlexbox(prop) && prop.layout === 'flex-row';
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
 * Widget의 computed 값을 사용하여 수평 관련 prop을 업데이트합니다.
 * horzAlign을 left로 변경하고 computed 값으로 수평 위치/크기를 설정합니다.
 * 
 * @param child 업데이트할 위젯
 * @param breakPoint 현재 breakpoint
 */
function normalizeToLeftPosition(
    child: NonSectionWidget,
    breakPoint: BreakPoint
): void {
    const computed = getComputedVal(child, breakPoint);    
    const prop = resolveProp<BaseWidgetProp>(child.prop, breakPoint);

    // horzAlign을 left로 변경하고 수평 computed 값 설정    
    if (prop.horzAlign !== 'left') {
        // horzAlign값이 "left"가 아닌 경우 모든 값을 override함.
        child.prop[breakPoint].horzAlign = 'left';
        child.prop[breakPoint].left = `${computed.left}px`;
        child.prop[breakPoint].width = `${computed.width}px`;
        child.prop[breakPoint].right = `${computed.right}px`;
        child.prop[breakPoint].centerOffsetX = 0;    
    }
    else {
        // horzAlign값이 "left"인 경우에만 delta값만 override함.
        if (prop.left !== `${computed.left}px`) {
            child.prop[breakPoint].left = `${computed.left}px`;
        }
        if (prop.width !== `${computed.width}px`) {
            child.prop[breakPoint].width = `${computed.width}px`;
        }
        if (prop.right !== `${computed.right}px`) {
            child.prop[breakPoint].right = `${computed.right}px`;
        }
        if (prop.centerOffsetX !== 0) {
            child.prop[breakPoint].centerOffsetX = 0;
        }
    }


}

/**
 * Widget의 computed 값을 사용하여 수직 관련 prop을 업데이트합니다.
 * vertAlign을 top으로 변경하고 computed 값으로 수직 위치/크기를 설정합니다.
 * 
 * @param child 업데이트할 위젯
 * @param breakPoint 현재 breakpoint
 */
function normalizeToTopPosition(
    child: NonSectionWidget,
    breakPoint: BreakPoint
): void {
    const computed = getComputedVal(child, breakPoint);    
    const prop = resolveProp<BaseWidgetProp>(child.prop, breakPoint);

    // vertAlign을 top으로 변경하고 수직 computed 값 설정    
    if (prop.vertAlign !== 'top') {
        // vertAlign값이 "top"이 아닌 경우 모든 값을 override함.
        child.prop[breakPoint].vertAlign = 'top';
        child.prop[breakPoint].top = `${computed.top}px`;
        child.prop[breakPoint].height = `${computed.height}px`;
        child.prop[breakPoint].bottom = `${computed.bottom}px`;
        child.prop[breakPoint].centerOffsetY = 0;    
    }
    else {
        // vertAlign값이 "top"인 경우에만 delta값만 override함.
        if (prop.top !== `${computed.top}px`) {
            child.prop[breakPoint].top = `${computed.top}px`;
        }
        if (prop.height !== `${computed.height}px`) {
            child.prop[breakPoint].height = `${computed.height}px`;
        }
        if (prop.bottom !== `${computed.bottom}px`) {
            child.prop[breakPoint].bottom = `${computed.bottom}px`;
        }
        if (prop.centerOffsetY !== 0) {
            child.prop[breakPoint].centerOffsetY = 0;
        }
    }


}

/**
 * Widget의 computed 값을 사용하여 prop을 업데이트합니다.
 * align을 left, top으로 변경하고 computed 값으로 위치/크기를 설정합니다.
 * 
 * @param child 업데이트할 위젯
 * @param breakPoint 현재 breakpoint
 */
function normalizeToLeftTopPosition(
    child: NonSectionWidget,
    breakPoint: BreakPoint
): void {
    normalizeToLeftPosition(child, breakPoint);
    normalizeToTopPosition(child, breakPoint);
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
            const currentProp = resolveProp<BaseWidgetProp>(child.prop, breakPoint);
            if (currentProp.sizeConstraints === undefined) {
                child.prop[breakPoint].sizeConstraints = getDefaultSizeConstraints();
            }

            // computed 값으로 위치/크기 설정
            normalizeToLeftTopPosition(child, breakPoint);
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
			normalizeToLeftTopPosition(child, breakPoint);
        });
    }
}
/*
호출경로:

1. LayoutSelector 컴포넌트 (사용자가 레이아웃 선택)
   ↓ onChange 콜백
   
2. layout-section.svelte → onChangeLayout() (라인 74-103)
   - 새로운 layout 타입으로 속성 객체 생성
   - updateProp(obj) 호출 (라인 102)
   ↓
   
3. common-property.svelte → updateProp() (라인 44-46)
   - cmd.updateProp(data.id, newProp, bpm.current) 호출
   ↓
   
4. command.ts → cmdFrame (FrameActions 인스턴스)
   ↓
   
5. frame-actions.ts → updateProp() (라인 153-175)
   - layout 변경 감지: if (updates.layout && updates.layout !== currentProp.layout)
   - 라인 162-166에서 호출:
     du.updateChildrenSizeConstraintsOnLayoutChange(
         widget.children, 
         updates.layout, 
         breakPoint
     )	
*/


/*
	자식에 적용된 “fill container”가 있으면
    - fill-container 해제
    - fill 상태의 width를 고정폭으로 지정
*/
export function clearChildrenFullWidth(children: NonSectionWidget[], breakPoint: BreakPoint): void {
	children.forEach(child => {
		if (child.prop[breakPoint].sizeConstraints?.fullWidth) {
			child.prop[breakPoint].sizeConstraints.fullWidth = false;
			normalizeToLeftPosition(child, breakPoint);
		}
	})
}

/*
	자식에 적용된 “fill container”가 있으면
    - fill-container 해제
    - fill 상태의 height를 고정높이로 지정
*/
export function clearChildrenFullHeight(children: NonSectionWidget[], breakPoint: BreakPoint): void {
	children.forEach(child => {
		if (child.prop[breakPoint].sizeConstraints?.fullHeight) {
			child.prop[breakPoint].sizeConstraints.fullHeight = false;
			normalizeToTopPosition(child, breakPoint);
		}
	})
}


/*
	hugContentsWidth가 true가 되는 시점에만 사용되는 함수
	data는 CompositeWidget이지만 실제 Section인 경우는 없음
*/
export function calcFrameWidth(data: CompositeWidget, breakPoint: BreakPoint): number {
	const prop = data.prop[breakPoint];
	
	// children이 없으면 padding만 반환
	if (!data.children || data.children.length === 0) {
		return prop.paddingLeft + prop.paddingRight;
	}
	
	let totalWidth = 0;
	
	// layout에 따라 다른 계산 방식 적용
	if (prop.layout === 'flex-row') {
		// flex-row: children의 width를 모두 합산하고 gap 추가
		data.children.forEach((child, index) => {
			const computed = getComputedVal(child, breakPoint);
			totalWidth += computed.width;
			
			// 마지막 child가 아니면 gap 추가
			if (index < data.children.length - 1) {
				totalWidth += prop.gap;
			}
		});
	} else if (prop.layout === 'flex-col' || prop.layout === 'block' || prop.layout === 'grid') {
		// flex-col, block, grid: children 중 가장 큰 width 사용
		let maxWidth = 0;
		data.children.forEach((child) => {
			const computed = getComputedVal(child, breakPoint);
			maxWidth = Math.max(maxWidth, computed.width);
		});
		totalWidth = maxWidth;
	}
	
	// padding 추가
	totalWidth += prop.paddingLeft + prop.paddingRight;
	
	return Math.round(totalWidth);
}

export function calcFrameHeight(data: CompositeWidget, breakPoint: BreakPoint): number {
	const prop = data.prop[breakPoint];
	
	// children이 없으면 padding만 반환
	if (!data.children || data.children.length === 0) {
		return prop.paddingTop + prop.paddingBottom;
	}
	
	let totalHeight = 0;
	
	// layout에 따라 다른 계산 방식 적용
	if (prop.layout === 'flex-col') {
		// flex-col: children의 height를 모두 합산하고 gap 추가
		data.children.forEach((child, index) => {
			const computed = getComputedVal(child, breakPoint);
			totalHeight += computed.height;
			
			// 마지막 child가 아니면 gap 추가
			if (index < data.children.length - 1) {
				totalHeight += prop.gap;
			}
		});
	} else if (prop.layout === 'flex-row' || prop.layout === 'block' || prop.layout === 'grid') {
		// flex-row, block, grid: children 중 가장 큰 height 사용
		let maxHeight = 0;
		data.children.forEach((child) => {
			const computed = getComputedVal(child, breakPoint);
			maxHeight = Math.max(maxHeight, computed.height);
		});
		totalHeight = maxHeight;
	}
	
	// padding 추가
	totalHeight += prop.paddingTop + prop.paddingBottom;
	
	return Math.round(totalHeight);
}