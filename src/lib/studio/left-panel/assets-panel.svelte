<script lang="ts">  
    import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';
    import { studioDoc } from '../studio-doc.svelte';

    function addComponent() {
        console.log('addComponent');
    }
</script>

<div class='p-2'>
    <Button variant="outline" onclick={addComponent}>Add Component</Button>
</div>