<script lang="ts">
    import type { ClassValue } from 'svelte/elements';
    import { cn } from '$lib/utils';
    import { onMount } from 'svelte';
    import ShopicusFunc from './shopicus-func';
    import { JsonView } from '@zerodevx/svelte-json-view';
    import ProjectItem from './project-item.svelte';
    import { pluginStore } from './plugin.store.svelte';
    import { isInnerPageSize, getTnUrl } from './util';

    interface Props {
        class?: ClassValue;
    }

    let { class: className }: Props = $props();
    
    
    let childUsers = $state<any[]>([]);
    let projects = $state<any[]>([]);
    let selectedThumbnails = $state<Map<string, number[]>>(new Map()); // projectId -> selected thumbnail indices
    let filterType = $state<'all' | 'available' | 'unavailable'>('all'); // 필터 상태
    
    // 검색 관련 상태
    let searchTarget = $state<'all' | 'title' | 'childUserLoginId' | 'childUserDisplayName'>('all');
    let searchKeyword = $state('');

    pluginStore.innerPageProductCode = 'TV-1PAGE-BODY'; // 선생님 상품의 psCode로 부터 이 값을 유도할 수 있어야 함.
    pluginStore.innerPageSizeCode = 'A4'; // 선생님 상품의 psCode로 부터 이 값을 유도할 수 있어야 함.

    onMount(async () => {
            
            childUsers = await ShopicusFunc.getChildUsers({
            $orderby: 'LoginId asc',
            $top: '10',
            $skip: '0',
            $filter: '(IsActiveAccount)',
        });

        let ids = childUsers.map((user) => user.loginId);
        
        for await (let loginId of ids) {
            let {totalCount, items} = await fetchCartItems(loginId);
            projects.push(...items);
        }
        console.log(projects);

    });

    async function fetchCartItems(loginId: string) {
        let filter = `
            (Status eq 'Editing') 
            and (
                User/ParentId ne null 
                and contains(User/UserName,'${loginId}') 
                and contains(EdicusPsCode,'@${pluginStore.innerPageProductCode}') 
            )
        `;

        let data = await ShopicusFunc.getCartItems({
            $orderby: 'Id desc',
            $top: '5',
            $skip: '0',
            $filter: filter,
        });
        let totalCount = data.count;
        let items = data.result;
        return {
            totalCount: totalCount,
            items: items.map((item: any) => {
                return {
                    productName: item.productName,
                    productOptionName: item.productOptionName,
                    productOptions: item.productOptions,
                    status: item.status,
                    pageCount: item.pageCount,
                    edicusProjectId: item.edicusProjectId,
                    edicusPsCode: item.edicusPsCode,
                    thumbnailUrl: item.thumbnailUrl,
                    title: item.title,
                    childUserLoginId: item.childUserLoginId,
                    childUserDisplayName: item.childUserDisplayName,
                    modificationDate: item.modificationDate,
                    authorGuid: item.authorGuid,
                    userMemo: item.userMemo,
                    tnUrls: Array.from({ length: item.pageCount }, (_, index) => getTnUrl(item, index)),
                }
            }),
        };
    }

    // 검색을 포함한 fetchCartItems
    async function fetchCartItemsWithSearch(loginId: string, searchTarget: string, searchKeyword: string) {
        let baseFilter = `
            (Status eq 'Editing') 
            and (
                User/ParentId ne null 
                and contains(User/UserName,'${loginId}') 
                and contains(EdicusPsCode,'@${pluginStore.innerPageProductCode}') 
            )
        `;

        // 검색 조건 추가
        let searchFilter = '';
        if (searchKeyword.trim()) {
            const keyword = searchKeyword.trim();
            if (searchTarget === 'all') {
                // 전체 검색 - 모든 필드에서 검색
                searchFilter = ` and (
                    contains(Title,'${keyword}') or 
                    contains(User/UserName,'${keyword}') or 
                    contains(User/DisplayName,'${keyword}')
                )`;
            } else {
                // 특정 필드 검색
                let fieldName = '';
                switch (searchTarget) {
                    case 'title':
                        fieldName = 'Title';
                        break;
                    case 'childUserLoginId':
                        fieldName = 'User/UserName';
                        break;
                    case 'childUserDisplayName':
                        fieldName = 'User/DisplayName';
                        break;
                }
                if (fieldName) {
                    searchFilter = ` and contains(${fieldName},'${keyword}')`;
                }
            }
        }

        let filter = baseFilter + searchFilter;

        let data = await ShopicusFunc.getCartItems({
            $orderby: 'Id desc',
            $top: '20', // 검색 시에는 더 많은 결과 가져오기
            $skip: '0',
            $filter: filter,
        });
        
        let totalCount = data.count;
        let items = data.result;
        return {
            totalCount: totalCount,
            items: items.map((item: any) => {
                return {
                    productName: item.productName,
                    productOptionName: item.productOptionName,
                    productOptions: item.productOptions,
                    status: item.status,
                    pageCount: item.pageCount,
                    edicusProjectId: item.edicusProjectId,
                    edicusPsCode: item.edicusPsCode,
                    thumbnailUrl: item.thumbnailUrl,
                    title: item.title,
                    childUserLoginId: item.childUserLoginId,
                    childUserDisplayName: item.childUserDisplayName,
                    modificationDate: item.modificationDate,
                    authorGuid: item.authorGuid,
                    userMemo: item.userMemo,
                    tnUrls: Array.from({ length: item.pageCount }, (_, index) => getTnUrl(item, index)),
                }
            }),
        };
    }

    function handleSelectAll(project: any) {
        console.log('=== 전체 선택 함수 호출 ===');
        console.log('프로젝트:', project);
        console.log('프로젝트 ID:', project.edicusProjectId);
        console.log('썸네일 개수:', project.tnUrls?.length || 0);
        
        const projectId = project.edicusProjectId;
        const currentSelected = selectedThumbnails.get(projectId) || [];
        const totalThumbnails = project.tnUrls ? project.tnUrls.length : 0;
        
        console.log('현재 선택된 썸네일:', currentSelected);
        console.log('전체 썸네일 개수:', totalThumbnails);
        
        if (currentSelected.length === totalThumbnails) {
            // 모든 썸네일이 선택된 상태 -> 전체 해제
            console.log('전체 해제 실행');
            selectedThumbnails.delete(projectId);
        } else {
            // 일부 또는 아무것도 선택되지 않은 상태 -> 전체 선택
            console.log('전체 선택 실행');
            const allIndices = Array.from({ length: totalThumbnails }, (_, i) => i);
            console.log('선택할 인덱스들:', allIndices);
            selectedThumbnails.set(projectId, allIndices);
        }
        
        // Map 업데이트를 위해 새로운 Map 생성
        selectedThumbnails = new Map(selectedThumbnails);
        
        console.log('전체 선택 후 최종 상태:', Object.fromEntries(selectedThumbnails));
        console.log('=== 전체 선택 함수 종료 ===');
    }

    function handleSelectPartial(project: any) {
        console.log('일부만 선택:', project);
        // 일부 선택 로직 구현
    }

    function handleThumbnailSelect(projectId: string, thumbnailIndex: number) {
        const currentSelected = selectedThumbnails.get(projectId) || [];
        const isSelected = currentSelected.includes(thumbnailIndex);
        
        if (isSelected) {
            // 선택 해제
            const newSelected = currentSelected.filter(index => index !== thumbnailIndex);
            if (newSelected.length === 0) {
                selectedThumbnails.delete(projectId);
            } else {
                selectedThumbnails.set(projectId, newSelected);
            }
        } else {
            // 선택 추가
            selectedThumbnails.set(projectId, [...currentSelected, thumbnailIndex]);
        }
        
        // Map 업데이트를 위해 새로운 Map 생성
        selectedThumbnails = new Map(selectedThumbnails);
        
        console.log('선택된 썸네일:', Object.fromEntries(selectedThumbnails));
    }


    // 검색 함수
    async function handleSearch() {
        if (!searchKeyword.trim()) {
            // 검색어가 없으면 전체 데이터 다시 로드
            await loadAllProjects();
            return;
        }

        console.log(`검색 대상: ${searchTarget}, 검색어: ${searchKeyword}`);
        
        // 서버에서 검색 결과 가져오기
        await searchProjects();
    }

    // 전체 프로젝트 로드
    async function loadAllProjects() {
        projects = [];
        for await (let loginId of childUsers.map(user => user.loginId)) {
            let {totalCount, items} = await fetchCartItems(loginId);
            projects.push(...items);
        }
    }

    // 검색된 프로젝트 로드
    async function searchProjects() {
        projects = [];
        for await (let loginId of childUsers.map(user => user.loginId)) {
            let {totalCount, items} = await fetchCartItemsWithSearch(loginId, searchTarget, searchKeyword);
            projects.push(...items);
        }
    }

    // 검색 초기화 함수
    async function clearSearch() {
        searchKeyword = '';
        await loadAllProjects();
    }

    // 필터된 프로젝트 목록 (내지 사이즈 필터링만)
    let filteredProjects = $derived.by(() => {
        let result = projects;
        
        // 내지 사이즈 필터링 (검색 시에는 서버에서 이미 필터링된 결과가 옴)
        switch (filterType) {
            case 'available':
                result = result.filter(project => isInnerPageSize(project.edicusPsCode));
                break;
            case 'unavailable':
                result = result.filter(project => !isInnerPageSize(project.edicusPsCode));
                break;
            case 'all':
            default:
                // 전체 표시
                break;
        }
        
        return result;
    });

