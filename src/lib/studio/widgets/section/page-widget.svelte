<script lang="ts">
    import type { DocState } from "../../types";
    import SectionWidget from "./section-widget.svelte";
	import type { Context } from "$lib/studio/context.svelte";
	import { bpm } from "$lib/studio/breakpoint-man.svelte";
    
	type Props = {
		doc: DocState;
		context: Context;
	}
    let { doc, context }: Props = $props();

	let top = 32;
	let left = $derived.by(() => {
		switch(context.breakPoint) {
			case 'desktop':
				return 16;
			case 'tablet':
				return 16 + 992 + 16;
			case 'mobile':
				return 16 + 992 + 16 + 768 + 16;
		}
	})
	let width = $derived(context.breakPoint === 'desktop' ? 992 : context.breakPoint === 'tablet' ? 768 : 320);



    // 캡처링 단계에서 이벤트를 받기 위한 action
    function captureMouseDown(node: HTMLElement) {
        node.addEventListener('mousedown', handleMouseDown, { capture: true });
        return {
            destroy() {
                node.removeEventListener('mousedown', handleMouseDown, { capture: true });
            }
        };
    }    
    function handleMouseDown(event: MouseEvent) {
        bpm.current = context.breakPoint;
    }    

</script>


<!-- desktop -->
<div class='page @container absolute shadow-lg shadow-gray-400 mt-4 ' 
    style="top:{top}px; left:{left}px; width:{width}px;"
    use:captureMouseDown
    role="button"
    tabindex="0"
>
    {#each doc.sections as section (section.id)}
        <SectionWidget data={section} {context} />
    {/each}
</div>

