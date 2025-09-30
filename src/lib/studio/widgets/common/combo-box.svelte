<script lang="ts">
	import { cn } from "$lib/utils";
	import * as Popover from "$lib/components/ui/popover/index.js";

    type ComboBoxOption = {
        type: 'item';
        label: string;
        value: string;
        onChange?: (value: string) => void;
    }
    type ComboBoxDivider = {
        type: 'divider';
    }
    export type ComboBoxItem = ComboBoxOption | ComboBoxDivider;


    type Props = {
        name?: string;
		icon?: string; // svg 문자열을 받음
        class?: string;
        value: number;
        comboBoxItems: ComboBoxItem[];
        min?: number;
        max?: number;
        onChange?: (value: number) => void;
    }

    let { class: className, name, icon, value, comboBoxItems, min, max, onChange }: Props = $props();
    
    // popover 상태 관리
    let isPopoverOpen = $state(false);
    
    // 값을 min, max 범위로 제한하는 함수
    function clampValue(val: number): number {
        if (min !== undefined && val < min) return min;
        if (max !== undefined && val > max) return max;
        return val;
    }
    
    // 드래그 관련 상태
    let isDragging = $state(false);
    let dragStartValue = $state(0);
    let accumulatedDelta = $state(0);

    function handleMouseDown(event: MouseEvent) {
        // value가 없는 경우 드래그 비활성화
        if (value === null || value === undefined) return;

        isDragging = true;
        dragStartValue = value;
        accumulatedDelta = 0;
        
        // Pointer Lock 요청
        const target = event.target as HTMLElement;
        target.requestPointerLock?.();
        
        // 전역 마우스 이벤트 등록
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        // 마우스 선택 방지
        event.preventDefault();
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging) return;

        // Pointer Lock이 활성화된 경우 movementX 사용
        const deltaX = event.movementX || 0;
        const sensitivity = 1; // 드래그 민감도 조절
        
        accumulatedDelta += deltaX;
        const newValue = dragStartValue + (accumulatedDelta * sensitivity);
        
        // min, max 범위로 제한
        const clampedValue = clampValue(Math.round(newValue));

        onChange?.(clampedValue);
    }

    function handleMouseUp() {
        isDragging = false;
        accumulatedDelta = 0;
        
        // Pointer Lock 해제
        document.exitPointerLock?.();
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
</script>

<div class={cn('flex items-center text-xs bg-gray-100 rounded-sm h-6 min-w-0', className)}>
    <div 
        class={cn('w-6  flex-shrink-0 select-none', 
                  isDragging ? 'cursor-ew-resize' : 'cursor-ew-resize hover:bg-gray-200')}
        onmousedown={handleMouseDown}
        role="button"
        tabindex="0">
        {#if icon}
			<div class=''>
				{@html icon}
			</div>
        {:else}
			<div class="px-2 text-gray-600">
				{name}
			</div>
        {/if}
    </div>
    <input type="text" 
        class='h-full outline-none flex-1 min-w-0 text-ellipsis text-gray-800'
        onfocus={(event) => {
            const input = event.target as HTMLInputElement;
            input.select();
        }}
        value={value}
        onchange={(event) => {
            const input = event.target as HTMLInputElement;
            
            // number로 변환하여 반환
            const numValue = parseFloat(input.value);
            const validValue = isNaN(numValue) ? 0 : numValue;
            const finalValue = clampValue(validValue);
            
            onChange?.(finalValue);
        }}
    />

	<Popover.Root bind:open={isPopoverOpen}>
		<Popover.Trigger class='w-6'>
			<div class={cn(
				'flex items-center text-xs rounded-sm w-full',
				className
			)}>
				<div class='w-6 text-gray-800 flex-shrink-0'>
					<svg width="24" height="24" fill="none" viewBox="0 0 24 24">
						<path fill="currentColor" fill-rule="evenodd" d="M9.146 11.146a.5.5 0 0 1 .708 0l1.646 1.647 1.646-1.647a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708" clip-rule="evenodd"></path>
					</svg>
				</div>	
			</div>
		</Popover.Trigger>
		<Popover.Content class='w-full px-2 py-2 bg-gray-900 text-white' side='bottom' align='end'>
			<div class='flex flex-col text-xs'>
                {#each comboBoxItems as item}
                    {#if item.type === 'item'}
                        <button 
                            type="button"
                            class='px-2 py-1 hover:bg-gray-500 cursor-pointer text-left flex items-center gap-2'
                            onclick={() => {
                                item.onChange && item.onChange(item.value);
                                isPopoverOpen = false; // popover 닫기
                            }}
                        >
                            <div>{item.label}</div>
                        </button>
                    {:else if item.type === 'divider'}
                        <hr class='border-gray-600 my-2'>
                    {/if}
                {/each}
			</div>
		</Popover.Content>
	</Popover.Root>    
</div>