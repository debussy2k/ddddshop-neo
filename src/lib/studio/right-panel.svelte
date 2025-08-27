<script lang="ts">  
    import { onMount } from 'svelte';

    let { width }: { width: string } = $props();

    let style = `width: ${width}`;

    onMount(() => {
        console.log('RightPanel mounted');
    });
</script>
<div class="bg-gray-100" style={style}>RightPanel</div>