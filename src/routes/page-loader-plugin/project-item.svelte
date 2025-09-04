<script lang="ts">
	import type { ClassValue } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Button } from "$lib/components/ui/button/index.js";

	interface Props {
		class?: ClassValue;
		project: any;
		onSelectAll?: (project: any) => void;
		onSelectPartial?: (project: any) => void;
	}

	let { class: className, project, onSelectAll, onSelectPartial }: Props = $props();

	function getProductOptionName(productOptions: any[], optionName: string) {
		return productOptions.find((option) => option.displayName === optionName)?.displayValue;
	}

	function getDateTime(date: string) {
		return new Date(date).toLocaleDateString('ko-KR', { 
			year: 'numeric', 
			month: '2-digit', 
			day: '2-digit', 
			hour: '2-digit', 
			minute: '2-digit' 
		});
	}

	function handleSelectAll() {
		if (onSelectAll) {
			onSelectAll(project);
		}
	}

	function handleSelectPartial() {
		if (onSelectPartial) {
			onSelectPartial(project);
		}
	}
</script>

<div class={cn('p-4 border border-gray-200', className || '')}>
	<div class='flex gap-x-4'>
		<!-- 썸네일 -->
		<div>
			<img 
				src={project.thumbnailUrl} 
				alt={project.title} 
				class='w-26 h-26 object-contain border border-gray-200' 
			/>
		</div>

		<!-- 상세정보 -->
		<div class='flex flex-1'>
			<!-- 왼쪽 상세정보 -->
			<div class='flex flex-col gap-1 flex-1'>
				<div class="text-lg font-bold">{project.title}</div>
				<div>
					초대 계정(ID): {project.childUserLoginId} | {project.childUserDisplayName}
				</div>
				<div class='flex'>
					<div class='bg-gray-200 border border-gray-300 px-1 rounded-xs mr-2'>판형</div>
					{getProductOptionName(project.productOptions, '판형')}
				</div>
				<div>
					수정 : {getDateTime(project.modificationDate)}
				</div>
			</div>

			<!-- 오른쪽 액션 버튼들 -->
			<div class='w-[120px] flex-shrink-0 flex items-center'>
				<div class="flex flex-col gap-2">
					<div class="flex justify-start items-center">
						<Checkbox id="selectAll-{project.edicusProjectId}" onchange={handleSelectAll} />
						<label
							for="selectAll-{project.edicusProjectId}"
							class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-2"
						>
							전체 선택
						</label>
					</div>
					<div>
						<Button variant="outline" onclick={handleSelectPartial}>
							일부만 선택
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if project.tnUrls && project.tnUrls.length > 0}
		<div class='flex gap-2 mt-2 overflow-x-auto'>
			{#each project.tnUrls as tnUrl, index}
				<div class="flex flex-col items-center">
					<img 
						src={tnUrl} 
						alt={project.title} 
						class='w-26 h-26 object-contain border border-gray-200 max-w-[200px] max-h-[200px]' 
					/>
					<div class='text-sm'>
						{index + 1}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
