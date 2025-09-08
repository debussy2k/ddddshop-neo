import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Section } from "../../types";
import type { SimpleImage, SimpleImageInput } from "./simple-image.type";
export class SimpleImageActions {

    constructor(private historyManager: HistoryManager<DocState>) {
    }

    // 자동 SimpleImage 이름 생성 - 모든 Section의 children에서 SimpleImage 검색
    private generateSimpleImageName(sections: Section[]): string {
        const allSimpleImages = sections.flatMap(section => section.children || []);
        const simpleImageNumbers = allSimpleImages
            .filter(s => s.type === 'simple-image')
            .map(s => s.name)
            .filter(name => /^이미지 \d+$/.test(name))
            .map(name => parseInt(name.replace('이미지 ', '')))
            .filter(num => !isNaN(num));
        
        const maxNumber = simpleImageNumbers.length > 0 ? Math.max(...simpleImageNumbers) : 0;
        return `이미지 ${maxNumber + 1}`;
    }

    addSimpleImage(simpleImage: SimpleImageInput): DocState {
        return this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 기존 simple-image 이름 검색
            const simpleImageName = simpleImage.name?.trim() || this.generateSimpleImageName(draft.sections);
            
            const newSimpleImage: SimpleImage = {
                ...simpleImage,
                id: nanoid(),
                type: 'simple-image',
                name: simpleImageName,
                url: simpleImage.url || 'https://cdn.sanity.io/images/v6z6vmuj/production/3fbb8957ea4c9f043d3935ed7aab9984d259971f-500x500.png?w=500&h=500&fit=crop&auto=format',
                alt: simpleImage.alt || '이미지',
                width: simpleImage.width || '300px',
                height: simpleImage.height || '200px'
            };

            // 부모 Section이 지정되어 있으면 해당 Section의 child로 추가
            if (simpleImage.parentId) {
                const section = draft.sections.find(s => s.id === simpleImage.parentId);
                if (section) {
                    if (!section.children) {
                        section.children = [];
                    }
                    // 이미 같은 ID의 SimpleImage가 있는지 확인
                    if (!section.children.find(child => child.id === newSimpleImage.id)) {
                        section.children.push(newSimpleImage);
                    }
                }
            }
        });
    }

    removeSimpleImage(id: string): DocState {
        return this.historyManager.execute((draft) => {
            // 모든 Section에서 해당 SimpleImage 제거
            draft.sections.forEach(section => {
                if (section.children) {
                    section.children = section.children.filter(child => child.id !== id);
                }
            });
        });
    }

    updateSimpleImage(id: string, updates: Partial<Omit<SimpleImage, 'id'|'type'>>): DocState {
        return this.historyManager.execute((draft) => {
            // 모든 Section의 children에서 해당 SimpleImage 찾아서 업데이트
            draft.sections.forEach(section => {
                if (section.children) {
                    const simpleImageIndex = section.children.findIndex(child => child.id === id);
                    if (simpleImageIndex !== -1) {
                        section.children[simpleImageIndex] = {
                            ...section.children[simpleImageIndex],
                            ...updates
                        };
                    }
                }
            });
        });
    }
}
