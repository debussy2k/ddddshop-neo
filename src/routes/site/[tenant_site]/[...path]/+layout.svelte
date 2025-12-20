<script lang="ts">
    import { page } from '$app/state';
    import type { Snippet } from 'svelte';

    interface Props {
        children: Snippet;
    }

    let { children }: Props = $props();
</script>

<svelte:head>
    <base href={`/site/${page.params.tenant_site}/`} />
</svelte:head>

{@render children()}

