<script lang="ts">
    import { onMount } from 'svelte';
    import ShopicusFunc from './shopicus-func';
    import { JsonView } from '@zerodevx/svelte-json-view';
    import ProjectItem from './project-item.svelte';
    
    let targetPsCode = $state<string>('A4@TV-1PAGE-BODY'); // 선생님 상품의 psCode로 부터 이 값을 유도할 수 있어야 함.
    let childUsers = $state<any[]>([]);
    let projects = $state<any[]>([]);


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
            $filter: `(Status eq 'Editing') and (User/ParentId ne null and contains(User/UserName,'${loginId}'))`,
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
        console.log('전체 선택:', project);
        // 전체 선택 로직 구현
    }

    function handleSelectPartial(project: any) {
        console.log('일부만 선택:', project);
        // 일부 선택 로직 구현
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
                onSelectAll={handleSelectAll}
                onSelectPartial={handleSelectPartial}
            />
        {/each}

        <div class=''>
            <JsonView json={projects} />
        </div>
    </div>
</div>