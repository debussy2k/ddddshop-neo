<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";

	interface Props {
		value: string;
		class?: ClassValue;
		onSave?: (newValue: string) => void | Promise<void>;
		placeholder?: string;
	}

	let { value, class: className, onSave, placeholder = "값 입력" }: Props = $props();

	let isEditing = $state(false);
	let editValue = $state("");
	let inputElement = $state<HTMLInputElement>();

	// px 값에서 숫자 부분과 단위 추출
	let parsedValue = $derived(() => {
		const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
		if (match) {
			const [, numeric, unit] = match;
			return { numeric, unit: unit || null };
		}
		return { numeric: value, unit: null };
	});

	// 편집할 숫자 부분
	let numericValue = $derived(parsedValue().numeric);
	
	// 단위 부분
	let unitValue = $derived(parsedValue().unit);

	function startEdit() {
		isEditing = true;
		editValue = numericValue;
		// 다음 tick에서 input에 포커스를 주고 모든 텍스트 선택
		setTimeout(() => {
			if (inputElement) {
				inputElement.focus();
				inputElement.select();
			}
		}, 0);
	}

	async function saveEdit() {
		if (editValue.trim() && editValue !== numericValue) {
			const trimmedValue = editValue.trim();
			// 숫자인지 확인
			if (/^\d+(?:\.\d+)?$/.test(trimmedValue)) {
				const newValue = unitValue ? `${trimmedValue}${unitValue}` : trimmedValue;
				if (onSave) {
					await onSave(newValue);
				}
			}
		}
		isEditing = false;
	}

	function cancelEdit() {
		isEditing = false;
		editValue = numericValue;
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

	// 숫자만 입력 허용
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const inputValue = target.value;
		// 숫자와 소수점만 허용
		if (!/^\d*\.?\d*$/.test(inputValue)) {
			target.value = editValue;
		} else {
			editValue = inputValue;
		}
	}
</script>

<div class={cn("flex items-center justify-between min-h-[1.75rem] border", className)}>
	<div class="flex-1">
		{#if isEditing}
			<input
				bind:this={inputElement}
				bind:value={editValue}
				oninput={handleInput}
				onkeydown={handleKeydown}
				onblur={handleBlur}
				class="bg-transparent border-none rounded px-1 py-0.5 text-sm font-medium text-gray-800 focus:outline-none w-full"
				{placeholder}
				type="text"
			/>
		{:else}
			<div 
				class="rounded px-1 py-0.5 cursor-pointer hover:bg-gray-100 h-full flex items-center"
				onclick={startEdit}
				ondblclick={startEdit}
				role="button"
				tabindex="0"
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ' || e.key === 'F2') {
						e.preventDefault();
						startEdit();
					}
				}}
				title="클릭하여 편집"
			>
				<span class="text-gray-800 font-medium select-none">{numericValue}</span>
			</div>
		{/if}
	</div>
	{#if unitValue}
		<div class="flex-shrink-0 px-1">
			<span class="text-sm text-gray-500 font-medium select-none">{unitValue}</span>
		</div>
	{/if}
</div>
