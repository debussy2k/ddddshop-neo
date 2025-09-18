<script lang="ts">
	import { cn } from "$lib/utils";

	interface Props {
		options: string[];
		value: string;
		onChange: (value: string) => void;
		class?: string;
	}

	let { options, value, onChange, class: className }: Props = $props();
</script>

<div class={cn('flex items-center text-xs bg-white rounded-sm h-6 min-w-0 border border-gray-200', className)}>
    <div class='w-6 px-2 text-gray-600 flex-shrink-0'>
        H
    </div>
    <div class='flex-1 min-w-0 text-gray-800 flex-shrink-0 select-none'>
        {value}
    </div>
	<div class='w-6 text-gray-800 flex-shrink-0'>
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M9.146 11.146a.5.5 0 0 1 .708 0l1.646 1.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708" clip-rule="evenodd"></path></svg>
	</div>
</div>