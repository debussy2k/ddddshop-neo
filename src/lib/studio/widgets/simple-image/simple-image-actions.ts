import { nanoid } from 'nanoid';
import type HistoryManager from "../../history-manager";
import type { DocState, Section } from "../../types";
import { SectionActions } from "../section/section-actions";

export interface SimpleImage {
    id: string;
    type: 'simple-image';
    name: string;
    url: string;
    alt?: string;
    width?: string;
    height?: string;
    parentId?: string; // Section의 child로 사용될 때의 부모 ID
}

// SimpleImage 생성시 사용하는 타입 (name은 선택적)
export type SimpleImageInput = Omit<SimpleImage, 'id' | 'type' | 'name'> & {
    name?: string;
};

export class SimpleImageActions {
    private sectionActions: SectionActions;

    constructor(private historyManager: HistoryManager<DocState>) {
        this.sectionActions = new SectionActions(historyManager);
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
                url: simpleImage.url || '',
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
