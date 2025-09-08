<script lang="ts">
    import type { Section } from "./section-actions";
    import { SandboxWidget } from "$lib/studio/widgets/sandbox";
    import { cmdSection } from "$lib/studio/command";
    import { SimpleImageWidget } from "$lib/studio/widgets/simple-image";
    import type { Sandbox } from "$lib/studio/widgets/sandbox";
    import type { SimpleImage } from "$lib/studio/widgets/simple-image";
    import { studioDoc } from "$lib/studio/studio-doc.svelte";
    import { ResizeHandle } from "$lib/components/ui/resize-handle";
    import { toPixelValue } from "$lib/utils/drag-resize";

    let { section }: { section: Section } = $props();

    let sectionElement = $state<HTMLElement>();

    function handleClick() {
        studioDoc.activeId = section.id;
		// studioDoc.activeWidget에 현재 지금의  svelte component 객체를 넣어줌
		// studioDoc.activeWidget = section;

    }

	function  keydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}

    // 현재 섹션이 활성화되어 있는지 확인
    let isActive = $derived(studioDoc.activeId === section.id);

    // Section의 child 위젯들 가져오기
    let childWidgets = $derived(() => {
        return section.children || [];
    });

    // 섹션 컨테이너의 클래스를 계산하는 함수
    function getSectionClasses(isActive: boolean): string {
        const baseClasses = `relative border-b border-blue-500 border-dotted cursor-pointer overflow-visible`;

        const activeClasses = 'bg-blue-200 hover:bg-blue-300 border-solid';
        const inactiveClasses = 'bg-red-100 hover:bg-red-200';
        
        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    }

	function getInnerClass() {
        // tailwindcss에 정상 build되도록 fullname 표기 필요.
		let mobileClass = 'flex flex-col gap-y-2';        
        let desktopClass = "@3xl:flex @3xl:flex-row @3xl:flex-wrap @3xl:gap-x-2"; 
		// let desktopClass = prependSizeVariant('flex flex-row flex-wrap gap-x-2', '@3xl:'); // @3xl : 768px 이상
		return `w-full ${mobileClass} ${desktopClass}`;
	}

	// function prependSizeVariant(classString: string, sizeVariant: string) {
	// 	return classString.split(/\s+/).map(cls => `${sizeVariant}${cls}`).join(' ');
	// }

	export function getContentHeight() {
		if (!sectionElement) return 0;
		
		// 패딩 및 보더 고려
		const computedStyle = getComputedStyle(sectionElement);
		const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
		const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
		const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
		const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;
		
		// 내부 콘텐츠 컨테이너 찾기
		const contentContainer = sectionElement.querySelector('._outer');
		if (!contentContainer) {
			return sectionElement.scrollHeight;
		}
		
		// 하위 위젯들의 실제 높이 계산
		const childWidgetContainer = contentContainer.querySelector('._inner');
		if (!childWidgetContainer) {
			return paddingTop + paddingBottom + borderTop + borderBottom + 16; // 기본 패딩
		}
		
		// 하위 위젯들의 총 높이 계산 (flex-wrap을 고려한 실제 높이)
		const childrenHeight = childWidgetContainer.scrollHeight;
		const containerPadding = 8; // .p-2 클래스의 패딩 (0.5rem = 8px)
		
		return paddingTop + paddingBottom + borderTop + borderBottom + (containerPadding * 2) + childrenHeight;
	} 

</script>

<div 
    bind:this={sectionElement}
    class={getSectionClasses(isActive)}
    style:height={section.height}
    onclick={handleClick}
    role="button"
    tabindex="0"
    onkeydown={keydown}
>
    <div class="_outer p-2">
        <!-- Child 위젯들 렌더링 -->
        {#if childWidgets().length > 0}
            <div class="_inner {getInnerClass()}">
                {#each childWidgets() as widgetData (widgetData.id)}
                    {#if (widgetData as any).type === 'sandbox'}
                        <SandboxWidget data={widgetData as Sandbox} />
                    {:else if (widgetData as any).type === 'simple-image'}
                        {#key widgetData.id + (widgetData as SimpleImage).url}
                            <SimpleImageWidget simpleImage={widgetData as SimpleImage} />
                        {/key}
                    {/if}
                {/each}
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
            cmdSection.updateSection(section.id, { height: toPixelValue(newHeight) });
        }}
        onResize={(newHeight) => {
            cmdSection.updateSection(section.id, { height: toPixelValue(newHeight) });
        }}
        onEnd={(newHeight) => {
            cmdSection.updateSection(section.id, { height: toPixelValue(newHeight) });
            studioDoc.historyManager.commitBatch();
            studioDoc.historyManager.setRecordMode();
        }}
    />
</div>
