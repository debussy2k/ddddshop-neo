<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { studioDoc } from './studio-doc.svelte';
    import { bpm } from './breakpoint-man.svelte';
    import TopPanel from './top-panel.svelte';
    import LeftPanel from './left-panel.svelte';
    import RightPanel from './right-panel.svelte';
    import CenterPanel from './center-panel.svelte';
    import type { Snippet } from 'svelte';
    
    interface Props {
        impl: Snippet<[string]>;
    }
    let { impl }: Props = $props();

    // 키보드 단축키 핸들러
    function handleKeydown(event: KeyboardEvent) {
        // Ctrl+Z (Windows/Linux) 또는 Cmd+Z (Mac)
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) {
            event.preventDefault();
            studioDoc.undo();
        }
        // Ctrl+Y (Windows/Linux) 또는 Cmd+Y (Mac), 또는 Ctrl+Shift+Z
        else if (
            ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') ||
            ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && event.shiftKey)
        ) {
            event.preventDefault();
            studioDoc.redo();
        }

        // 숫자 키로 화면 크기 전환
        else if ((event.ctrlKey || event.metaKey) && event.key === '1') {
            event.preventDefault();
            bpm.current = 'desktop';
        }
        else if ((event.ctrlKey || event.metaKey) && event.key === '2') {
            event.preventDefault(); 
            bpm.current = 'tablet';
        }
        else if ((event.ctrlKey || event.metaKey) && event.key === '3') {
            event.preventDefault();
            bpm.current = 'mobile';
        }
    }

    onMount(() => {
        // 브라우저 환경에서만 전역 키보드 이벤트 리스너 추가
        if (browser) {  
            document.addEventListener('keydown', handleKeydown);
        }
    });

    onDestroy(() => {
        // 브라우저 환경에서만 이벤트 리스너 제거
        if (browser) {
            document.removeEventListener('keydown', handleKeydown);
        }
        studioDoc.destroy();
    });
</script>

<div class="flex flex-col h-screen">
    <TopPanel />
    <div class="flex flex-1">
        <LeftPanel width="240px" />
        <CenterPanel class="flex-1" />
        <RightPanel width="240px"/>
    </div>
</div>