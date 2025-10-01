<script lang="ts">
	import { cn } from "$lib/utils";

    interface Props {
        name?: string;
		icon?: string; // svg 문자열을 받음
        class?: string;
        value?: number;
        min?: number;
        max?: number;
        onChange?: (value: number) => void;
    }

    let { class: className, name, icon, value, min, max, onChange }: Props = $props();
    
    // 값을 min, max 범위로 제한하는 함수
    function clampValue(val: number): number {
        if (min !== undefined && val < min) return min;
        if (max !== undefined && val > max) return max;
        return val;
    }
    
    // value를 문자열로 변환하여 표시
    let numberPart = $derived(() => { 
        if (value === null || value === undefined) return '';
        return value.toString();
    });

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
        value={numberPart}
        onchange={(event) => {
            const input = event.target as HTMLInputElement;
            
            // number로 변환하여 반환
            const numValue = parseFloat(input.value);
            const validValue = isNaN(numValue) ? 0 : numValue;
            const finalValue = clampValue(validValue);
            
            onChange?.(finalValue);
        }}
    />
</div>