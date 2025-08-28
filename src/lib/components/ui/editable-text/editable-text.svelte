<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface Props {
		value: string;
		class?: ClassValue;
		onSave?: (newValue: string) => void | Promise<void>;
		placeholder?: string;
	}

	let { value, class: className, onSave, placeholder = "텍스트를 입력하세요" }: Props = $props();

	let isEditing = $state(false);
	let editValue = $state("");
	let inputElement = $state<HTMLInputElement>();

	function startEdit() {
		isEditing = true;
		editValue = value;
		// 다음 tick에서 input에 포커스를 주고 모든 텍스트 선택
		setTimeout(() => {
			if (inputElement) {
				inputElement.focus();
				inputElement.select();
			}
		}, 0);
	}

	async function saveEdit() {
		if (editValue.trim() && editValue !== value) {
			if (onSave) {
				await onSave(editValue.trim());
			}
		}
		isEditing = false;
	}

	function cancelEdit() {
		isEditing = false;
		editValue = value;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			saveEdit();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			cancelEdit();
		}
	}

	function handleBlur() {
		saveEdit();
	}
</script>

{#if isEditing}
	<input
		bind:this={inputElement}
		bind:value={editValue}
		onkeydown={handleKeydown}
		onblur={handleBlur}
		class={cn(
			"bg-white border border-blue-500 rounded px-1 py-0.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500",
			className
		)}
		{placeholder}
	/>
{:else}
	<span
		class={cn("text-gray-800 truncate font-medium cursor-pointer hover:bg-gray-100 rounded px-1 py-0.5", className)}
		ondblclick={startEdit}
		role="button"
		tabindex="0"
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ' || e.key === 'F2') {
				e.preventDefault();
				startEdit();
			}
		}}
	>
		{value}
	</span>
{/if}
