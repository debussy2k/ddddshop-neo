import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Section, Widget } from "../../types";
import type { Sandbox, SandboxInput, SandboxPropValue } from "./sandbox.type";
import type { BreakPoint } from '$lib/studio/breakpoint-man.svelte';
import { du } from '../common/doc-util';

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

    add(data: SandboxInput): { id: string } {
        if (!data.parentId) {
            throw new Error('parentId is required');
        }
        
        const newId = nanoid();
        this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 기존 sandbox 이름 검색
            const sandboxName = data.name?.trim() || this.generateSandboxName(draft.sections);
            
            const defaultProp = {
                mobile: {
                    left: '10px',
                    top: '10px',
                    width: '160px',
                    height: '100px',
                    horzAlign: 'Left',
                    vertAlign: 'Top'
                },
                tablet: {
                    left: '10px',
                    top: '10px',
                    width: '160px',
                    height: '100px',
                    horzAlign: 'Left',
                    vertAlign: 'Top'
                },
                desktop: {
                    left: '10px',
                    top: '10px',
                    width: '160px',
                    height: '100px',
                    horzAlign: 'Left',
                    vertAlign: 'Top'
                }
            }

            const newSandbox: Sandbox = {
                ...data,
                id: newId,
                type: 'sandbox',
                name: sandboxName,
                parentId: data.parentId,
                text: data.text || '샌드박스 텍스트',
                prop: data.prop ? { ...defaultProp, ...data.prop } : defaultProp,
            };

            const widget = du.findById(data.parentId, draft);
            if (widget && 'children' in widget && widget.children) {
                widget.children.push(newSandbox);
            }
        });

        return {
            id: newId
        }
    }

    remove(id: string): DocState {
        return this.historyManager.execute((draft) => {
            const widget = du.findById(id, draft);
            if (widget) {
                const parent = du.findById(widget.parentId, draft);
                if (parent && 'children' in parent && parent.children) {
                    parent.children = parent.children.filter((child: Widget) => child.id !== id);
                }
            }
        });
    }

    update(id: string, updates: Partial<Omit<Sandbox, 'id'|'type'|'prop'|'parentId'>>): DocState {
        return this.historyManager.execute((draft) => {
			const widget = du.findById(id, draft);
			if (widget) {
				Object.assign(widget, updates);
			}
        });
    }

    updateProp(id: string, updates: Partial<SandboxPropValue>, breakpoint: BreakPoint): DocState { 
        return this.historyManager.execute((draft) => {
            const widget = du.findById(id, draft);
            if (widget) {
                widget.prop[breakpoint] = {
                    ...widget.prop[breakpoint],
                    ...updates
                };
            }
        });
    }
}
