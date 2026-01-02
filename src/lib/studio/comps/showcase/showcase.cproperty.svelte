<script lang="ts">
    import type { Sandbox } from "$lib/studio/widgets/sandbox/sandbox.type";
    import type { Cmd } from "$lib/studio/command";
    import type { Context } from "$lib/studio/context.svelte";
	import * as du from '$lib/studio/widgets/common/doc-util';
	import type { ShowcaseCompPropValue } from "./showcase.ctype";

    interface Props {
            data: Sandbox;
            cmd: Cmd;
            context: Context;

    }
    let { data, cmd, context }: Props = $props();

    let currentProp = $derived(du.resolveProp<ShowcaseCompPropValue>(data.compProp, context.break));

    function updateShowcaseColumns(newColumns: number) {
        cmd.updateCompProp(data.id, { columns: newColumns }, context.break);
        console.log('updateShowcaseColumns', newColumns);
    }
</script>

<div class='flex gap-2'>
    <div class='w-[120px]'>컬럼 수</div>
    <div class=''>
        <input
            type="number"
            value={currentProp.columns}
            onchange={(e) => updateShowcaseColumns((e.target as HTMLInputElement).valueAsNumber)}
            placeholder="컬럼 수를 입력하세요"
            class="w-full mt-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
    </div>
</div>