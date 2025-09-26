<script lang="ts">
	import { cn } from "$lib/utils";

    interface Props {
        name: string;
        class?: string;
        value?: string | number;
        min?: number;
        max?: number;
        onChange?: (value: string | number) => void;
    }

    let { class: className, name, value, min, max, onChange }: Props = $props();
    
    // 값을 min, max 범위로 제한하는 함수
    function clampValue(val: number): number {
        if (min !== undefined && val < min) return min;
        if (max !== undefined && val > max) return max;
        return val;
    }
    
    // value를 분석하여 숫자 부분과 unit 부분을 분리
    let { numberPart, unit } = $derived.by(() => { 
        if (value === null || value === undefined) return { numberPart: '', unit: '' };
        
        // number 타입인 경우 그대로 문자열로 변환하여 처리
        if (typeof value === 'number') {
            return { numberPart: value.toString(), unit: '' };
        }
        
        // string 타입인 경우 기존 방식대로 처리
        // 숫자로 시작하는지 확인 (음수 포함)
        const match = value.match(/^(-?\d*\.?\d*)(.*)/);
        if (match) {
            const [, numPart, unitPart] = match;
            // 숫자로 시작하면 unit 분리
            if (numPart) {
                return { numberPart: numPart, unit: unitPart };
            }
        }
        
        // 숫자가 아닌 값으로 시작하면 unit 없는 값으로 간주
        return { numberPart: value, unit: '' };
    });

    // 드래그 관련 상태
    let isDragging = $state(false);
    let dragStartValue = $state(0);
    let accumulatedDelta = $state(0);

    function handleMouseDown(event: MouseEvent) {
        // 숫자가 아닌 경우 드래그 비활성화
        const currentNumber = parseFloat(numberPart);
        if (isNaN(currentNumber)) return;

        isDragging = true;
        dragStartValue = currentNumber;
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

        // 새로운 값 적용
        let finalValue: string | number;
        if (typeof value === 'number') {
            finalValue = clampedValue;
        } else {
            finalValue = unit ? clampedValue + unit : clampedValue.toString();
        }

        onChange?.(finalValue);
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
        class={cn('w-6 px-2 text-gray-600 flex-shrink-0 select-none', 
                  isDragging ? 'cursor-ew-resize' : 'cursor-ew-resize hover:bg-gray-200')}
        onmousedown={handleMouseDown}
        role="button"
        tabindex="0">
        {name}
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
            
            // 원래 value의 타입에 맞게 finalValue 생성
            let finalValue: string | number;
            
            if (typeof value === 'number') {
                // 원래 number 타입이었다면 number로 변환하여 반환
                const numValue = parseFloat(input.value);
                const validValue = isNaN(numValue) ? 0 : numValue;
                finalValue = clampValue(validValue);
            } else {
                // 원래 string 타입이었다면 unit과 조합하여 string으로 반환
                const numValue = parseFloat(input.value);
                if (!isNaN(numValue)) {
                    const clampedNum = clampValue(numValue);
                    finalValue = unit ? clampedNum + unit : clampedNum.toString();
                } else {
                    finalValue = unit ? input.value + unit : input.value;
                }
            }
            
            onChange?.(finalValue);
        }}
    />
</div>