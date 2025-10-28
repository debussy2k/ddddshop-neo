<script lang="ts">
    import { onMount } from "svelte";
    import { studioDoc } from "$lib/studio2/studio-doc.svelte";
    import PageWidget from "./widgets/section/page-widget.svelte";
	import { Context } from "./context.svelte";
	import { setupCanvasPanning } from "./canvas-panning";
    import { canvasManager } from "./canvas-manager.svelte";

    let doc = $derived(studioDoc.document);
	let desktopContext = new Context('desktop');
	let tabletContext = new Context('tablet');
	let mobileContext = new Context('mobile');
	
	let inputElement: HTMLElement;  // 입력 받을 엘리먼트
	let canvasElement: HTMLElement; // transform 적용할 엘리먼트

    onMount(() => {
		// Infinite canvas 패닝 기능 설정
		if (inputElement && canvasElement) {
			const panningControl = setupCanvasPanning({
				inputElement,        // flex-1 엘리먼트에서 입력 받기
				targetElement: canvasElement,  // infinite-canvas에 transform 적용
				onPanChange: (x, y) => {
					// console.log(`Canvas panned to: ${x}, ${y}`);
				},
				onSpacePressed: (isPressed) => {
                    tabletContext.isPanning = isPressed;
                    mobileContext.isPanning = isPressed;
                    desktopContext.isPanning = isPressed;
				},
                onScaleChange: (scale, panX, panY) => {
                    canvasManager.updateZoomScale(scale);
                }
			});

			// zoom 리셋 기능을 canvasManager에 등록
			canvasManager.registerResetZoom(panningControl.resetZoom);

			return panningControl.cleanup;
		}
    });
</script>

<div class="flex-1 relative overflow-hidden bg-gray-100" style="box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.15);" bind:this={inputElement}>
    <div class='infinite-canvas absolute' bind:this={canvasElement}>
        <PageWidget doc={doc} context={desktopContext} />
        <PageWidget doc={doc} context={tabletContext} />
        <PageWidget doc={doc} context={mobileContext} />
    </div>
</div>