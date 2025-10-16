import type { BreakPoint } from "./types";

export class Context {
	breakPoint: BreakPoint = $state('desktop');
	
	constructor(breakPoint: BreakPoint) {
		this.breakPoint = breakPoint;
	}
}