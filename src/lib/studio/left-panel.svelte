<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
    import { onMount } from 'svelte';

    let { width }: { width: string } = $props();

    let style = `width: ${width}`;

    onMount(() => {
        console.log('LeftPanel mounted');
    });
</script>

<div class="bg-gray-100" style={style}>
    <Button variant="outline" onclick={() => {
        console.log('Add Section');
    }}>Add Section</Button>
</div>