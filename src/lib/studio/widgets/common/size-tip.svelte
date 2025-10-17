<script lang="ts">
	import type { SizeConstraints } from '$lib/studio/types';

    interface Props {
        prop: { width: string; height: string; sizeConstraints: SizeConstraints | undefined };
    }

	let { prop }: Props = $props();

	let sizeInfo = $derived.by(() => {
		const constraints = prop.sizeConstraints;

		let widthDisplay = stripUnit(prop.width);
		let heightDisplay = stripUnit(prop.height);

		// width constraint 추가
		if (constraints?.hugContentsWidth) {
			widthDisplay += ' Hug';
		} else if (constraints?.fullWidth) {
			widthDisplay += ' Fill';
		}

		// height constraint 추가
		if (constraints?.hugContentsHeight) {
			heightDisplay += ' Hug';
		} else if (constraints?.fullHeight) {
			heightDisplay += ' Fill';
		}

		return `${widthDisplay} x ${heightDisplay}`;
	});

	function stripUnit(value: string) {
		return value.replace('px', '');
	}
</script>

<div class="absolute bottom-[-24px] left-0 z-10 w-full">
	<div class="relative flex w-full justify-center">
		<div
			class="flex items-center justify-center rounded-xs bg-blue-400 px-2 pb-[2px] text-xs whitespace-nowrap text-white user-select-none"
		>
			{sizeInfo}
			<!-- {stripUnit(prop.width)} x {stripUnit(prop.height)} -->
		</div>
	</div>
</div>
