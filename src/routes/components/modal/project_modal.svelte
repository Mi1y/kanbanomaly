<script lang="ts">
import { translate, toastActions } from '$lib';
import { 
  type CreateProjectData, 
  type UpdateProjectData, 
  type ProjectView, 
} from '$lib/supabase';

let {isOpen = $bindable(), onProjectCreated, onClose, projectEdit = null} = $props<{
  isOpen?: boolean;
  onProjectCreated?: (data: CreateProjectData | UpdateProjectData) => void;
  onClose?: () => void;
  projectEdit?: ProjectView | null;
}>();

let newProjectTitle = $state('');
let newProjectStatus = $state('');
let newProjectStartDate = $state('');
let newProjectEndDate = $state('');

$effect(() => {
  if (projectEdit) {
    newProjectTitle = projectEdit.title;
    newProjectStatus = projectEdit.status;
    newProjectStartDate = projectEdit.start_date
      ? projectEdit.start_date.slice(0, 10)
      : '';
    newProjectEndDate = projectEdit.end_date
      ? projectEdit.end_date.slice(0, 10)
      : '';
  } else {
    newProjectTitle = '';
    newProjectStatus = '';
    newProjectStartDate = '';
    newProjectEndDate = '';
  }
});

async function saveProject() {
if (!newProjectTitle.trim() || !newProjectStatus) {
  toastActions.warning($translate.toasts.validation.enterProjectName);
  return;
}
try {
  const projectData = {
    title: newProjectTitle,
    status: newProjectStatus,
    start_date: newProjectStartDate ? new Date(newProjectStartDate).toISOString() : null,
    end_date: newProjectEndDate ? new Date(newProjectEndDate).toISOString() : null
  };
  onProjectCreated?.(projectData);
  toastActions.success(
    projectEdit ? `${$translate.toasts.other.projectPrefix} ${newProjectTitle} ${$translate.toasts.other.projectSuffixUpdate}` : `${$translate.toasts.other.projectPrefix} ${newProjectTitle} ${$translate.toasts.other.projectSuffixSuccess}`
  );
} catch {
  toastActions.error($translate.toasts.error.projectsPrepareFailed);
}
}

function resetForm() {
  newProjectTitle = '';
  newProjectStatus = '';
  newProjectStartDate = '';
  newProjectEndDate = '';
}

function closeModal() {
  resetForm();
  onClose?.();
}
</script>

<style>
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scale-in {
    from { opacity: 0; transform: scale(0.9) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  :global(.animate-fade-in) {
    animation: fade-in 0.2s ease-out;
  }
  :global(.animate-scale-in) {
    animation: scale-in 0.2s ease-out;
  }
</style>

{#if isOpen}
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
    <div class="bg-slate-800 rounded-xl p-8 w-full max-w-md border border-purple-500/30 relative overflow-hidden animate-scale-in">
      <div class="bg-gradient-to-br from-purple-600/10 to-transparent"></div>
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white">
            {projectEdit ? $translate.projects.edit : $translate.projects.new_create}
          </h3>
        </div>
          <div class="space-y-5">
            <div>
              <label for="project-title" class="block text-sm font-medium text-slate-300 mb-2">{$translate.projects.title}</label>
              <input
                id="project-title"
                bind:value={newProjectTitle}
                placeholder={$translate.projects.enter_project_name}
                class="p-3 bg-slate-700 border border-purple-400/30 rounded-lg w-full text-white placeholder-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200"
              />
            </div>
            <label for="project-status" class="block text-sm font-medium text-slate-300 mb-2">{$translate.projects.status}</label>
            <select
              bind:value={newProjectStatus} 
              class="p-3 bg-slate-700/60 border border-purple-400/30 rounded-lg text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all"
              >
              
              <option value="active" selected>{$translate.projects.statusLabels.active}</option>
              <option value="inactive">{$translate.projects.statusLabels.inactive}</option>
              <option value="ended">{$translate.projects.statusLabels.ended}</option>
            </select>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="start-date" class="block text-sm font-medium text-slate-300 mb-2">{$translate.projects.headers.start_date}</label>
                <input 
                  id="start-date"
                  type="date" 
                  bind:value={newProjectStartDate} 
                  class="p-3 bg-slate-700 border border-purple-400/30 rounded-lg w-full text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200" 
                />
              </div>
              <div>
                <label for="end-date" class="block text-sm font-medium text-slate-300 mb-2">{$translate.projects.headers.end_date}</label>
                <input 
                  id="end-date"
                  type="date" 
                  bind:value={newProjectEndDate} 
                  class="p-3 bg-slate-700 border border-purple-400/30 rounded-lg w-full text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-all duration-200" 
                />
              </div>
            </div>
              <div class="flex justify-end gap-3 pt-6">
                <button
                  onclick={closeModal}
                  class="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 hover:border-slate-500 transition-all duration-150"
                >
                  {$translate.global.cancel}
                </button>
                <button
                  onclick={saveProject}
                  class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-200 font-medium"
                >
                  {projectEdit ? $translate.projects.save_changes : $translate.projects.create}
                </button>
              </div>
          </div>
      </div>
    </div>
  </div>
{/if}