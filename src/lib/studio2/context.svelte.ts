import type { BreakPoint } from "./types";

export class Context {
	breakPoint: BreakPoint = $state('desktop');
	isPanning: boolean = $state(false);
	
	constructor(breakPoint: BreakPoint) {
		this.breakPoint = breakPoint;
	}

	get break(): BreakPoint {
		return this.breakPoint;
	}
}