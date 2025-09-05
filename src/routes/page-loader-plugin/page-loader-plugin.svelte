<script lang="ts">
    import { onMount } from 'svelte';
    import ShopicusFunc from './shopicus-func';
    import { JsonView } from '@zerodevx/svelte-json-view';
    import ProjectItem from './project-item.svelte';
    import { pluginStore } from './plugin.store.svelte';
    import { isInnerPageSize, getTnUrl } from './util';
    
    
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

<div class='w-[920px] min-h-[600px] border border-gray-200'>
    <div class='flex justify-center items-center h-[42px] border-b border-gray-200'>
        초대계정 내지 불러오기
    </div>

    <div class='px-4 py-4 border-b border-gray-200'>
        <div class='font-bold'>
            내지를 추가할 프로젝트를 선택해 주세요
        </div>
        <div>
            동일한 내지(판형) 사이즈만 추가 가능합니다. (선생님이 선택한 판형 사이즈는 {pluginStore.innerPageSizeCode}입니다.)
        </div>
    </div>

    <div class='flex justify-between items-center p-4'>
        <div class='flex-1'>
            <div class="flex items-center gap-3">
                <!-- 검색 대상 선택 드롭다운 -->
                <select 
                    bind:value={searchTarget}
                    class="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">전체</option>
                    <option value="title">프로젝트명</option>
                    <option value="childUserLoginId">ID</option>
                    <option value="childUserDisplayName">이름</option>
                </select>
                
                <!-- 검색어 입력창 -->
                <input 
                    type="text"
                    bind:value={searchKeyword}
                    placeholder="검색어를 입력하세요"
                    class="w-[160px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    onkeydown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                
                <!-- 검색 버튼 -->
                <button 
                    type="button"
                    onclick={handleSearch}
                    class="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors flex items-center justify-center"
                    aria-label="검색"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </button>
                
                <!-- 검색 초기화 버튼 -->
                {#if searchKeyword}
                    <button 
                        type="button"
                        onclick={clearSearch}
                        class="px-3 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 transition-colors"
                    >
                        초기화
                    </button>
                {/if}
            </div>
        </div>
        <div class='flex-1 flex justify-end'>
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-4">
                    <label class="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                            type="radio" 
                            bind:group={filterType} 
                            value="all"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 focus:outline-none"
                        />
                        <span class="text-sm text-gray-700">전체</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                            type="radio" 
                            bind:group={filterType} 
                            value="available"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 focus:outline-none"
                        />
                        <span class="text-sm text-gray-700">추가 가능한 내지</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                            type="radio" 
                            bind:group={filterType} 
                            value="unavailable"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 focus:outline-none"
                        />
                        <span class="text-sm text-gray-700">추가 불가능한 내지</span>
                    </label>
                </div>
            </div>
        </div>
    </div>

    <div class='text-sm p-4 flex flex-col gap-4'>
        {#each filteredProjects as project}
            <ProjectItem 
                {project} 
                selectedThumbnails={selectedThumbnails.get(project.edicusProjectId) || []}
                onSelectAll={handleSelectAll}
                onSelectPartial={handleSelectPartial}
                onThumbnailSelect={handleThumbnailSelect}
            />
        {/each}

        <!-- 선택된 썸네일 정보 -->
        {#if selectedThumbnails.size > 0}
            <div class='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md'>
                <h3 class='font-bold text-blue-800 mb-2'>선택된 썸네일</h3>
                {#each Array.from(selectedThumbnails.entries()) as [projectId, thumbnailIndices]}
                    {@const project = projects.find(p => p.edicusProjectId === projectId)}
                    {#if project}
                        <div class='mb-2'>
                            <div class='font-medium'>{project.title}</div>
                            <div class='text-sm text-gray-600'>
                                선택된 페이지: {thumbnailIndices.map(i => i + 1).join(', ')} ({thumbnailIndices.length}개)
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}

        <div class=''>
            <JsonView json={projects} />
        </div>
    </div>
</div>