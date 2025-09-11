import { studioDoc } from './studio-doc.svelte';
import { SectionActions } from "./widgets/section/section-actions";
import { SandboxActions } from "./widgets/sandbox/sandbox-actions";
import { SimpleImageActions } from "./widgets/simple-image/simple-image-actions";
import { ShowcaseActions } from './widgets/showcase/showcase-actions';

export let cmdSection = new SectionActions(studioDoc.historyManager)
export let cmdSandbox = new SandboxActions(studioDoc.historyManager)
export let cmdSimpleImage = new SimpleImageActions(studioDoc.historyManager)
export let cmdShowcase = new ShowcaseActions(studioDoc.historyManager)
