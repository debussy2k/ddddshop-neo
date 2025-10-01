<script lang="ts">
    import type { ClassValue } from "svelte/elements";
    import { cn } from "$lib/utils";
    import LeftSection from './top-panel/left-section.svelte';
    import CenterSection from './top-panel/center-section.svelte';
    import RightSection from './top-panel/right-section.svelte';

    interface Props {
        class?: ClassValue;
    }

    let { class: className }: Props = $props();
</script>

<div class={cn("w-full h-8 flex items-center bg-white border-b border-gray-200", className || '')}>
    <LeftSection />
    <CenterSection />
    <RightSection />
</div>