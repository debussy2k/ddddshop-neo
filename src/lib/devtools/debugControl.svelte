<script lang="ts">
	// Svelte/External imports
	import { page } from '$app/stores';
	import type { HTMLAttributes } from 'svelte/elements';
	import { AppWindow, Settings } from '@lucide/svelte';

	// Components
	import Button, { buttonVariants } from '$components/ui/button/button.svelte';
	import * as Dialog from '$components/ui/dialog';
	import Switch from '$components/ui/switch/switch.svelte';
	import Dataview from './Dataview.svelte';

	// Utils & Services
	import { cn } from '$lib/utils';
	// import cloudif from '$lib/service/cloudif';
	import { hideBaseData, preference, showDebugInfo, showPageData } from '$lib/service/app.service';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	interface Props {
		class?: $$Props['class'];
		[key: string]: any;
	}

	let { class: className = undefined, ...rest }: Props = $props();

	function togglePageData() {
		$showPageData = !$showPageData;
	}

	let currentDataview: 'data' | 'page' | 'auth' | 'preference' = $state('data');
	let { supabase, session, ...restPageData } = $derived($page.data);
	let pageData = $derived($hideBaseData ? restPageData : $page.data);

	
</script>

<div class={cn('fixed right-1 bottom-1 z-20 flex items-center gap-x-1', className)} {...rest}>
	<Switch bind:checked={$showDebugInfo} class="scale-50 origin-right" />
	<Button size="icon" variant="outline" class="w-6 h-6 bg-gray-50" onclick={togglePageData}>
		<AppWindow size={16} />
	</Button>
	<Dialog.Root>
		<Dialog.Trigger class={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'h-6 w-6 bg-gray-50')}>
			<Settings size={16} />
		</Dialog.Trigger>
		<Dialog.Content class="max-w-[320px]">
			<Dialog.Header>
				<Dialog.Title>Debug Settings</Dialog.Title>
				<Dialog.Description class="text-sm font-mono space-y-2 pt-4">
					<div class="flex justify-between">
						<div>Run Mode</div>
						<div>{import.meta.env.PROD ? 'production' : 'dev'}</div>
					</div>
					<div class="flex justify-between">
						<div>Show debug information</div>
						<Switch bind:checked={$showDebugInfo} class="scale-50 origin-right" />
					</div>
					<!-- <Button variant="outline" onclick={testTokenRefresh}>Refresh Token</Button> -->
				</Dialog.Description>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
</div>
{#if $showPageData && $showDebugInfo}
	<div
		class="overflow-hidden flex flex-col fixed right-1 bottom-8 z-20 w-[320px] bg-white/80 rounded-lg border shadow-lg max-h-[calc(100vh-100px)] backdrop-blur-sm"
	>
		<div class="overflow-x-auto overflow-y-auto flex-1 p-4">
			{#if currentDataview === 'data'}
				<label class="text-sm flex items-center gap-x-2">
					<input type="checkbox" bind:checked={$hideBaseData} /> hide base data
				</label>
				<Dataview data={pageData} depth={1} />
			{:else if currentDataview === 'page'}
				<Dataview data={$page} depth={1} />
			{:else if currentDataview === 'auth'}
				<Dataview data={$page.data.session} title="session" depth={0} />
				<Dataview data={$page.data.session?.user} title="user" depth={0} />
				<Dataview data={$page.data.sellerInfo} title="sellerInfo" depth={0} />
			{:else if currentDataview === 'preference'}
				<Dataview data={$preference} title="preference" depth={0} />
			{/if}
		</div>
		<div
			class="flex gap-x-2 mt-2 border-t font-mono text-xs text-gray-400 font-semibold p-2 bg-gray-100"
		>
			<button class:text-gray-800={currentDataview === 'data'} onclick={() => (currentDataview = 'data')}>PageData</button>
			<button class:text-gray-800={currentDataview === 'page'} onclick={() => (currentDataview = 'page')}>Page</button>
			<button class:text-gray-800={currentDataview === 'auth'} onclick={() => (currentDataview = 'auth')}>Auth</button>
			<button
				class:text-gray-800={currentDataview === 'preference'}
				onclick={() => (currentDataview = 'preference')}>Preference
			</button>
		</div>
	</div>
{/if}

