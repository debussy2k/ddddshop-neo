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
}

export const canvasManager = new CanvasManager();
