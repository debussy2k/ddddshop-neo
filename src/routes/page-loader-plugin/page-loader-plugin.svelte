<script lang="ts">
    import { onMount } from 'svelte';
    import ShopicusFunc from './shopicus-func';
    import { JsonView } from '@zerodevx/svelte-json-view';
    import ProjectItem from './project-item.svelte';
    import { pluginStore } from './plugin.store.svelte';
    
    
    let childUsers = $state<any[]>([]);
    let projects = $state<any[]>([]);
    let selectedThumbnails = $state<Map<string, number[]>>(new Map()); // projectId -> selected thumbnail indices

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
        let data = await ShopicusFunc.getCartItems({
            $orderby: 'Id desc',
            $top: '5',
            $skip: '0',
            $filter: `(Status eq 'Editing') and (User/ParentId ne null and contains(User/UserName,'${loginId}') and contains(EdicusPsCode,'@${pluginStore.innerPageProductCode}') )`,
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

    // edicus project의 썸네일 이미지 주소를 조립한다.
    function getTnUrl(project: any, index: number) {
        let partnerId = 'tville';
        let timeStamp = new Date(project.modificationDate).getTime();
        let url = `https://storage.googleapis.com/edicusbase.appspot.com/partners/${partnerId}/users/${partnerId}-${project.authorGuid}/projects/${project.edicusProjectId}/preivew/preview_${index}.jpg?ts=${timeStamp}`;
        return url;
    }

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
            동일한 내지(판형) 사이즈만 추가 가능합니다. (선생님이 선택한 판형 사이즈는 A4입니다.)
        </div>
    </div>

    <div class='text-sm p-4 flex flex-col gap-4'>
        {#each projects as project}
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