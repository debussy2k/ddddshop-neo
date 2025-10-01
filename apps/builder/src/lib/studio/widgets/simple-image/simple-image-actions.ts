import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Section, Widget } from "../../types";
import type { SimpleImage, SimpleImageInput, SimpleImagePropValue } from "./simple-image.type";
import type { BreakPoint } from '$lib/studio/breakpoint-man.svelte';
import * as du from '../common/doc-util';

export class SimpleImageActions {

    constructor(private historyManager: HistoryManager<DocState>) {
    }

    // 자동 SimpleImage 이름 생성 - 모든 위젯에서 SimpleImage 검색
    private generateSimpleImageName(draft: DocState): string {
        const allSimpleImages: Widget[] = [];
        
        // 재귀적으로 모든 위젯에서 simple-image 찾기
        function findSimpleImages(widgets: Widget[] | undefined) {
            if (!widgets) return;
            
            for (const widget of widgets) {
                if (widget.type === 'simple-image') {
                    allSimpleImages.push(widget);
                }
                if ('children' in widget && widget.children) {
                    findSimpleImages(widget.children);
                }
            }
        }
        
        findSimpleImages(draft.sections);
        
        const simpleImageNumbers = allSimpleImages
            .map(s => s.name)
            .filter(name => /^이미지 \d+$/.test(name))
            .map(name => parseInt(name.replace('이미지 ', '')))
            .filter(num => !isNaN(num));
        
        const maxNumber = simpleImageNumbers.length > 0 ? Math.max(...simpleImageNumbers) : 0;
        return `이미지 ${maxNumber + 1}`;
    }

    add(data: SimpleImageInput): { id: string } {
        if (!data.parentId) {
            throw new Error('parentId is required');
        }
        
        const newId = nanoid();

        this.historyManager.execute((draft) => {
            // 모든 위젯에서 기존 simple-image 이름 검색
            const simpleImageName = data.name?.trim() || this.generateSimpleImageName(draft);
            
            const newSimpleImage: SimpleImage = {
                ...data,
                id: newId,
                type: 'simple-image',
                name: simpleImageName,
                parentId: data.parentId,
                url: data.url || 'https://cdn.sanity.io/images/v6z6vmuj/production/3fbb8957ea4c9f043d3935ed7aab9984d259971f-500x500.png?w=500&h=500&fit=crop&auto=format',
                alt: data.alt || '이미지',
                prop: {
                    mobile: {
                        left: data.prop?.mobile?.left || '10px',
                        top: data.prop?.mobile?.top || '10px',
                        width: data.prop?.mobile?.width || '300px',
                        height: data.prop?.mobile?.height || '200px'
                    },
                    tablet: {
                        left: data.prop?.tablet?.left || '10px',
                        top: data.prop?.tablet?.top || '10px',
                        width: data.prop?.tablet?.width || '300px',
                        height: data.prop?.tablet?.height || '200px'
                    },
                    desktop: {
                        left: data.prop?.desktop?.left || '10px',
                        top: data.prop?.desktop?.top || '10px',
                        width: data.prop?.desktop?.width || '300px',
                        height: data.prop?.desktop?.height || '200px'
                    }
                },
            };

            const widget = du.findById(data.parentId, draft);
            if (widget && 'children' in widget && widget.children) {
                widget.children.push(newSimpleImage);
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

    update(id: string, updates: Partial<Omit<SimpleImage, 'id'|'type'|'prop'|'parentId'>>): DocState {
        return this.historyManager.execute((draft) => {
            const widget = du.findById(id, draft);
            if (widget) {
                Object.assign(widget, updates);
            }
        });
    }

    updateProp(id: string, updates: Partial<SimpleImagePropValue>, breakpoint: BreakPoint): DocState { 
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
