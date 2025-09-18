<script lang="ts">
    import type { LayoutType } from "../../types"; 
	
	interface Props {
		layout: LayoutType;
		onChange?: (layout: LayoutType) => void;
	}
	
	let { layout, onChange }: Props = $props();

	const options = [
		{
			id: "block",
			label: "Freeform",
			icon: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M11.653 13.008A1.5 1.5 0 0 1 13 14.5v2l-.008.153a1.5 1.5 0 0 1-1.339 1.34L11.5 18h-2l-.153-.008a1.5 1.5 0 0 1-1.34-1.339L8 16.5v-2a1.5 1.5 0 0 1 1.347-1.492L9.5 13h2zM9.5 14a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zm7.153-5.992A1.5 1.5 0 0 1 18 9.5v2l-.008.153a1.5 1.5 0 0 1-1.339 1.34L16.5 13h-2l-.153-.008a1.5 1.5 0 0 1-1.34-1.339L13 11.5v-2a1.5 1.5 0 0 1 1.347-1.492L14.5 8h2zM14.5 9a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zM9.653 6.008A1.5 1.5 0 0 1 11 7.5v2l-.008.153a1.5 1.5 0 0 1-1.339 1.34L9.5 11h-2l-.153-.008a1.5 1.5 0 0 1-1.34-1.339L6 9.5v-2a1.5 1.5 0 0 1 1.347-1.492L7.5 6h2zM7.5 7a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5z"></path></svg>`
		},
		{
			id: "flex-col",
			label: "Vertical",
			icon: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M9.654 13.008A1.5 1.5 0 0 1 11 14.5v2l-.008.153a1.5 1.5 0 0 1-1.338 1.34L9.5 18h-2l-.153-.008a1.5 1.5 0 0 1-1.339-1.339L6 16.5v-2a1.5 1.5 0 0 1 1.347-1.492L7.5 13h2zM15.5 6a.5.5 0 0 1 .49.4l.01.1v9.794l1.146-1.146a.501.501 0 0 1 .708.707l-2 2a.5.5 0 0 1-.707 0l-2-2a.5.5 0 0 1 .707-.707L15 16.294V6.5l.01-.1a.5.5 0 0 1 .49-.4m-8 8a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zm2.154-7.992A1.5 1.5 0 0 1 11 7.5v2l-.008.153a1.5 1.5 0 0 1-1.338 1.34L9.5 11h-2l-.153-.008a1.5 1.5 0 0 1-1.339-1.339L6 9.5v-2a1.5 1.5 0 0 1 1.347-1.492L7.5 6h2zM7.5 7a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5z"></path></svg>`
		},
		{
			id: "flex-row",
			label: "Horizontal",
			icon: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M15.147 13.147a.5.5 0 0 1 .707 0l2 2a.5.5 0 0 1 0 .707l-2 2a.5.5 0 0 1-.707-.707L16.293 16H6.5l-.101-.01a.5.5 0 0 1 0-.98L6.5 15h9.793l-1.146-1.146a.5.5 0 0 1 0-.707m-5.493-7.14A1.5 1.5 0 0 1 11 7.5v2l-.007.153a1.5 1.5 0 0 1-1.34 1.34L9.5 11h-2l-.153-.008a1.5 1.5 0 0 1-1.339-1.339L6 9.5v-2a1.5 1.5 0 0 1 1.347-1.492L7.5 6h2zm7 0A1.5 1.5 0 0 1 18 7.5v2l-.007.153a1.5 1.5 0 0 1-1.34 1.34L16.5 11h-2l-.153-.008a1.5 1.5 0 0 1-1.339-1.339L13 9.5v-2a1.5 1.5 0 0 1 1.347-1.492L14.5 6h2zM14.5 7a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zm-7 0a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5z"></path></svg>`
		},
		{
			id: "grid",
			label: "Grid",
			icon: `<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M7.5 7h2c.276 0 .5.224.5.5v2c0 .276-.224.5-.5.5h-2c-.276 0-.5-.224-.5-.5v-2c0-.276.224-.5.5-.5M6 7.5C6 6.672 6.672 6 7.5 6h2c.828 0 1.5.672 1.5 1.5v2c0 .828-.672 1.5-1.5 1.5h-2C6.672 11 6 10.328 6 9.5zM7.5 14h2c.276 0 .5.224.5.5v2c0 .276-.224.5-.5.5h-2c-.276 0-.5-.224-.5-.5v-2c0-.276.224-.5.5-.5m-1.5.5c0-.828.672-1.5 1.5-1.5h2c.828 0 1.5.672 1.5 1.5v2c0 .828-.672 1.5-1.5 1.5h-2c-.828 0-1.5-.672-1.5-1.5zM16.5 7h-2c-.276 0-.5.224-.5.5v2c0 .276.224.5.5.5h2c.276 0 .5-.224.5-.5v-2c0-.276-.224-.5-.5-.5m-2-1c-.828 0-1.5.672-1.5 1.5v2c0 .828.672 1.5 1.5 1.5h2c.828 0 1.5-.672 1.5-1.5v-2c0-.828-.672-1.5-1.5-1.5zm0 8h2c.276 0 .5.224.5.5v2c0 .276-.224.5-.5.5h-2c-.276 0-.5-.224-.5-.5v-2c0-.276.224-.5.5-.5m-1.5.5c0-.828.672-1.5 1.5-1.5h2c.828 0 1.5.672 1.5 1.5v2c0 .828-.672 1.5-1.5 1.5h-2c-.828 0-1.5-.672-1.5-1.5z"></path></svg>`
		}
	];
</script>


<div class="flex flex-col gap-2 text-sm">
    <div>
        레이아웃
    </div>
    <div role="radiogroup" class="flex gap-2 w-full bg-gray-100 rounded-sm">
        {#each options as option}
            <label
                class="flex items-center justify-center flex-1 cursor-pointer transition-colors
                    bg-gray-100 relative rounded-sm box-border
                    [&.selected]:bg-white border border-gray-100 [&.selected]:border-gray-200"
                class:selected={layout === option.id}
                title={option.label}
            >
                <input
                    type="radio"
                    name="segmented-control"
                    bind:group={layout}
                    value={option.id}
                    class="sr-only h-8"
                    aria-checked={layout === option.id}
                    on:change={() => onChange?.(option.id as LayoutType)}
                />
                <span class="w-6 h-6 flex items-center justify-center" aria-hidden="true">
                    {@html option.icon}
                </span>
                <span class="sr-only">{option.label}</span>
            </label>
        {/each}
    </div>
</div>
