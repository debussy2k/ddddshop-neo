class CanvasManager {
    width = $state<number>(300);
    needUpdate = $state<number>(0);
    
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
}

export const canvasManager = new CanvasManager();
