<script lang="ts">  
    import { onMount } from 'svelte';
	import { studioDoc } from "./studio-doc.svelte";
    import SectionProperty from "./widgets/section/section-property.svelte";
    import SandboxProperty from "./widgets/sandbox/sandbox-property.svelte";
    import SimpleImageProperty from "./widgets/simple-image/simple-image-property.svelte";


    let { width }: { width: string } = $props();

    let style = `width: ${width}`;

    onMount(() => {
        console.log('RightPanel mounted');
    });
</script>
<div class="bg-white" style={style}>
    {#if studioDoc.activeItem}
        {@const item = studioDoc.activeItem}
        {#if item.type === 'section'}
            <SectionProperty section={item} />
        {:else if item.type === 'sandbox'}
            <SandboxProperty sandbox={item} />
        {:else if item.type === 'simple-image'}
            <SimpleImageProperty simpleImage={item} />
        {/if}
    {/if}
</div>