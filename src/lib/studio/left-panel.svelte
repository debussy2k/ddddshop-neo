<script lang="ts">
    import { onMount } from 'svelte';

    let { width }: { width: string } = $props();

    let style = `width: ${width}`;

    onMount(() => {
        console.log('LeftPanel mounted');
    });
</script>

<div class="bg-gray-100" style={style}>LeftPanel</div>