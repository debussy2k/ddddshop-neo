<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import type { PageEnvData } from "@pages/types";

	interface Props {
		class?: ClassValue;
		data: PageEnvData;
	}

	let { class: className, data }: Props = $props();
</script>

<div class={cn('flex flex-col items-center justify-center min-h-[60vh] p-8', className || '')}>
	<div class="text-center space-y-6">
		<div class="text-8xl font-bold text-muted-foreground/30">404</div>
		<h1 class="text-2xl font-semibold text-foreground">페이지를 찾을 수 없습니다</h1>
		<p class="text-muted-foreground max-w-md">
			요청하신 페이지 <code class="px-2 py-1 bg-muted rounded text-sm">{data.path}</code>가 존재하지 않습니다.
		</p>
		<div class="pt-4">
			<a 
				href="/site/{data.tenantSiteKey}/" 
				class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
			>
				홈으로 돌아가기
			</a>
		</div>
	</div>
</div>

