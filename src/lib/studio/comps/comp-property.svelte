<script lang="ts">  
    import type { Sandbox } from "$lib/studio/widgets/sandbox/sandbox.type";
    import type { Cmd } from "$lib/studio/command";
    import type { Context } from "$lib/studio/context.svelte";
    import ShowcaseCompProperty from "./showcase/showcase.cproperty.svelte";

    interface Props {
            data: Sandbox;
            cmd: Cmd;
            context: Context;

    }
    let { data, cmd, context }: Props = $props();

</script>

<div class='px-3 py-4 text-xs border-b border-gray-200'>
    <div>컴포넌트 : {data.componentId}</div>

    {#if data.componentId === "showcase1"}
        <ShowcaseCompProperty data={data} cmd={cmd} context={context} />
    {/if}
</div>
