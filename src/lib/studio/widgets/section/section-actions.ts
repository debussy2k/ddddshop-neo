import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Widget, Sandbox } from "../../types";
import type { Section, SectionInput } from "./section.type";



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

    // Section에 child Sandbox 추가
    addChildToSection(sectionId: string, sandbox: Sandbox): DocState {
        return this.historyManager.execute((draft) => {
            const section = draft.sections.find(s => s.id === sectionId);
            if (section) {
                if (!section.children) {
                    section.children = [];
                }
                // 이미 같은 ID의 Sandbox가 있는지 확인
                if (!section.children.find(child => child.id === sandbox.id)) {
                    section.children.push(sandbox);
                }
            }
        });
    }

    // Section에서 child Sandbox 제거
    removeChildFromSection(sectionId: string, sandboxId: string): DocState {
        return this.historyManager.execute((draft) => {
            const section = draft.sections.find(s => s.id === sectionId);
            if (section && section.children) {
                section.children = section.children.filter(child => child.id !== sandboxId);
            }
        });
    }
}
