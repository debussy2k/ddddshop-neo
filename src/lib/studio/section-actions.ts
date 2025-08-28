import type HistoryManager from "./history-manager";
import type { Section, DocState } from "./types";

export class SectionActions {
    private sampleCount = 0;

    constructor(private historyManager: HistoryManager<DocState>) {}

    addSampleSection(): DocState {
        this.sampleCount++;
        
        const section: Section = {
            id: this.sampleCount,
            name: `Section ${this.sampleCount}`,
            type: 'section'
        };

        return this.historyManager.execute((draft) => {
            draft.sections.push(section);
        });
    }

    addSection(section: Omit<Section, 'id'>): DocState {
        const newSection: Section = {
            ...section,
            id: Date.now() // 또는 UUID 사용
        };

        return this.historyManager.execute((draft) => {
            draft.sections.push(newSection);
        });
    }

    removeSection(id: number): DocState {
        return this.historyManager.execute((draft) => {
            draft.sections = draft.sections.filter(s => s.id !== id);
        });
    }

    updateSection(id: number, updates: Partial<Omit<Section, 'id'>>): DocState {
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
