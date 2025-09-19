import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Section, Widget } from "../../types";
import type { Showcase, ShowcaseInput } from "./showcase.type";
import type { BreakPoint } from '$lib/studio/breakpoint-man.svelte';

export type { Showcase, ShowcaseInput };

export class ShowcaseActions {

    constructor(private historyManager: HistoryManager<DocState>) {
    }

    // 자동 Showcase 이름 생성 - 모든 Section의 children에서 Showcase 검색
    private generateShowcaseName(sections: Section[]): string {
        const allShowcases = sections.flatMap(section => section.children || []);
        const showcaseNumbers = allShowcases
            .map(s => s.name)
            .filter(name => /^쇼케이스 \d+$/.test(name))
            .map(name => parseInt(name.replace('쇼케이스 ', '')))
            .filter(num => !isNaN(num));
        
        const maxNumber = showcaseNumbers.length > 0 ? Math.max(...showcaseNumbers) : 0;
        return `쇼케이스 ${maxNumber + 1}`;
    }

    add(showcase: ShowcaseInput): { id: string } {
        const newId = nanoid();

        this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 기존 showcase 이름 검색
            const showcaseName = showcase.name?.trim() || this.generateShowcaseName(draft.sections);
            
            const defaultProp = {
                mobile: {
                    titleFontSize: 16,
                    titleFontWeight: 'normal',
                    descFontSize: 16,
                    descFontWeight: 'normal',
                },
                tablet: {
                    titleFontSize: 16,
                    titleFontWeight: 'normal',
                    descFontSize: 16,
                    descFontWeight: 'normal',
                },
                desktop: {
                    titleFontSize: 16,
                    titleFontWeight: 'normal',
                    descFontSize: 16,
                    descFontWeight: 'normal',
                }
            };

            const newShowcase: Showcase = {
                id: newId,
                type: 'showcase',
                name: showcaseName,
                ...showcase,
                parentId: showcase.parentId || '',
                showcaseCode: showcase.showcaseCode || '',
                prop: showcase.prop ? { ...defaultProp, ...showcase.prop } : defaultProp,
            };

            // 부모 Section이 지정되어 있으면 해당 Section의 child로 추가
            if (showcase.parentId) {
                const section = draft.sections.find(s => s.id === showcase.parentId);
                if (section) {
                    if (!section.children) {
                        section.children = [];
                    }
                    // 이미 같은 ID의 Showcase가 있는지 확인
                    if (!section.children.find((child: Widget) => child.id === newShowcase.id)) {
                        section.children.push(newShowcase);
                    }
                }
            }
        });

        return {
            id: newId
        }
    }

    remove(id: string): DocState {
        return this.historyManager.execute((draft) => {
            // 모든 Section에서 해당 Showcase 제거
            draft.sections.forEach(section => {
                if (section.children) {
                    section.children = section.children.filter((child: Widget) => child.id !== id);
                }
            });
        });
    }

    update(id: string, updates: Partial<Omit<Showcase, 'id'|'type'|'prop'>>): DocState {
        return this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 해당 Showcase 찾아서 업데이트
            draft.sections.forEach(section => {
                if (section.children) {
                    const showcaseIndex = section.children.findIndex((child: Widget) => child.id === id);
                    if (showcaseIndex !== -1) {
						section.children[showcaseIndex] = {
							...section.children[showcaseIndex],
							...updates
						};
                    }
                }
            });
        });
    }

	updateProp(id: string, updates: Partial<Showcase['prop'][keyof Showcase['prop']]>, breakpoint: BreakPoint): DocState {
		return this.historyManager.execute((draft) => {
			draft.sections.forEach(section => {
				if (section.children) {
					const showcaseIndex = section.children.findIndex((child: Widget) => child.id === id);
					if (showcaseIndex !== -1) {
						section.children[showcaseIndex].prop[breakpoint] = {
							...section.children[showcaseIndex].prop[breakpoint],
							...updates
						};
					}
				}
			});
		});
	}
}
