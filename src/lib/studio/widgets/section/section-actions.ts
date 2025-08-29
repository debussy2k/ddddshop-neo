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


export class SectionActions {

    constructor(private historyManager: HistoryManager<DocState>) {}

    addSection(section: Omit<Section, 'id'|'type'>): DocState {
        const newSection: Section = {
            ...section,
            id: nanoid(),
            type: 'section'
        };

        return this.historyManager.execute((draft) => {
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
