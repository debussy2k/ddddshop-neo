<script lang="ts">
	import { ButtonGroup } from "$lib/components/ui/button-group";
	import { cn } from "$lib/utils";
	import type { HorizontalAlign } from "../../types";
	

	interface Props {
		align: HorizontalAlign;
		onChange?: (align: HorizontalAlign) => void;
		class?: string;
		disabled?: boolean;
	}

	let { align, onChange, class: className, disabled }: Props = $props();

	const options = [
		{
			id: "left" as HorizontalAlign,
			label: "Align left",
			icon: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M17.25 10a.75.75 0 0 0 .75-.75v-.5a.75.75 0 0 0-.75-.75h-8.5a.75.75 0 0 0-.75.75v.5c0 .414.336.75.75.75zm-4 5a.75.75 0 0 0 .75-.75v-.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75v.5c0 .414.336.75.75.75z" clip-rule="evenodd"></path><path fill="currentColor" d="M6 17.5a.5.5 0 0 1-1 0v-12a.5.5 0 0 1 1 0z"></path></svg>`
		},
		{
			id: "center" as HorizontalAlign,
			label: "Align horizontal centers",
			icon: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M17.25 10a.75.75 0 0 0 .75-.75v-.5a.75.75 0 0 0-.75-.75h-9.5a.75.75 0 0 0-.75.75v.5c0 .414.336.75.75.75zm-2 5a.75.75 0 0 0 .75-.75v-.5a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v.5c0 .414.336.75.75.75z" clip-rule="evenodd"></path><path fill="currentColor" fill-rule="evenodd" d="M13 17.5a.5.5 0 0 1-1 0V15h1zm0-4.5v-3h-1v3zm0-7.5V8h-1V5.5a.5.5 0 0 1 1 0" clip-rule="evenodd"></path></svg>`
		},
		{
			id: "right" as HorizontalAlign,
			label: "Align right",
			icon: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M6.75 10A.75.75 0 0 1 6 9.25v-.5A.75.75 0 0 1 6.75 8h8.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75zm4 5a.75.75 0 0 1-.75-.75v-.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75z" clip-rule="evenodd"></path><path fill="currentColor" d="M18 17.5a.5.5 0 0 0 1 0v-12a.5.5 0 0 0-1 0z"></path></svg>`
		}
	];
</script>

<div class={cn("flex flex-col gap-2 text-sm", className)}>
	<ButtonGroup
		{options}
		onClick={disabled ? undefined : (value) => onChange?.(value as HorizontalAlign)}
		{disabled}
	/>
</div>
