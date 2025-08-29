import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState } from "../../types";

export interface Section {
    id: string;
    type: 'section';
    name: string;
    content?: any;

    height: string;
}

// 섹션 생성시 사용하는 타입 (name은 선택적)
export type SectionInput = Omit<Section, 'id' | 'type' | 'name'> & {
    name?: string;
};


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

    addSection(section: SectionInput): DocState {
        return this.historyManager.execute((draft) => {
            const sectionName = section.name?.trim() || this.generateSectionName(draft.sections);
            
            const newSection: Section = {
                ...section,
                id: nanoid(),
                type: 'section',
                name: sectionName
            };

            draft.sections.push(newSection);
        });
    }

    removeSection(id: string): DocState {
        return this.historyManager.execute((draft) => {
            draft.sections = draft.sections.filter(s => s.id !== id);
        });
    }

    updateSection(id: string, updates: Partial<Omit<Section, 'id'|'type'>>): DocState {
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

    moveSection(fromIndex: number, toIndex: number): DocState {
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
