import { studioDoc } from './studio-doc.svelte';
import { SectionActions } from "./widgets/section/section-actions";

export let cmdSection = new SectionActions(studioDoc.historyManager)
