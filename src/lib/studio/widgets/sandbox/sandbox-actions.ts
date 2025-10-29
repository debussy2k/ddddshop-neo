import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Section, Widget, ContainerProp } from "../../types";
import type { Sandbox, SandboxInput, SandboxPropValue } from "./sandbox.type";
import type { BreakPoint } from '$lib/studio/breakpoint-man.svelte';
import * as du from '../common/doc-util';

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

    add(input: SandboxInput): { id: string } {
        if (!input.parentId) {
            throw new Error('parentId is required');
        }
        
        const newId = nanoid();
        this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 기존 sandbox 이름 검색
            const sandboxName = input.name?.trim() || this.generateSandboxName(draft.sections);
            const parentData = du.findById(input.parentId, draft);
            if (parentData) {
                const defaultProp = this.getDefaultProp(parentData.prop as ContainerProp);

                const newSandbox: Sandbox = {
                    ...input,
                    id: newId,
                    type: 'sandbox',
                    name: sandboxName,
                    parentId: input.parentId,
                    text: input.text || '샌드박스 텍스트',
                    prop: input.prop ? { ...defaultProp, ...input.prop } : defaultProp,
                };          
                
                if (parentData && 'children' in parentData && parentData.children) {
                    parentData.children.push(newSandbox);
                }                
            }
        });

        return {
            id: newId
        }
    }

    private getDefaultProp(parentProp: ContainerProp) {
        const defaultProp:Sandbox['prop'] = {
            desktop: {
                left: '10px',
                right: 'auto',
                centerOffsetX: 0,
                top: '10px',
                width: '160px',
                bottom: 'auto',
                height: '100px',
                centerOffsetY: 0,
                horzAlign: 'left',
                vertAlign: 'top',
                backgroundColor: '#d9d9d9',
            },
            mobile: {
            },
            tablet: {
            }
        }

        // 부모의 layout이 flexbox인 경우 sizeConstraints를 부여함.
        du.addDefaultSizeConstraints(defaultProp, parentProp);
        return defaultProp;
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

                // @ts-expect-error - PropByBreakPoint 조건부 타입으로 인한 spread 타입 불일치
                // PropByBreakPoint는 desktop에는 Prop를, mobile/tablet에는 Partial<Prop>를 반환하는데, 이로 인해 spread 연산자 사용 시 TypeScript가 정확한 타입을 추론하지 못함
                widget.prop[breakpoint] = {
                    ...widget.prop[breakpoint],
                    ...updates
                };
            }
        });
    }
}
