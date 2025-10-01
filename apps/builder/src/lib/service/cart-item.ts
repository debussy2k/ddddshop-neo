import type { CartItemInput, FileContentInput } from './shopicus.api';

interface CartItem extends CartItemInput {
	uuid?: string;
	lockQuantity?: boolean;
	editingType: 'Edicus' | 'FileUpload' | 'RemoveBGService' | 'DesignService' | null;
	allowPDFPolicy: boolean;
	allowInnerPaper: boolean;
	useInnerPaper?: boolean;
	fileContents?: CartItemFile[];
}

interface CartItemFile extends FileContentInput {
	type: 'PDF' | 'InnerPaper' | 'Resource';
	file?: File;
	thumbnailUrl?: string;
}

export { CartItem, CartItemFile };
