<script lang="ts">
    let { prop }: { prop: { width: string, height: string } } = $props();

    function stripUnit(value: string) {
        return value.replace('px', '');
    }

</script>

<div class="absolute left-0 bottom-[-24px] w-full z-10">
    <div class="relative w-full flex justify-center">
        <div class="flex items-center justify-center text-xs bg-blue-400 text-white rounded-xs px-2 pb-[2px] whitespace-nowrap">
            {stripUnit(prop.width)} x {stripUnit(prop.height)}
        </div>
    </div>
</div>