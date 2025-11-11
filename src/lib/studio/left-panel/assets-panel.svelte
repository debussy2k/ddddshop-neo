<script lang="ts">  
    import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
    import { studioDoc } from '../studio-doc.svelte';

    let components = $derived(studioDoc.document.assets.components);

    function addComponent() {
        console.log('addComponent');
    }

    function openComponent(id: string) {
        console.log('openComponent', id);
    }

</script>

<div class='p-2'>
    <Button variant="outline" onclick={addComponent}>Add Component</Button>
</div>

<div class='p-2 border-t border-gray-200'>

    {#each components as component}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div class='flex items-center justify-between cursor-pointer hover:bg-gray-100' 
            onclick={() => openComponent(component.id)}
            role="button"
            tabindex="0"
        >
            <span>- {component.name}</span>
        </div>
    {/each}
</div>