import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Section, Widget } from "../../types";
import type { Frame, FrameInput } from "./frame.type";
import type { BreakPoint } from '$lib/studio/breakpoint-man.svelte';

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

    addFrame(data: FrameInput): { id: string } {
        const newId = nanoid();

        this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 기존 frame 이름 검색
            const frameName = data.name?.trim() || this.generateFrameName(draft.sections);
            
            const defaultProp:Frame['prop'] = {
                mobile: {
                    layout: 'block',
                    left: '10px',
                    top: '10px',
                    width: '200px',
                    height: '150px',
                    padding: '16px'
                },
                tablet: {
                    layout: 'block',
                    left: '10px',
                    top: '10px',
                    width: '200px',
                    height: '150px',
                    padding: '16px'
                },
                desktop: {
                    layout: 'block',
                    left: '10px',
                    top: '10px',
                    width: '200px',
                    height: '150px',
                    padding: '16px'
                }
            }

            const newFrame: Frame = {
                ...data,
                id: newId,
                type: 'frame',
                name: frameName,
                prop: data.prop ? { ...defaultProp, ...data.prop } : defaultProp,
            };

            // 부모 Section이 지정되어 있으면 해당 Section의 child로 추가
            if (data.parentId) {
                const section = draft.sections.find(s => s.id === data.parentId);
                if (section) {
                    if (!section.children) {
                        section.children = [];
                    }
                    // 이미 같은 ID의 Frame이 있는지 확인
                    if (!section.children.find((child:Widget) => child.id === newFrame.id)) {
                        section.children.push(newFrame);
                    }
                }
            }
        });

        return {
            id: newId
        }
    }

    removeFrame(id: string): DocState {
        return this.historyManager.execute((draft) => {
            // 모든 Section에서 해당 Frame 제거
            draft.sections.forEach(section => {
                if (section.children) {
                    section.children = section.children.filter((child:Widget) => child.id !== id);
                }
            });
        });
    }

    updateFrame(id: string, updates: Partial<Omit<Frame, 'id'|'type'>>): DocState {
        return this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 해당 Frame 찾아서 업데이트
            draft.sections.forEach(section => {
                if (section.children) {
                    const frameIndex = section.children.findIndex((child:Widget) => child.id === id);
                    if (frameIndex !== -1) {
                        section.children[frameIndex] = {
                            ...section.children[frameIndex],
                            ...updates
                        };
                    }
                }
            });
        });
    }

    updateFrameProp(id: string, updates: Partial<Frame['prop'][keyof Frame['prop']]>, breakpoint: BreakPoint): DocState { 
        return this.historyManager.execute((draft) => {
            draft.sections.forEach(section => {
                if (section.children) {
                    const frameIndex = section.children.findIndex((child:Widget) => child.id === id);
                    if (frameIndex !== -1) {
                        section.children[frameIndex].prop[breakpoint] = {
                            ...section.children[frameIndex].prop[breakpoint],
                            ...updates
                        };
                    }
                }
            });
        });
    }
}
