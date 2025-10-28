<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { studioDoc } from './studio-doc.svelte';
    import TopPanel from './top-panel.svelte';
    import LeftPanel from './left-panel.svelte';
    import CenterPanel from './center-panel.svelte';
    import RightPanel from './right-panel.svelte';

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

<div>Studio2</div>
<div class="flex flex-col h-screen">
    <TopPanel />
    <div class="flex flex-1">
        <LeftPanel width="240px" />
        <CenterPanel />
        <RightPanel width="240px"/>
    </div>
</div>
