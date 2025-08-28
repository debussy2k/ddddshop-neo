export interface Section {
    id: number;
    name: string;
    type: string;
    content?: any;
}

export interface DocState {
    sections: Section[];
}

export interface HistoryInfo {
    pastCount: number;
    futureCount: number;
    canUndo: boolean;
    canRedo: boolean;
}
