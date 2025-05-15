<div class="flex gap-4 p-4">
    {#each Object.entries(columns) as [colId, tasks]}
      <div
        class="flex-1 bg-gray-50 p-2 rounded-md"
        role="group"
        on:dragover|preventDefault={handleDragOver}
        on:drop={() => handleDrop(colId)}
      >
        <h3 class="text-lg font-bold mb-2">{colId.toUpperCase()}</h3>
        {#each tasks as task (task.id)}
        <div
            class={`mb-2 p-2 rounded shadow cursor-grab hover:bg-gray-50 flex-1 p-2 rounded-md 
            ${
                    colId === 'todo' ? 'bg-yellow-200' :
                    colId === 'doing' ? 'bg-blue-200' :
                    'bg-green-200'
            }`}
            draggable="true"
            on:dragstart={() => handleDragStart(task, colId)}
            role="button"
            tabindex="0"
        >
            {task.title}
        </div>
        {/each}
      </div>
    {/each}
  </div>
  
  <script>
    let columns = {
        todo: [
            { id: '1', title: 'Design UI' },
            { id: '2', title: 'Write documentation' }
        ],
        doing: [
            { id: '3', title: 'Implement feature X' }
        ],
        done: [
            { id: '4', title: 'Deploy to production' }
        ]
    };
    
    let draggedTask = null;
    let sourceColumn = null;
  
    function handleDragStart(task, colId) {
      draggedTask = task;
      sourceColumn = colId;
    }
  
    function handleDragOver(event) {
      event.preventDefault();
    }
  
    function handleDrop(targetColId) {
      if (draggedTask && sourceColumn !== targetColId) {
        columns[sourceColumn] = columns[sourceColumn].filter(t => t.id !== draggedTask.id);
        columns[targetColId] = [...columns[targetColId], draggedTask];
      }
      draggedTask = null;
      sourceColumn = null;
    }
  </script>
  