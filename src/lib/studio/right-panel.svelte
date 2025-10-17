<script lang="ts">
	import { onMount } from 'svelte';
	import { studioDoc } from './studio-doc.svelte';
	import SectionProperty from './widgets/section/section-property.svelte';
	import FrameProperty from './widgets/frame/frame-property.svelte';
	import SandboxProperty from './widgets/sandbox/sandbox-property.svelte';
	import SimpleImageProperty from './widgets/simple-image/simple-image-property.svelte';
	import ShowcaseProperty from './widgets/showcase/showcase-property.svelte';
	import { JsonView } from '@zerodevx/svelte-json-view';
	import { Context } from './context.svelte';
	import { bpm, type BreakPoint } from './breakpoint-man.svelte';

	type Mode = 'design' | 'json';

	let state: Mode = $state('design');
	let { width }: { width: string } = $props();

	let context = new Context(bpm.current as BreakPoint);
	$effect(() => {
		context.breakPoint = bpm.current;
	});

	let style = `width: ${width}`;

	onMount(() => {
		console.log('RightPanel mounted');
	});
</script>

<div class="relative bg-white" {style}>
	<div class="absolute inset-0 flex flex-col h-full border-t border-gray-200">
        <!-- Tab Buttons -->
        <div class="flex border-b border-gray-200">
            <button
                class="px-4 py-2 text-sm font-medium {state === 'design'
                    ? 'border-b-2 border-blue-600 bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}"
                onclick={() => (state = 'design')}
            >
                Design
            </button>
            <button
                class="px-4 py-2 text-sm font-medium {state === 'json'
                    ? 'border-b-2 border-blue-600 bg-blue-50 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}"
                onclick={() => (state = 'json')}
            >
                JSON
            </button>
        </div>
        
        <div class='px-4 py-2 text-xs text-gray-500'>
            BreakPoint: {bpm.current}
        </div>

        <!-- Tab Content -->
        <div class="flex-1 overflow-y-auto">
            {#if state === 'design'}
                {#if studioDoc.activeItem}
                    {@const item = studioDoc.activeItem}
                    {#if item.type === 'section'}
                        <SectionProperty data={item} {context} />
                    {:else if item.type === 'sandbox'}
                        <SandboxProperty data={item} {context} />
                    {:else if item.type === 'frame'}
                        <FrameProperty data={item} {context} />
                    {:else if item.type === 'simple-image'}
                        <SimpleImageProperty simpleImage={item} {context} />
                    {:else if item.type === 'showcase'}
                        <ShowcaseProperty showcase={item} {context} />
                    {/if}
                {/if}
            {:else if state === 'json'}
                {#if studioDoc.activeItem}
                    <div class="p-4 text-xs">
                        <JsonView json={studioDoc.activeItem} />
                    </div>
                {:else}
                    <div class="p-4 text-center text-gray-500">활성화된 아이템이 없습니다.</div>
                {/if}
            {/if}
        </div>
    </div>
</div>
