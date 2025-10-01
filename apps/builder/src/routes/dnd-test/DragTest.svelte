<script lang="ts">
    import Sortable from 'sortablejs';
    import { onMount } from 'svelte';
    import { JsonView } from '@zerodevx/svelte-json-view';

    let items = $state([
        { id: 1, width: 80, height: 80, color: 'bg-red-200' },
        { id: 2, width: 80, height: 80, color: 'bg-blue-200' },
        { id: 3, width: 120, height: 100, color: 'bg-green-200' },
        { id: 4, width: 80, height: 80, color: 'bg-yellow-200' },
        { id: 5, width: 80, height: 120, color: 'bg-purple-200' },
        // { id: 6, width: 80, height: 80, color: 'bg-pink-200' },
        // { id: 7, width: 40, height: 80, color: 'bg-orange-200' },
        // { id: 8, width: 80, height: 80, color: 'bg-gray-200' },
        // { id: 9, width: 80, height: 80, color: 'bg-green-200' },
    ]);

    let sortableContainer: HTMLElement;

    onMount(() => {
        const sortable = Sortable.create(sortableContainer, {
            animation: 150,
            ghostClass: 'opacity-50',
            onEnd: (evt) => {
                const oldIndex = evt.oldIndex!;
                const newIndex = evt.newIndex!;
                
                // 배열에서 아이템 순서 변경
                const movedItem = items.splice(oldIndex, 1)[0];
                items.splice(newIndex, 0, movedItem);
                
                // 반응성을 위해 새 배열로 할당
                items = [...items];
            }
        });

        return () => {
            sortable.destroy();
        };
    });
</script>

<div class='mt-10 w-[600px] h-[400px] border border-gray-300'>
    <div bind:this={sortableContainer} class='flex flex-col gap-2 justify-between'>
        {#each items as item}
            <div class='relative user-select-none cursor-move {item.color} flex items-center justify-center font-bold'
                style:width={item.width+'px'}
                style:height={item.height+'px'}
            >{item.id}</div>
        {/each}
    </div>
</div>

<div class="text-sm">
    <JsonView json={items} />
</div>
