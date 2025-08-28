import { studioDoc } from './studio-doc.svelte';
import { SectionActions } from "./actions/section-actions";

export let cmdSection = new SectionActions(studioDoc.historyManager)
