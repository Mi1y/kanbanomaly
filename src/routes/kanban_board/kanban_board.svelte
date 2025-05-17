<div class="flex gap-4 p-4">
	{#each Object.entries(columns) as [statusColumnKey, tasks]}
		<div
			class="flex-1 bg-gray-50 p-2 rounded-md"
			role="group"
			on:dragover|preventDefault={handleDragOver}
			on:drop={() => handleDrop(statusColumnKey)}
		>

			<h3 class="text-lg font-bold mb-2">{statusColumnKey.toUpperCase()}</h3>

      {#if loading}
        <p>⏳ Loading data...</p>
      {/if}

			{#each tasks as task (task.id)}
				<div
					class={`mb-2 p-2 rounded shadow cursor-grab hover:bg-gray-50 
						${
              statusColumnKey === 'todo' ? 'bg-yellow-200' : 
              statusColumnKey === 'doing' ? 'bg-blue-200' : 
              'bg-green-200'
            }`}
					draggable="true"
					on:dragstart={() => handleDragStart(task, statusColumnKey)}
					role="button"
					tabindex="0"
				>
					{task.title}
				</div>
			{/each}
		</div>
	{/each}
</div>

<script lang="ts">
	import { onMount } from 'svelte';
  import { supabase } from '$lib/database/supabase';
	import type { Task } from '$lib/interfaces/tasks';

	let columns: Record<string, Task[]> = {
		todo: [],
		doing: [],
		done: []
	};

	let activeDraggedTask: Task | null = null;
	let sourceStatusColumn: string | null = null;
  let loading = true;
  
  async function loadData() {
    const { data, error } = await supabase.from("tasks").select("*");
    loading = false;
    if (error) {
      console.error("Missing data", error);
      return;
    }

    columns = {
      todo: data.filter(task => task.status === 'todo'),
      doing: data.filter(task => task.status === 'doing'),
      done: data.filter(task => task.status === 'done'),
    };
  }

  async function updateTaskStatus(id: string, status: string) {
    await supabase.from('tasks').update({ status }).eq('id', id);
  }

  onMount(() => {
		loadData();
	});

	function handleDragStart(task: Task, statusColumnKey: string) {
		activeDraggedTask = task;
		sourceStatusColumn = statusColumnKey;
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function handleDrop(targetColId: string) {
		if (activeDraggedTask && sourceStatusColumn && sourceStatusColumn !== targetColId) {
			columns[sourceStatusColumn] = columns[sourceStatusColumn].filter(t => t.id !== activeDraggedTask!.id);
			columns[targetColId] = [...columns[targetColId], activeDraggedTask!];
			updateTaskStatus(activeDraggedTask.id, targetColId);
		}
		activeDraggedTask = null;
		sourceStatusColumn = null;
	}
</script>