</script>

<div class={cn('flex flex-col h-full bg-white', className || '')}>
    <!-- 헤더 -->
    <div class='flex justify-center items-center h-[42px] border-b border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 shrink-0'>
        초대계정 내지 불러오기
    </div>

    <!-- 안내 -->
    <div class='px-5 py-3 border-b border-gray-200 shrink-0'>
        <div class='text-[13px] font-bold text-gray-800'>
            내지를 추가할 프로젝트를 선택해 주세요
        </div>
        <div class='text-xs text-gray-500 mt-0.5'>
            동일한 내지(판형) 사이즈만 추가 가능합니다. (선생님이 선택한 판형 사이즈는 <span class="font-semibold text-gray-700">{pluginStore.innerPageSizeCode}</span>입니다.)
        </div>
    </div>

    <!-- 검색 & 필터 -->
    <div class='flex flex-wrap justify-between items-center px-5 py-2.5 border-b border-gray-200 gap-y-2 shrink-0'>
        <div class="flex items-center gap-1.5">
            <select
                bind:value={searchTarget}
                class="h-8 px-2 border border-gray-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="all">전체</option>
                <option value="title">프로젝트명</option>
                <option value="childUserLoginId">ID</option>
                <option value="childUserDisplayName">이름</option>
            </select>

            <input
                type="text"
                bind:value={searchKeyword}
                placeholder="검색어를 입력하세요"
                class="h-8 w-44 px-2.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                onkeydown={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />

            <button
                type="button"
                onclick={handleSearch}
                class="h-8 w-8 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center shrink-0"
                aria-label="검색"
            >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </button>

            {#if searchKeyword}
                <button
                    type="button"
                    onclick={clearSearch}
                    class="h-8 px-2.5 bg-gray-100 text-gray-500 text-xs rounded hover:bg-gray-200 transition-colors"
                >
                    초기화
                </button>
            {/if}
        </div>

        <div class="flex items-center gap-3">
            <label class="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                    type="radio"
                    bind:group={filterType}
                    value="all"
                    class="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 focus:outline-none"
                />
                <span class="text-xs text-gray-600">전체</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                    type="radio"
                    bind:group={filterType}
                    value="available"
                    class="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 focus:outline-none"
                />
                <span class="text-xs text-gray-600">추가 가능</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                    type="radio"
                    bind:group={filterType}
                    value="unavailable"
                    class="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 focus:outline-none"
                />
                <span class="text-xs text-gray-600">추가 불가</span>
            </label>
        </div>
    </div>

    <!-- 프로젝트 목록 -->
    <div class='flex-1 overflow-y-auto'>
        <div class='px-5 py-4 flex flex-col gap-3'>
            {#each filteredProjects as project, index (project.edicusProjectId)}
                <div class="text-xs text-gray-400 font-medium {index > 0 ? 'mt-2' : ''}">
                    {index + 1}. {project.childUserDisplayName} ({project.childUserLoginId})
                </div>
                <ProjectItem
                    {project}
                    selectedThumbnails={selectedThumbnails.get(project.edicusProjectId) || []}
                    onSelectAll={handleSelectAll}
                    onSelectPartial={handleSelectPartial}
                    onThumbnailSelect={handleThumbnailSelect}
                />
            {/each}
        </div>

        <!-- 선택된 썸네일 정보 -->
        {#if selectedThumbnails.size > 0}
            <div class='mx-5 mb-4 p-3 bg-blue-50 border border-blue-200 rounded'>
                <h3 class='text-xs font-bold text-blue-800 mb-1.5'>선택된 썸네일</h3>
                {#each Array.from(selectedThumbnails.entries()) as [projectId, thumbnailIndices] (projectId)}
                    {@const project = projects.find(p => p.edicusProjectId === projectId)}
                    {#if project}
                        <div class='mb-1.5 last:mb-0'>
                            <div class='text-xs font-medium text-gray-800'>{project.title}</div>
                            <div class='text-xs text-gray-500'>
                                선택된 페이지: {thumbnailIndices.map(i => i + 1).join(', ')} ({thumbnailIndices.length}개)
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}

        <div class='px-5 pb-4'>
            <JsonView json={projects} />
        </div>
    </div>
</div>