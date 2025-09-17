<script lang="ts">
	import { studioDoc } from "./studio-doc.svelte";
    import type { Section, Widget } from "./types";
    import { cmdSection, cmdSandbox, cmdSimpleImage, cmdFrame } from "./command";
    import { EditableText } from "$lib/components/studio-ui/editable-text";
    let doc = $derived(studioDoc.document);

	function handleSectionClick(id:string) {
		studioDoc.activeId = id;
	}

    function handleWidgetClick(id: string) {
        studioDoc.activeId = id;
    }

    function deleteSection(section: Section) {
        cmdSection.removeSection(section.id);
    }

    function deleteWidget(widget: Widget) {
        // Widget 타입에 따라 적절한 삭제 함수 호출
        switch ((widget as any).type) {
			case 'frame':
				cmdFrame.removeFrame(widget.id);
				break;
            case 'sandbox':
                cmdSandbox.removeSandbox(widget.id);
                break;
            case 'simple-image':
                cmdSimpleImage.removeSimpleImage(widget.id);
                break;
            default:
                console.warn(`Unknown widget type: ${(widget as any).type}. Cannot delete.`);
        }
    }

    async function updateSectionName(section: Section, newName: string) {
        cmdSection.updateSection(section.id, { name: newName });
    }

    async function updateWidgetName(widget: Widget, newName: string) {
        // Widget 타입에 따라 적절한 업데이트 함수 호출
        switch ((widget as any).type) {
			case 'frame':
				cmdFrame.updateFrame(widget.id, { name: newName });
				break;
            case 'sandbox':
                cmdSandbox.updateSandbox(widget.id, { name: newName });
                break;
            case 'simple-image':
                cmdSimpleImage.updateSimpleImage(widget.id, { name: newName });
                break;
            default:
                console.warn(`Unknown widget type: ${(widget as any).type}. Cannot update name.`);
        }
    }

    // 섹션의 펼침/접힘 상태를 관리하는 Map
    let expandedSections = $state(new Map<string, boolean>());
    
    // 위젯의 펼침/접힘 상태를 관리하는 Map (children을 가진 위젯용)
    let expandedWidgets = $state(new Map<string, boolean>());

    function toggleSection(sectionId: string, e: Event) {
        e.stopPropagation();
        const currentState = expandedSections.get(sectionId) ?? true;
        expandedSections.set(sectionId, !currentState);
        expandedSections = new Map(expandedSections); // 반응성을 위해 새 Map 생성
    }

    function isSectionExpanded(sectionId: string): boolean {
        return expandedSections.get(sectionId) ?? true;
    }

    function toggleWidget(widgetId: string, e: Event) {
        e.stopPropagation();
        const currentState = expandedWidgets.get(widgetId) ?? true;
        expandedWidgets.set(widgetId, !currentState);
        expandedWidgets = new Map(expandedWidgets); // 반응성을 위해 새 Map 생성
    }

    function isWidgetExpanded(widgetId: string): boolean {
        return expandedWidgets.get(widgetId) ?? true;
    }

    function hasChildren(widget: Widget): boolean {
        return 'children' in widget && Array.isArray((widget as any).children) && (widget as any).children.length > 0;
    }
</script>

