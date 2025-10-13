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
		showNameSideBar?: boolean;
		icon?: string; // svg 문자열을 받음
        title?: string; // tooltip 타이틀
        placeholder?: string; // input 플레이스홀더
        class?: string;
        value: number | undefined;
        comboBoxItems: ComboBoxItem[];
        min?: number;
        max?: number;
		showFill?: boolean; // Fill 표시 여부
		showHugContents?: boolean; // Hug Contents 표시 여부
        onChange?: (value: number) => void;
		onDragStart?: () => void;
		onDragEnd?: () => void;		
    }

    let { class: className, name, showNameSideBar, icon, title, placeholder, value, comboBoxItems, min, max, showFill = false, showHugContents = false, onChange, onDragStart, onDragEnd }: Props = $props();
    
    // popover 상태 관리
    let isPopoverOpen = $state(false);
	let isHovering = $state(false);
    
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
    let dragTimer: number | null = $state(null); // 타이머 ID 저장
    let mouseDownEvent: MouseEvent | null = $state(null); // mousedown 이벤트 저장
    let isPointerLocked = $state(false); // Pointer Lock 상태 추적 추가

    function handleMouseDown(event: MouseEvent) {
        // 마우스 선택 방지
        event.preventDefault();
        
        // mousedown 이벤트 저장
        mouseDownEvent = event;
        
        // value가 undefined인 경우 1에서 시작
        dragStartValue = value ?? 1;
        accumulatedDelta = 0;
        
        // 300ms 후에 드래그 시작
        dragTimer = window.setTimeout(() => {
            if (mouseDownEvent) {
                startDragging(mouseDownEvent);
            }
        }, 300);
        
        // 전역 mouseup 이벤트 등록 (타이머 취소 및 클릭 처리용)
        document.addEventListener('mouseup', handleMouseUp);
    }

    function startDragging(event: MouseEvent) {
        isDragging = true;
        
        // Pointer Lock 요청
        const target = event.target as HTMLElement;
        target.requestPointerLock?.();
        
        // Pointer Lock 상태 변화 감지
        document.addEventListener('pointerlockchange', handlePointerLockChange);
        
        // 전역 마우스 이벤트 등록
        document.addEventListener('mousemove', handleMouseMove);
        
        onDragStart?.();
    }

    function handlePointerLockChange() {
        // Pointer Lock 상태 업데이트
        isPointerLocked = document.pointerLockElement !== null;
        
        // Pointer Lock이 예상치 못하게 해제되면 드래깅 종료
        if (!isPointerLocked && isDragging) {
            console.log("Pointer Lock lost unexpectedly");
            handleMouseUp();
        }
    }

    function handleMouseMove(event: MouseEvent) {
        if (!isDragging) return;
        
        // Pointer Lock이 활성화되지 않았으면 처리하지 않음
        if (!isPointerLocked) return;

        // Pointer Lock이 활성화된 경우 movementX 사용
        const deltaX = event.movementX || 0;
        
        // 비정상적으로 큰 값 필터링 (임계값 설정)
        const MAX_MOVEMENT = 100; // 정상적인 마우스 움직임의 최대값
        if (Math.abs(deltaX) > MAX_MOVEMENT) {
            console.warn("Abnormal movementX detected:", deltaX);
            return; // 비정상적인 값은 무시
        }
        
        // console.log("deltaX", deltaX);
		// 움직임이 없으면 처리하지 않음
		if (deltaX === 0) return;

        const sensitivity = 1; // 드래그 민감도 조절
        
        accumulatedDelta += deltaX;
        // console.log("accumulatedDelta", accumulatedDelta);

        const newValue = dragStartValue + (accumulatedDelta * sensitivity);
        
        // min, max 범위로 제한
        const clampedValue = clampValue(Math.round(newValue));

        onChange?.(clampedValue);
    }

    function handleMouseUp() {
        // 타이머가 있으면 취소
        if (dragTimer !== null) {
            clearTimeout(dragTimer);
            dragTimer = null;
        }
        
        // 드래깅이 시작되지 않았으면 클릭으로 처리
        if (!isDragging) {
            console.log("click");
        }
        
        // 드래깅 상태였으면 정리
        if (isDragging) {
            isDragging = false;
            isPointerLocked = false; // 상태 초기화
            accumulatedDelta = 0;
            
            // Pointer Lock 해제
            document.exitPointerLock?.();
            
            // 이벤트 리스너 제거
            document.removeEventListener('pointerlockchange', handlePointerLockChange);
            document.removeEventListener('mousemove', handleMouseMove);
            onDragEnd?.();
        }
        
        // mouseup 리스너 제거
        document.removeEventListener('mouseup', handleMouseUp);
        mouseDownEvent = null;
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div class={cn('flex items-center text-xs bg-gray-100 rounded-sm h-6 min-w-0 relative', className)}
	 onmouseover={() => isHovering = true}
	 onmouseout={() => isHovering = false}>
    <div 
        class={cn('w-6  flex-shrink-0 select-none', 
                  isDragging ? 'cursor-ew-resize' : 'hover:bg-gray-200')}
        onmousedown={handleMouseDown}
        title={title}
        role="button"
        tabindex="0">
        {#if icon}
			<div class=''>
				{@html icon}
			</div>
        {:else}
			<div class="px-1 text-gray-600 text-center">
				<!-- <span class="px-[1px] border-r border-l border-gray-500">{name}</span> -->
				<span class="relative px-[1px]" class:side-bar={showNameSideBar}>{name}</span>
			</div>
        {/if}
    </div>
    <input type="text" 
        class='h-full outline-none flex-1 min-w-0 text-ellipsis text-gray-800'
        placeholder={placeholder}
        onfocus={(event) => {
            const input = event.target as HTMLInputElement;
            input.select();
        }}
        value={value ?? ''}
        onchange={(event) => {
            const input = event.target as HTMLInputElement;
            
            // number로 변환하여 반환
            const numValue = parseFloat(input.value);
            const validValue = isNaN(numValue) ? 0 : numValue;
            const finalValue = clampValue(validValue);
            
            onChange?.(finalValue);
        }}
        onkeydown={(event) => {
            if (event.key === 'Enter') {
                const input = event.target as HTMLInputElement;
                
                // number로 변환하여 반환
                const numValue = parseFloat(input.value);
                const validValue = isNaN(numValue) ? 0 : numValue;
                const finalValue = clampValue(validValue);
                
                onChange?.(finalValue);
                
                // 포커스 해제 (선택 사항)
                input.blur();
            }
        }}
    />

	{#if !isHovering && showFill}
		<!-- Fill 표시 -->
		<div class='absolute top-0 left-6 right-0 h-full flex items-center justify-end pr-2 pointer-events-none'>
			<span class='bg-gray-100 text-gray-600'>Fill</span>
		</div>
	{:else if !isHovering && showHugContents}
		<!-- Hug Contents 표시 -->
		<div class='absolute top-0 left-6 right-0 h-full flex items-center justify-end pr-2 pointer-events-none'>
			<span class='bg-gray-100 text-gray-600'>Hug</span>
		</div>
	{/if}

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

<style>
    .side-bar::before {
        content: "";
        position: absolute;
        left: -1px;
        right: -1px;
        top: 2px;      /* 위로부터 2px 내려감 */
        bottom: 2px;   /* 아래서부터 2px 올라감 */
        border-left: 1px solid darkgray;
        border-right: 1px solid darkgray;
    }    
</style>