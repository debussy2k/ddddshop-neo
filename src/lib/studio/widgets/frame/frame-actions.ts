import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Section, Widget } from "../../types";
import type { Frame, FrameInput, FramePropValue } from "./frame.type";
import type { BreakPoint } from '$lib/studio/breakpoint-man.svelte';
import { du } from '../common/doc-util';

export class FrameActions {

    constructor(private historyManager: HistoryManager<DocState>) {
    }

    // 자동 Frame 이름 생성 - 모든 Section의 children에서 Frame 검색
    private generateFrameName(sections: Section[]): string {
        const allFrames = sections.flatMap(section => section.children || []);
        const frameNumbers = allFrames
            .map(s => s.name)
            .filter(name => /^프레임 \d+$/.test(name))
            .map(name => parseInt(name.replace('프레임 ', '')))
            .filter(num => !isNaN(num));
        
        const maxNumber = frameNumbers.length > 0 ? Math.max(...frameNumbers) : 0;
        return `프레임 ${maxNumber + 1}`;
    }

    add(data: FrameInput): { id: string } {
        const newId = nanoid();

        this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 기존 frame 이름 검색
            const frameName = data.name?.trim() || this.generateFrameName(draft.sections);
            
            const defaultProp:Frame['prop'] = {
                mobile: {
                    layout: 'block',
                    left: '10px',
                    right: 'auto',
                    width: '200px',
                    centerOffsetX: 0,
                    top: '10px',
                    bottom: 'auto',
                    height: '150px',
                    horzAlign: 'left',
                    vertAlign: 'top',
                    centerOffsetY: 0,
                    padding: '16px',
                },
                tablet: {
                    layout: 'block',
                    left: '10px',
                    right: 'auto',
                    width: '200px',
                    centerOffsetX: 0,
                    top: '10px',
                    bottom: 'auto',
                    height: '150px',
                    horzAlign: 'left',
                    vertAlign: 'top',
                    centerOffsetY: 0,
                    padding: '16px',                
                },
                desktop: {
                    layout: 'block',
                    left: '10px',
                    right: 'auto',
                    width: '200px',
                    centerOffsetX: 0,
                    top: '10px',
                    bottom: 'auto',
                    height: '150px',
                    horzAlign: 'left',
                    vertAlign: 'top',
                    centerOffsetY: 0,
                    padding: '16px',
                }
            }

            const newFrame: Frame = {
                ...data,
                id: newId,
                type: 'frame',
                name: frameName,
                children: [],
                prop: data.prop ? { ...defaultProp, ...data.prop } : defaultProp,
            };

            // 부모 Section이 지정되어 있으면 해당 Section의 child로 추가
            if (data.parentId) {
                const widget = du.findById(data.parentId, draft);
                if (widget && 'children' in widget && widget.children) {
                    widget.children.push(newFrame);
                }
            }
        });

        return {
            id: newId
        }
    }

    remove(id: string): DocState {
        return this.historyManager.execute((draft) => {
            let widget = du.findById(id, draft);
            if (widget) {
                let parent = du.findById(widget.parentId, draft);
                if (parent && 'children' in parent && parent.children) {
                    parent.children = parent.children.filter((child:Widget) => child.id !== id);
                }
            }
        });
    }

    update(id: string, updates: Partial<Omit<Frame, 'id'|'type'|'prop'>>): DocState {
        return this.historyManager.execute((draft) => {
            let widget = du.findById(id, draft);

            if (widget) {
                Object.assign(widget, updates);
            }
        });
    }

    updateProp(id: string, updates: Partial<FramePropValue>, breakpoint: BreakPoint): DocState { 
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
