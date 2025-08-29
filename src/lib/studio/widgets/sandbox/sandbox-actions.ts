import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Section } from "../../types";
import { SectionActions } from "../section/section-actions";

export interface Sandbox {
    id: string;
    type: 'sandbox';
    name: string;
    text: string;
    parentId?: string; // Section의 child로 사용될 때의 부모 ID
}

// Sandbox 생성시 사용하는 타입 (name은 선택적)
export type SandboxInput = Omit<Sandbox, 'id' | 'type' | 'name'> & {
    name?: string;
};

export class SandboxActions {
    private sectionActions: SectionActions;

    constructor(private historyManager: HistoryManager<DocState>) {
        this.sectionActions = new SectionActions(historyManager);
    }

    // 자동 Sandbox 이름 생성 - 모든 Section의 children에서 Sandbox 검색
    private generateSandboxName(sections: Section[]): string {
        const allSandboxes = sections.flatMap(section => section.children || []);
        const sandboxNumbers = allSandboxes
            .map(s => s.name)
            .filter(name => /^샌드박스 \d+$/.test(name))
            .map(name => parseInt(name.replace('샌드박스 ', '')))
            .filter(num => !isNaN(num));
        
        const maxNumber = sandboxNumbers.length > 0 ? Math.max(...sandboxNumbers) : 0;
        return `샌드박스 ${maxNumber + 1}`;
    }

    addSandbox(sandbox: SandboxInput): DocState {
        return this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 기존 sandbox 이름 검색
            const sandboxName = sandbox.name?.trim() || this.generateSandboxName(draft.sections);
            
            const newSandbox: Sandbox = {
                ...sandbox,
                id: nanoid(),
                type: 'sandbox',
                name: sandboxName,
                text: sandbox.text || '샌드박스 텍스트'
            };

            // 부모 Section이 지정되어 있으면 해당 Section의 child로 추가
            if (sandbox.parentId) {
                const section = draft.sections.find(s => s.id === sandbox.parentId);
                if (section) {
                    if (!section.children) {
                        section.children = [];
                    }
                    // 이미 같은 ID의 Sandbox가 있는지 확인
                    if (!section.children.find(child => child.id === newSandbox.id)) {
                        section.children.push(newSandbox);
                    }
                }
            }
        });
    }

    removeSandbox(id: string): DocState {
        return this.historyManager.execute((draft) => {
            // 모든 Section에서 해당 Sandbox 제거
            draft.sections.forEach(section => {
                if (section.children) {
                    section.children = section.children.filter(child => child.id !== id);
                }
            });
        });
    }

    updateSandbox(id: string, updates: Partial<Omit<Sandbox, 'id'|'type'>>): DocState {
        return this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 해당 Sandbox 찾아서 업데이트
            draft.sections.forEach(section => {
                if (section.children) {
                    const sandboxIndex = section.children.findIndex(child => child.id === id);
                    if (sandboxIndex !== -1) {
                        section.children[sandboxIndex] = {
                            ...section.children[sandboxIndex],
                            ...updates
                        };
                    }
                }
            });
        });
    }
}
