import { studioDoc } from './studio-doc.svelte';
import { SectionActions } from "./widgets/section/section-actions";
import { SandboxActions } from "./widgets/sandbox/sandbox-actions";

export let cmdSection = new SectionActions(studioDoc.historyManager)
export let cmdSandbox = new SandboxActions(studioDoc.historyManager)
