export type BreakPoint = 'desktop' | 'tablet' | 'mobile';

class BreakPointManager {
    breakPoint = $state<BreakPoint>('desktop');
    
    get current() {
        return this.breakPoint;
    }
    
    set current(value: BreakPoint) {
        this.breakPoint = value;
    }

    get isDesktop() {
        return this.breakPoint === 'desktop';
    }

    get isTablet() {
        return this.breakPoint === 'tablet';
    }

    get isMobile() {
        return this.breakPoint === 'mobile';
    }   
}

export const bpm = new BreakPointManager();
