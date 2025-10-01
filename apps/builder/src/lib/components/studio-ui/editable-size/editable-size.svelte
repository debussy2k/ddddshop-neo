<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";

	type Unit = "px" | "%" | "auto";

	interface Props {
		value: string;
		class?: ClassValue;
		onSave?: (newValue: string) => void | Promise<void>;
		placeholder?: string;
		allowedUnits?: Unit[];
	}

	let { value, class: className, onSave, placeholder = "값 입력", allowedUnits = ["px", "%", "auto"] }: Props = $props();

	let isEditing = $state(false);
	let editValue = $state("");
	let inputElement = $state<HTMLInputElement>();
	let showUnitSelector = $state(false);
	let selectedUnit = $state<Unit>("px");

	// 값에서 숫자 부분과 단위 추출 (auto 값 포함)
	let parsedValue = $derived(() => {
		if (value === "auto") {
			return { numeric: "", unit: "auto", isAuto: true };
		}
		const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
		if (match) {
			const [, numeric, unit] = match;
			return { numeric, unit: unit || "px", isAuto: false };
		}
		return { numeric: value, unit: "px", isAuto: false };
	});

	// 편집할 숫자 부분
	let numericValue = $derived(parsedValue().numeric);
	
	// 단위 부분
	let unitValue = $derived(parsedValue().unit);
	
	// auto 여부
	let isAutoValue = $derived(parsedValue().isAuto);

	// 현재 단위를 selectedUnit과 동기화
	$effect(() => {
		if (unitValue) {
			selectedUnit = unitValue as Unit;
		}
	});

	function startEdit() {
		if (selectedUnit === "auto") return; // auto일 때는 편집 불가
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
		if (selectedUnit === "auto") {
			if (onSave) {
				await onSave("auto");
			}
		} else if (editValue.trim() && editValue !== numericValue) {
			const trimmedValue = editValue.trim();
			// 숫자인지 확인
			if (/^\d+(?:\.\d+)?$/.test(trimmedValue)) {
				const newValue = `${trimmedValue}${selectedUnit}`;
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
		} else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			event.preventDefault();
			const currentValue = parseFloat(editValue) || 0;
			const increment = event.shiftKey ? 10 : 1;
			let newValue: number;
			
			if (event.key === 'ArrowUp') {
				newValue = currentValue + increment;
			} else {
				newValue = Math.max(1, currentValue - increment); // 1보다 작아질 수 없음
			}
			
			editValue = newValue.toString();
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

	function toggleUnitSelector() {
		showUnitSelector = !showUnitSelector;
	}

	async function selectUnit(unit: Unit) {
		selectedUnit = unit;
		showUnitSelector = false;
		
		if (unit === "auto") {
			if (onSave) {
				await onSave("auto");
			}
		} else if (numericValue && numericValue !== "") {
			const newValue = `${numericValue}${unit}`;
			if (onSave) {
				await onSave(newValue);
			}
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Element;
		if (!target.closest('.unit-selector-container')) {
			showUnitSelector = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<div class={cn("flex items-center justify-between min-h-[1.75rem] border relative", className)}>
	<div class="flex-1">
		{#if isEditing && selectedUnit !== "auto"}
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
				class="rounded px-1 py-0.5 h-full flex items-center"
				class:cursor-pointer={selectedUnit !== "auto"}
				class:hover:bg-gray-100={selectedUnit !== "auto"}
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
				title={selectedUnit === "auto" ? "Auto 값" : "클릭하여 편집"}
			>
				<span class="text-gray-800 font-medium select-none">
					{selectedUnit === "auto" ? "auto" : numericValue}
				</span>
			</div>
		{/if}
	</div>
	
	<div class="flex-shrink-0 relative unit-selector-container">
		<button
			onclick={toggleUnitSelector}
			class="px-2 py-1 text-sm text-gray-500 font-medium hover:bg-gray-100 rounded border-l focus:outline-none focus:ring-1 focus:ring-blue-500"
			title="단위 선택"
		>
			{selectedUnit}
		</button>
		
		{#if showUnitSelector}
			<div class="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 min-w-[60px]">
				{#each allowedUnits as unit}
					<button
						onclick={() => selectUnit(unit)}
						class="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
						class:bg-blue-50={selectedUnit === unit}
						class:text-blue-600={selectedUnit === unit}
					>
						{unit}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
