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