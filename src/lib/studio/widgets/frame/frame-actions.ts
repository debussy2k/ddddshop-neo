import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Section, Widget, ContainerProp } from "../../types";
import type { Frame, FrameInput, FramePropValue } from "./frame.type";
import type { BreakPoint } from '$lib/studio/breakpoint-man.svelte';
import * as du from '../common/doc-util';

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

    add(input: FrameInput): { id: string } {
        const newId = nanoid();

        this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 기존 frame 이름 검색
            const frameName = input.name?.trim() || this.generateFrameName(draft.sections);
            const parentData = du.findById(input.parentId, draft);
            if (parentData && du.isContainer(parentData)) {
                const defaultProp = this.getDefaultProp(parentData.prop as ContainerProp);

                const newFrame: Frame = {
                    ...input,
                    id: newId,
                    type: 'frame',
                    name: frameName,
                    children: [],
                    prop: input.prop ? { ...defaultProp, ...input.prop } : defaultProp,
                };

                if (parentData && 'children' in parentData && parentData.children) {
                    parentData.children.push(newFrame);
                }
            }
        });

        return {
            id: newId
        }
    }

    private getDefaultProp(parentProp: ContainerProp) {
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
                justifyContent: 'start',
                alignItems: 'start',
                gap: 10,
                verticalGap: 10,
                wrap: false,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                paddingBottom: 10,
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
                justifyContent: 'start',
                alignItems: 'start',
                gap: 10,
                verticalGap: 10,
                wrap: false,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                paddingBottom: 10,
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
                justifyContent: 'start',
                alignItems: 'start',
                gap: 10,
                verticalGap: 10,
                wrap: false,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                paddingBottom: 10,
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
                    parent.children = parent.children.filter((child:Widget) => child.id !== id);
                }
            }
        });
    }

    update(id: string, updates: Partial<Omit<Frame, 'id'|'type'|'prop'>>): DocState {
        return this.historyManager.execute((draft) => {
            const widget = du.findById(id, draft);

            if (widget) {
                Object.assign(widget, updates);
            }
        });
    }

    updateProp(id: string, updates: Partial<FramePropValue>, breakPoint: BreakPoint): DocState { 
        return this.historyManager.execute((draft) => {
            const widget = du.findById(id, draft) as Frame;
            if (widget) {
                const currentProp = widget.prop[breakPoint] as FramePropValue;

                // layout이 변경되면 children의 sizeConstraints를 재설정함
                if (updates.layout && updates.layout !== currentProp.layout) {
                    // studioDoc의 widgetMap 전달
                    du.updateChildrenSizeConstraintsOnLayoutChange(
                        widget.children, 
                        updates.layout, 
                        breakPoint
                    );
                }
				else if (updates.sizeConstraints?.hugContentsWidth !== currentProp.sizeConstraints?.hugContentsWidth && updates.sizeConstraints?.hugContentsWidth === true) {
					// hugContentsWidth가 true로 변경되는 시점
					console.log('hugContentsWidth가 true로 변경되는 시점');
					du.clearChildrenFullWidth(widget.children, breakPoint);
				}

                widget.prop[breakPoint] = {
                    ...widget.prop[breakPoint],
                    ...updates
                };
            }
        });
    }
}
