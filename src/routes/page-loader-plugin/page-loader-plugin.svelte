<script lang="ts">
    import { onMount } from 'svelte';
    import ShopicusFunc from './shopicus-func';
    import { JsonView } from '@zerodevx/svelte-json-view';
    import { Checkbox } from "$lib/components/ui/checkbox/index.js"
    import { Button } from "$lib/components/ui/button/index.js"
    
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

    function getProductOptionName(productOptions: any[], optionName: string) {
        return productOptions.find((option) => option.displayName === optionName)?.displayValue;
    }

    function getDateTime(date: string) {
        return new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
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

    <div class='text-sm p-4 flex flex-col gap-2'>
        {#each projects as project}
            <div class='p-4 border border-gray-200'>
                <div class='flex gap-x-4 '>
                    <!-- 썸네일 -->
                    <div>
                        <img src={project.thumbnailUrl} alt={project.title} class='w-26 h-26     object-contain border border-gray-200' />
                    </div>

                    <!-- 상세정보 -->
                    <div class='flex flex-1'>
                        <!-- 왼쪽 상세정보 -->
                        <div class='flex flex-col gap-1 flex-1'>
                            <div class="text-lg font-bold">{project.title}</div>
                            <div>
                                초대 계정(ID): {project.childUserLoginId} | {project.childUserDisplayName}
                            </div>
                            <div class='flex'>
                                <div class='bg-gray-200 border border-gray-300 px-1 rounded-xs mr-2'>판형</div>
                                {getProductOptionName(project.productOptions, '판형')}
                            </div>
                            <div>
                                수정 : {getDateTime(project.modificationDate)}
                            </div>

                        </div>

                        <!-- 오른쪽 액션 버튼들 -->
                        <div class='w-[120px] flex-shrink-0 flex items-center'>
                            <div class="flex flex-col gap-2">
                                <div class="flex justify-start items-center">
                                    <Checkbox id="selectAll" />
                                    <label
                                        for="selectAll"
                                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
                                    >
                                        전체 선택
                                    </label>
                                </div>
                                <div>
                                    <Button variant="outline">
                                        일부만 선택
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {#if project.tnUrls.length > 0}
                    <div class='flex flex-wrap gap-2 mt-2'>
                        {#each project.tnUrls as tnUrl, index}
                            <img src={tnUrl} alt={project.title} class='w-26 h-26 object-contain border border-gray-200' />
                            <div class='text-sm'>
                                {index + 1}
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {/each}

        <div class=''>
            <JsonView json={projects} />
        </div>
    </div>
</div>