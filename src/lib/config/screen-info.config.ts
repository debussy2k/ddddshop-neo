import type { BreakPoint } from "$lib/studio/types";

interface SnapToInfo {
	width: number;
	devices: string[];
}

interface ScreenInfo {
	initialWidth: number;
	minWidth: number;
	maxWidth: number;
	snapTo?: SnapToInfo[];
}

export const getScreenInfo = (breakPoint: BreakPoint): ScreenInfo => {
	switch (breakPoint) {
		case 'mobile':
			return {
				initialWidth: 320,
				minWidth: 320,
				maxWidth: 767,
				snapTo: [
					{
						width: 360,
						devices: ['iPhone 12 mini', 'Galaxy S9']
					},
					{
						width: 390,
						devices: ['iPhone 12 pro', 'iPhone 13 pro']
					},
					{
						width: 600,
						devices: ['Galaxy Tab 2  (7")']
					},
					{
						width: 720,
						devices: ['Surface Pro 2', 'Surface Pro']
					}
				]
			};
		case 'tablet':
			return {
				initialWidth: 768,
				minWidth: 768,
				maxWidth: 991,
				snapTo: [
					{
						width: 768,
						devices: ['iPad Pro (9.7")', 'iPadd 2017/2018', 'iPad Air/Air 2', 'iPad 4th gen', 'iPad mini (모든 기종)', 'Microsoft Surface']
					},
					{
						width: 800,
						devices: ['Galaxy Note 10.1', 'Galaxy Tab 3/2 (10")', 'Galaxy Tab S', "Galaxy Tab 8.9"]
					}
				]
			};
		case 'desktop':
			return {
				initialWidth: 992,
				minWidth: 992,
				maxWidth: 2200,
			}
		default:
			return {
				initialWidth: 320,
				minWidth: 320,
				maxWidth: 767,
			}
	}
};

export type { SnapToInfo, ScreenInfo, BreakPoint };