<div class='border w-full flex-1 min-h-0 overflow-y-auto'>
	<!-- <div class='text-xs'>{studioDoc.activeId}</div> -->
    {#each doc.sections as section}
        <!-- Section 메인 항목 -->
        <div class="select-none">
            <!-- Section 헤더 -->
            <!-- svelte-ignore  a11y_click_events_have_key_events a11y_no_static_element_interactions -->
            <div class="group relative flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 cursor-pointer text-xs"
                class:bg-yellow-200={section.id === studioDoc.activeId}
                onclick={() => handleSectionClick(section.id)}
                aria-label='section click'
                role='button'
                tabindex='0'
            >
                <div class="flex items-center gap-1.5 flex-1 min-w-0">
                    <!-- 펼침/접힘 아이콘 -->
                    {#if section.children && section.children.length > 0}
                        <button
                            class="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-transform duration-200"
                            class:rotate-90={isSectionExpanded(section.id)}
                            onclick={(e) => toggleSection(section.id, e)}
                            aria-label={isSectionExpanded(section.id) ? '접기' : '펼치기'}
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    {:else}
                        <div class="w-4 h-4"></div>
                    {/if}

                    <!-- Figma 스타일 Section 아이콘 -->
                    <div class="w-4 h-4 flex items-center justify-center">
                        <div class="w-3 h-3 bg-purple-500 rounded-sm flex items-center justify-center">
                            <div class="w-1.5 h-1.5 bg-white rounded-xs"></div>
                        </div>
                    </div>
                    
                    <EditableText 
                        value={section.name} 
                        onSave={(newName) => updateSectionName(section, newName)}
                        class="flex-1 min-w-0"
                    />
                </div>
                
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <!-- 눈 아이콘 -->
                    <button class="w-4 h-4 text-gray-500 hover:text-gray-700 transition-colors" title="보기 토글" aria-label='Open section'>
                        <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 2C4.5 2 1.7 4.4 1 8c.7 3.6 3.5 6 7 6s6.3-2.4 7-6c-.7-3.6-3.5-6-7-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                    </button>
                    <!-- 삭제 아이콘 -->
                    <button 
                        class="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors mr-1"
                        onclick={() => deleteSection(section)}
                        title="삭제"
                        aria-label='Delete section'
                    >
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4L4 12M4 4l8 8"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Children 목록 (Figma layers 스타일) -->
            {#if section.children && section.children.length > 0 && isSectionExpanded(section.id)}
                <div class="ml-4 border-l border-gray-200">
                    {#each section.children as widget (widget.id)}
                        <div class="pl-1 pb-1">
                            <!-- svelte-ignore  a11y_click_events_have_key_events a11y_no_static_element_interactions -->
                            <div 
                                class="group flex items-center gap-1 px-2 py-1.5 cursor-pointer rounded hover:bg-gray-100 text-xs transition-colors"
                                class:bg-blue-100={studioDoc.activeId === widget.id}
                                onclick={() => handleWidgetClick(widget.id)}
                                role="button"
                                tabindex="0"
                                aria-label='widget click'
                            >
                                <!-- 펼침/접힘 아이콘 (children이 있는 위젯만) -->
                                {#if hasChildren(widget)}
                                    <button
                                        class="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-transform duration-200"
                                        class:rotate-90={isWidgetExpanded(widget.id)}
                                        onclick={(e) => toggleWidget(widget.id, e)}
                                        aria-label={isWidgetExpanded(widget.id) ? '접기' : '펼치기'}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                            <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                {:else}
                                    <div class="w-4 h-4"></div>
                                {/if}

                                <!-- Widget 아이콘 (타입별로 다른 색상) -->
                                <div class="w-4 h-4 flex items-center justify-center">
                                    {#if (widget as any).type === 'frame'}
                                        <div class="w-3 h-3 bg-red-500 rounded-sm flex items-center justify-center">
                                            <div class="w-1.5 h-1.5 bg-white rounded-xs border border-red-300"></div>
                                        </div>
                                    {:else if (widget as any).type === 'sandbox'}
                                        <div class="w-3 h-3 bg-green-500 rounded-sm flex items-center justify-center">
                                            <div class="w-1 h-1 bg-white rounded-full"></div>
                                        </div>
                                    {:else if (widget as any).type === 'simple-image'}
                                        <div class="w-3 h-3 bg-indigo-500 rounded-sm flex items-center justify-center">
                                            <div class="w-1.5 h-1 bg-white rounded-xs"></div>
                                        </div>
                                    {:else if (widget as any).type === 'button'}
                                        <div class="w-3 h-3 bg-blue-500 rounded-sm flex items-center justify-center">
                                            <div class="w-1.5 h-0.5 bg-white rounded-xs"></div>
                                        </div>
                                    {:else if (widget as any).type === 'text'}
                                        <div class="w-3 h-3 bg-orange-500 rounded-sm flex items-center justify-center">
                                            <div class="w-0.5 h-1.5 bg-white rounded-xs"></div>
                                        </div>
                                    {:else}
                                        <!-- 기본 아이콘 -->
                                        <div class="w-3 h-3 bg-gray-500 rounded-sm flex items-center justify-center">
                                            <div class="w-1 h-1 bg-white rounded-full"></div>
                                        </div>
                                    {/if}
                                </div>

                                <!-- Widget 이름 -->
                                <EditableText 
                                    value={widget.name} 
                                    onSave={(newName) => updateWidgetName(widget, newName)}
                                    class="flex-1 min-w-0"
                                />

                                <!-- Widget 삭제 버튼 -->
                                <button 
                                    class="w-3 h-3 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    onclick={(e) => {
                                        e.stopPropagation();
                                        deleteWidget(widget);
                                    }}
                                    title="삭제"
                                    aria-label='Delete widget'
                                >
                                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 3L3 9M3 3l6 6"/>
                                    </svg>
                                </button>
                            </div>

                            <!-- Widget Children 목록 (중첩된 위젯들) -->
                            {#if hasChildren(widget) && isWidgetExpanded(widget.id)}
                                <div class="ml-4 border-l border-gray-300 mt-1">
                                    {#each (widget as any).children as childWidget (childWidget.id)}
                                        <div class="pl-1 pb-1">
                                            <!-- svelte-ignore  a11y_click_events_have_key_events a11y_no_static_element_interactions -->
                                            <div 
                                                class="group flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded hover:bg-gray-50 text-xs transition-colors"
                                                class:bg-blue-50={studioDoc.activeId === childWidget.id}
                                                onclick={() => handleWidgetClick(childWidget.id)}
                                                role="button"
                                                tabindex="0"
                                                aria-label='child widget click'
                                            >
                                                <!-- 자식 위젯 펼침/접힘 아이콘 (children이 있는 경우) -->
                                                {#if hasChildren(childWidget)}
                                                    <button
                                                        class="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-transform duration-200"
                                                        class:rotate-90={isWidgetExpanded(childWidget.id)}
                                                        onclick={(e) => toggleWidget(childWidget.id, e)}
                                                        aria-label={isWidgetExpanded(childWidget.id) ? '접기' : '펼치기'}
                                                    >
                                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                                            <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                    </button>
                                                {:else}
                                                    <div class="w-4 h-4"></div>
                                                {/if}

                                                <!-- 자식 위젯 아이콘 (동일한 크기) -->
                                                <div class="w-4 h-4 flex items-center justify-center">
                                                    {#if (childWidget as any).type === 'frame'}
                                                        <div class="w-3 h-3 bg-red-500 rounded-sm flex items-center justify-center">
                                                            <div class="w-1.5 h-1.5 bg-white rounded-xs border border-red-300"></div>
                                                        </div>
                                                    {:else if (childWidget as any).type === 'sandbox'}
                                                        <div class="w-3 h-3 bg-green-500 rounded-sm flex items-center justify-center">
                                                            <div class="w-1 h-1 bg-white rounded-full"></div>
                                                        </div>
                                                    {:else if (childWidget as any).type === 'simple-image'}
                                                        <div class="w-3 h-3 bg-indigo-500 rounded-sm flex items-center justify-center">
                                                            <div class="w-1.5 h-1 bg-white rounded-xs"></div>
                                                        </div>
                                                    {:else if (childWidget as any).type === 'button'}
                                                        <div class="w-3 h-3 bg-blue-500 rounded-sm flex items-center justify-center">
                                                            <div class="w-1.5 h-0.5 bg-white rounded-xs"></div>
                                                        </div>
                                                    {:else if (childWidget as any).type === 'text'}
                                                        <div class="w-3 h-3 bg-orange-500 rounded-sm flex items-center justify-center">
                                                            <div class="w-0.5 h-1.5 bg-white rounded-xs"></div>
                                                        </div>
                                                    {:else}
                                                        <div class="w-3 h-3 bg-gray-500 rounded-sm flex items-center justify-center">
                                                            <div class="w-1 h-1 bg-white rounded-full"></div>
                                                        </div>
                                                    {/if}
                                                </div>

                                                <!-- 자식 위젯 이름 -->
                                                <EditableText 
                                                    value={childWidget.name} 
                                                    onSave={(newName) => updateWidgetName(childWidget, newName)}
                                                    class="flex-1 min-w-0"
                                                />

                                                <!-- 자식 위젯 삭제 버튼 -->
                                                <button 
                                                    class="w-3 h-3 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    onclick={(e) => {
                                                        e.stopPropagation();
                                                        deleteWidget(childWidget);
                                                    }}
                                                    title="삭제"
                                                    aria-label='Delete child widget'
                                                >
                                                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 3L3 9M3 3l6 6"/>
                                                    </svg>
                                                </button>
                                            </div>

                                            <!-- 더 깊은 중첩 레벨의 children (재귀적 표시) -->
                                            {#if hasChildren(childWidget) && isWidgetExpanded(childWidget.id)}
                                                <div class="ml-4 border-l border-gray-200 mt-1">
                                                    {#each (childWidget as any).children as grandChildWidget (grandChildWidget.id)}
                                                        <div class="pl-1 pb-1">
                                                            <!-- svelte-ignore  a11y_click_events_have_key_events a11y_no_static_element_interactions -->
                                                            <div 
                                                                class="group flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded hover:bg-gray-50 text-xs transition-colors"
                                                                class:bg-blue-50={studioDoc.activeId === grandChildWidget.id}
                                                                onclick={() => handleWidgetClick(grandChildWidget.id)}
                                                                role="button"
                                                                tabindex="0"
                                                                aria-label='grand child widget click'
                                                            >
                                                                <div class="w-4 h-4"></div>
                                                                <!-- 손자 위젯 아이콘 (동일한 크기) -->
                                                                <div class="w-4 h-4 flex items-center justify-center">
                                                                    {#if (grandChildWidget as any).type === 'frame'}
                                                                        <div class="w-3 h-3 bg-red-500 rounded-sm flex items-center justify-center">
                                                                            <div class="w-1.5 h-1.5 bg-white rounded-xs border border-red-300"></div>
                                                                        </div>
                                                                    {:else if (grandChildWidget as any).type === 'sandbox'}
                                                                        <div class="w-3 h-3 bg-green-500 rounded-sm flex items-center justify-center">
                                                                            <div class="w-1 h-1 bg-white rounded-full"></div>
                                                                        </div>
                                                                    {:else if (grandChildWidget as any).type === 'simple-image'}
                                                                        <div class="w-3 h-3 bg-indigo-500 rounded-sm flex items-center justify-center">
                                                                            <div class="w-1.5 h-1 bg-white rounded-xs"></div>
                                                                        </div>
                                                                    {:else if (grandChildWidget as any).type === 'button'}
                                                                        <div class="w-3 h-3 bg-blue-500 rounded-sm flex items-center justify-center">
                                                                            <div class="w-1.5 h-0.5 bg-white rounded-xs"></div>
                                                                        </div>
                                                                    {:else if (grandChildWidget as any).type === 'text'}
                                                                        <div class="w-3 h-3 bg-orange-500 rounded-sm flex items-center justify-center">
                                                                            <div class="w-0.5 h-1.5 bg-white rounded-xs"></div>
                                                                        </div>
                                                                    {:else}
                                                                        <div class="w-3 h-3 bg-gray-500 rounded-sm flex items-center justify-center">
                                                                            <div class="w-1 h-1 bg-white rounded-full"></div>
                                                                        </div>
                                                                    {/if}
                                                                </div>

                                                                <!-- 손자 위젯 이름 -->
                                                                <EditableText 
                                                                    value={grandChildWidget.name} 
                                                                    onSave={(newName) => updateWidgetName(grandChildWidget, newName)}
                                                                    class="flex-1 min-w-0"
                                                                />

                                                                <!-- 손자 위젯 삭제 버튼 -->
                                                                <button 
                                                                    class="w-3 h-3 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                                    onclick={(e) => {
                                                                        e.stopPropagation();
                                                                        deleteWidget(grandChildWidget);
                                                                    }}
                                                                    title="삭제"
                                                                    aria-label='Delete grand child widget'
                                                                >
                                                                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 3L3 9M3 3l6 6"/>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    {/each}
                                                </div>
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    {/each}
    
</div>

