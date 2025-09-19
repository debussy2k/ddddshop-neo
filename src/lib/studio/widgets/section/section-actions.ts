import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Widget, Sandbox } from "../../types";
import type { Section, SectionInput, SectionPropValue } from "./section.type";
import { bpm, type BreakPoint } from "$lib/studio/breakpoint-man.svelte";


export class SectionActions {

    constructor(private historyManager: HistoryManager<DocState>) {}

    // 자동 섹션 이름 생성
    private generateSectionName(existingSections: Section[]): string {
        const sectionNumbers = existingSections
            .map(s => s.name)
            .filter(name => /^섹션 \d+$/.test(name))
            .map(name => parseInt(name.replace('섹션 ', '')))
            .filter(num => !isNaN(num));
        
        const maxNumber = sectionNumbers.length > 0 ? Math.max(...sectionNumbers) : 0;
        return `섹션 ${maxNumber + 1}`;
    }

    add(data: SectionInput): { id: string } {
        const newId = nanoid();

        this.historyManager.execute((draft) => {
            const sectionName = data.name?.trim() || this.generateSectionName(draft.sections);
            
            let defaultProp:Section['prop'] = {
				mobile: {
					layout: 'block',
					height: '260px'
				},
				tablet: {
					layout: 'block',
					height: '360px'
				},
				desktop: {
					layout: 'block',
					height: '460px'
				}
            }

            const newSection: Section = {
                id: newId,
                type: 'section',
                name: sectionName,
                parentId: "",
                children: [],
                prop: data.prop ? { ...defaultProp, ...data.prop } : defaultProp,
                ...data,
            };

            draft.sections.push(newSection);
        });

        return {
            id: newId
        }
    }

    remove(id: string): DocState {
        return this.historyManager.execute((draft) => {
            draft.sections = draft.sections.filter(s => s.id !== id);
        });
    }

    /*
        id를 넘겨서 해당 section을 업데이트 함
        prop은 제외
    */
    update(id: string, updates: Partial<Omit<Section, 'id'|'type'|'prop'>>): DocState {
        return this.historyManager.execute((draft) => {
            const sectionIndex = draft.sections.findIndex(s => s.id === id);
            if (sectionIndex !== -1) {
                draft.sections[sectionIndex] = {
                    ...draft.sections[sectionIndex],
                    ...updates
                };
            }
        });
    }

    /*
        breakPoint를 넘겨서 해당 breakPoint의 prop을 업데이트 함
    */
    updateProp(id: string, prop: Partial<SectionPropValue>, breakPoint: BreakPoint): DocState {
        return this.historyManager.execute((draft) => {
            const sectionIndex = draft.sections.findIndex(s => s.id === id);
            if (sectionIndex !== -1) {
                draft.sections[sectionIndex].prop[breakPoint] = {
                    ...draft.sections[sectionIndex].prop[breakPoint], 
                    ...prop 
                };
            }
        });
    }

    move(fromIndex: number, toIndex: number): DocState {
        return this.historyManager.execute((draft) => {
            const sections = draft.sections;
            if (fromIndex >= 0 && fromIndex < sections.length && 
                toIndex >= 0 && toIndex < sections.length) {
                const [movedSection] = sections.splice(fromIndex, 1);
                sections.splice(toIndex, 0, movedSection);
            }
        });
    }
}
