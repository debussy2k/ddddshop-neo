<script lang="ts">
    import type { Section, SectionPropValue } from "./section.type";
    import { cmdSection } from "$lib/studio/command";
    import WidgetRenderer from "$lib/studio/widgets/common/WidgetRenderer.svelte";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { ResizeHandle } from "$lib/components/ui/resize-handle";
    import { toPixelValue } from "$lib/utils/drag-resize";
	import * as util from "$lib/studio/util";
	import { cn } from "$lib/utils";
	import { canvasManager } from "$lib/studio/canvas-manager.svelte";
	import type { Context } from "$lib/studio/context.svelte";
    import * as du from '../common/doc-util';
    import { getSectionChildrenLayoutStyle } from "./section-style-util";

    let { data, context }: { data: Section; context: Context } = $props();

    let sectionElement = $state<HTMLElement | undefined>(undefined);
    let isHovered = $state(false);
    let currentProp = $derived.by(() => {
        return du.resolveProp<SectionPropValue>(data.prop, context.break);
    });

	export function getElement(): HTMLElement {
		if (!sectionElement) throw new Error('Section element not mounted');
		return sectionElement;
	}

    function handleMoutdown(e?: MouseEvent) {
        if (context.isPanning) {
            return;
        }

        studioDoc.activeId = data.id;
		// studioDoc.activeWidget에 현재 지금의  svelte component 객체를 넣어줌
		// studioDoc.activeWidget = section;
    }

    function handleMouseEnter() {
        isHovered = true;
    }

    function handleMouseLeave() {
        isHovered = false;
    }

	function  keydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
            e.stopPropagation();
			handleMoutdown();
		}
	}

    // 현재 섹션이 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === data.id);

    // Section의 child 위젯들 가져오기
    let childWidgets = $derived(() => {
        return data.children || [];
    });

    // 섹션 컨테이너의 클래스를 계산하는 함수
    function getSectionClasses(isActive: boolean): string {
        const baseClasses = `relative overflow-visible`;

        const activeClasses = 'outline outline-blue-400';
        const inactiveClasses = '';
        
        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    }

	function getInnerClass() {
        // tailwindcss에 정상 build되도록 fullname 표기 필요.
		let mobileClass = 'flex flex-col gap-y-2';        
        let desktopClass = "@3xl:flex @3xl:flex-row @3xl:items-start @3xl:flex-wrap @3xl:gap-x-2"; 
		// let desktopClass = prependSizeVariant('flex flex-row flex-wrap gap-x-2', '@3xl:'); // @3xl : 768px 이상
		return `w-full ${mobileClass} ${desktopClass}`;
	}

	// 편의 함수들
	function updateSectionHeight(newHeight: number) {
        cmdSection.updateProp(data.id, { height: toPixelValue(newHeight) }, context.break);

        // section을 parent로 가지는 컴포넌트의 수치계산을 다시 할 기회를 제공함
        canvasManager.updateNeedUpdate();
	}

	let {childrenLayoutStyle} = $derived.by(() => {	
        // console.log('(A)Frame currentStyle', data.id);
        let childrenLayoutStyle = getSectionChildrenLayoutStyle(currentProp);
		return { childrenLayoutStyle };
	});    

</script>

<div 
    id={`${data.id}-${context.break}`}
    bind:this={sectionElement}
    class={getSectionClasses(isActive)}
    style:height={currentProp.height}
    onmousedown={handleMoutdown}
    role="button"
    tabindex="0"
    onkeydown={keydown}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
>

    {#if canvasManager.mode === 'fixed-canvas'}
        <div class='absolute pointer-events-none top-0 bottom-0 left:[-320px] right:[320px] opacity-0 hover:opacity-100 transition-opacity duration-200' 
            class:opacity-100={isHovered}
            style="width:100%">
                <!-- 섹션 왼쪽 빈 공간 -->
                <div class='absolute top-0 bottom-0 w-[320px] border-y border-blue-400 border-dashed' style="left:-320px">
                </div>
                <!-- 섹션 오른쪽 빈 공간 -->
                <div class='absolute top-0 bottom-0 w-[320px] border-y border-blue-400 border-dashed' style="left:100%">
                </div>
        </div>
    {/if}
    
    <div class="_outer">
        <!-- Child 위젯들 렌더링 -->
        {#if childWidgets().length > 0}
            <div class={cn("es-section-widget-inner w-full")}
                style={childrenLayoutStyle}
                style:height={currentProp.height}
            >
                <WidgetRenderer widgets={childWidgets()} {context} />
            </div>
        {/if}
    </div>

    <!-- 리사이즈 핸들 -->
    <ResizeHandle 
        targetElement={sectionElement}
        direction="vertical"
        detectionDirection="bottom"
        threshold={10}
        minSize={50}
        maxSize={800}
        onStart={(newHeight) => {
            studioDoc.historyManager.setBatchMode();
            updateSectionHeight(newHeight);
        }}
        onResize={(newHeight) => {
            updateSectionHeight(newHeight);
        }}
        onEnd={(newHeight) => {
            updateSectionHeight(newHeight);
            studioDoc.historyManager.commitBatch();
            studioDoc.historyManager.setRecordMode();
        }}
    />
</div>
