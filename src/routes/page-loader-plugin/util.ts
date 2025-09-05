import { pluginStore } from './plugin.store.svelte';

// 내지 사이즈 확인 함수
export function isInnerPageSize(edicusPsCode: string) {
    let sizeCode = edicusPsCode.split('@')[0];
    return sizeCode === pluginStore.innerPageSizeCode;
}


// edicus project의 썸네일 이미지 주소를 조립한다.
export function getTnUrl(project: any, index: number) {
    let partnerId = 'tville';
    let timeStamp = new Date(project.modificationDate).getTime();
    let url = `https://storage.googleapis.com/edicusbase.appspot.com/partners/${partnerId}/users/${partnerId}-${project.authorGuid}/projects/${project.edicusProjectId}/preivew/preview_${index}.jpg?ts=${timeStamp}`;
    return url;
}