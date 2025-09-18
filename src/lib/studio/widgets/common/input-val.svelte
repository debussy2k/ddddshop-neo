<script lang="ts">
	import { cn } from "$lib/utils";

    interface Props {
        name: string;
        class?: string;
        value?: string;
        onChange?: (value: string) => void;
    }

    let { class: className, name, value, onChange }: Props = $props();
    
    // value를 분석하여 숫자 부분과 unit 부분을 분리
    let { numberPart, unit } = $derived.by(() => { 
        if (!value) return { numberPart: '', unit: '' };
        
        // 숫자로 시작하는지 확인
        const match = value.match(/^(\d*\.?\d*)(.*)/);
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

    
</script>

<div class={cn('flex items-center text-xs bg-gray-100 rounded-sm h-6 min-w-0', className)}>
    <div class='w-6 px-2 text-gray-600 flex-shrink-0'>
        {name}
    </div>
    <input type="text" 
        class='h-full outline-none flex-1 min-w-0 text-ellipsis text-gray-800'
        onfocus={(event) => {
            const input = event.target as HTMLInputElement;
            input.select();
        }}
        value={numberPart}
        oninput={(event) => {
            const input = event.target as HTMLInputElement;
            // unit이 있는 경우 unit 조합하여 전달
            const finalValue = unit ? input.value + unit : input.value;
            onChange?.(finalValue);
        }}
    />
</div>