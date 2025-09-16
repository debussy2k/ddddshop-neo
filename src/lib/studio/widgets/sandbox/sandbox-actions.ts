import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Section, Widget } from "../../types";
import type { Sandbox, SandboxInput } from "./sandbox.type";
import type { BreakPoint } from '$lib/studio/breakpoint-man.svelte';

export class SandboxActions {

    constructor(private historyManager: HistoryManager<DocState>) {
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

    addSandbox(data: SandboxInput): { id: string } {
        const newId = nanoid();

        this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 기존 sandbox 이름 검색
            const sandboxName = data.name?.trim() || this.generateSandboxName(draft.sections);
            
            const defaultProp = {
                mobile: {
                    width: '160px',
                    height: '100px'
                },
                tablet: {
                    width: '160px',
                    height: '100px'
                },
                desktop: {
                    width: '160px',
                    height: '100px'
                }
            }

            const newSandbox: Sandbox = {
                ...data,
                id: newId,
                type: 'sandbox',
                name: sandboxName,
                text: data.text || '샌드박스 텍스트',
                prop: data.prop ? { ...defaultProp, ...data.prop } : defaultProp,
            };

            // 부모 Section이 지정되어 있으면 해당 Section의 child로 추가
            if (data.parentId) {
                const section = draft.sections.find(s => s.id === data.parentId);
                if (section) {
                    if (!section.children) {
                        section.children = [];
                    }
                    // 이미 같은 ID의 Sandbox가 있는지 확인
                    if (!section.children.find((child:Widget) => child.id === newSandbox.id)) {
                        section.children.push(newSandbox);
                    }
                }
            }
        });

        return {
            id: newId
        }
    }

    removeSandbox(id: string): DocState {
        return this.historyManager.execute((draft) => {
            // 모든 Section에서 해당 Sandbox 제거
            draft.sections.forEach(section => {
                if (section.children) {
                    section.children = section.children.filter((child:Widget) => child.id !== id);
                }
            });
        });
    }

    updateSandbox(id: string, updates: Partial<Omit<Sandbox, 'id'|'type'>>): DocState {
        return this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 해당 Sandbox 찾아서 업데이트
            draft.sections.forEach(section => {
                if (section.children) {
                    const sandboxIndex = section.children.findIndex((child:Widget) => child.id === id);
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

    updateSandboxProp(id: string, updates: Partial<Sandbox['prop'][keyof Sandbox['prop']]>, breakpoint: BreakPoint): DocState { 
        return this.historyManager.execute((draft) => {
            draft.sections.forEach(section => {
                if (section.children) {
                    const sandboxIndex = section.children.findIndex((child:Widget) => child.id === id);
                    if (sandboxIndex !== -1) {
                        section.children[sandboxIndex].prop[breakpoint] = {
                            ...section.children[sandboxIndex].prop[breakpoint],
                            ...updates
                        };
                    }
                }
            });
        });
    }
}
