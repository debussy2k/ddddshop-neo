import type { CanvasMode } from "./types";
class CanvasManager {
    canvasMode = $state<CanvasMode>('fixed-canvas');

    get mode() {
        return this.canvasMode;
    }
    
    set mode(value: CanvasMode) {
        this.canvasMode = value;
    }

    /////////////////////////////////////////////////////////////////////////////////////

    width = $state<number>(300);
    needUpdate = $state<number>(0);
    
    // 줌 스케일 상태 추가
    zoomScale = $state<number>(1);
    
    // zoom 리셋 콜백 저장
    private resetZoomCallback: (() => void) | null = null;
    
    get currentWidth() {
        return this.width;
    }
    
    set currentWidth(value: number) {
        this.width = value;
    }

    updateWidth(width: number) {
        this.width = width;
    }

    updateNeedUpdate() {
        this.needUpdate = (this.needUpdate + 1) % 1000000;
    }
    
    // 줌 스케일 업데이트 메서드 추가
    updateZoomScale(scale: number) {
        this.zoomScale = scale;
    }

    // zoom 리셋 콜백 등록 메서드
    registerResetZoom(callback: () => void) {
        this.resetZoomCallback = callback;
    }

    // zoom 리셋 실행 메서드
    resetZoom() {
        if (this.resetZoomCallback) {
            this.resetZoomCallback();
        }
    }
}

export const canvasManager = new CanvasManager();
