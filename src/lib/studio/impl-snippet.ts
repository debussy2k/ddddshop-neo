import type { Snippet } from "svelte";
import type { Widget } from "./types";
import type { Context } from "./context.svelte";

export type ImplSnippet = Snippet<[Widget, Context]>;

