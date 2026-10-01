<script lang="ts">
import { translate, toastActions } from '$lib';
import KeyboardShortcut from '../keyboard_shortcut.svelte';
import type { 
  UnifiedCreateProjectData as CreateProjectData, 
  UnifiedUpdateProjectData as UpdateProjectData, 
  UnifiedProjectView as ProjectView, 
} from '$lib';

let { isOpen = $bindable(), onProjectCreated, onClose, projectEdit = null } = $props<{
  isOpen?: boolean;
  onProjectCreated?: (data: CreateProjectData | UpdateProjectData) => void;
  onClose?: () => void;
  projectEdit?: ProjectView | null;
}>();

let newProjectTitle = $state('');
let newProjectStatus = $state('active');
let newProjectStartDate = $state('');
let newProjectEndDate = $state('');

$effect(() => {
  if (projectEdit) {
    newProjectTitle = projectEdit.title;
    newProjectStatus = projectEdit.status || 'active';
    newProjectStartDate = projectEdit.start_date
      ? typeof projectEdit.start_date === 'string'
        ? projectEdit.start_date.slice(0, 10)
        : projectEdit.start_date.toISOString().slice(0, 10)
      : '';
    newProjectEndDate = projectEdit.end_date
      ? typeof projectEdit.end_date === 'string'
        ? projectEdit.end_date.slice(0, 10)
        : projectEdit.end_date.toISOString().slice(0, 10)
      : '';
  } else {
    newProjectTitle = '';
    newProjectStatus = 'active';
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
      title: newProjectTitle.trim(),
      status: newProjectStatus,
      start_date: newProjectStartDate ? new Date(newProjectStartDate).toISOString() : null,
      end_date: newProjectEndDate ? new Date(newProjectEndDate).toISOString() : null
    };
    onProjectCreated?.(projectData);
    toastActions.success(
      projectEdit 
        ? `${$translate.toasts.other.projectPrefix} ${newProjectTitle} ${$translate.toasts.other.projectSuffixUpdate}` 
        : `${$translate.toasts.other.projectPrefix} ${newProjectTitle} ${$translate.toasts.other.projectSuffixSuccess}`
    );
  } catch {
    toastActions.error($translate.toasts.error.projectsPrepareFailed);
  }
}

function resetForm() {
  newProjectTitle = '';
  newProjectStatus = 'active';
  newProjectStartDate = '';
  newProjectEndDate = '';
}

function closeModal() {
  resetForm();
  onClose?.();
}
</script>

{#if isOpen}
  <KeyboardShortcut onEscape={closeModal} />
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
    <div class="bg-[#0f111a] rounded-xl p-6 w-full max-w-md border border-white/10 shadow-2xl shadow-black/50 relative overflow-hidden">
      <div class="flex items-center justify-between mb-5 pb-3 border-b border-white/5">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <h2 class="text-sm font-semibold text-zinc-100 tracking-tight">
            {projectEdit ? $translate.projects.edit : $translate.projects.new_create}
          </h2>
        </div>
        <button onclick={closeModal} aria-label="Close modal" class="text-zinc-500 hover:text-zinc-300 p-1 rounded-md transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label for="project-title" class="block text-xs font-medium text-zinc-400 mb-1.5">
            {$translate.projects.title}
          </label>
          <input
            id="project-title"
            bind:value={newProjectTitle}
            placeholder={$translate.projects.enter_project_name}
            class="w-full text-xs px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        <div>
          <label for="project-status" class="block text-xs font-medium text-zinc-400 mb-1.5">
            {$translate.projects.status}
          </label>
          <select
            id="project-status"
            bind:value={newProjectStatus} 
            class="w-full text-xs px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="active" class="bg-[#161822]">{$translate.projects.statusLabels.active}</option>
            <option value="inactive" class="bg-[#161822]">{$translate.projects.statusLabels.inactive}</option>
            <option value="ended" class="bg-[#161822]">{$translate.projects.statusLabels.ended}</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label for="start-date" class="block text-xs font-medium text-zinc-400 mb-1.5">
              {$translate.projects.headers.start_date}
            </label>
            <input 
              id="start-date"
              type="date" 
              bind:value={newProjectStartDate} 
              class="w-full text-xs px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
          <div>
            <label for="end-date" class="block text-xs font-medium text-zinc-400 mb-1.5">
              {$translate.projects.headers.end_date}
            </label>
            <input 
              id="end-date"
              type="date" 
              bind:value={newProjectEndDate} 
              class="w-full text-xs px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-4 border-t border-white/5">
          <button
            onclick={closeModal}
            class="px-3.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-colors"
          >
            {$translate.global.cancel}
          </button>
          <button
            onclick={saveProject}
            class="px-4 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm"
          >
            {projectEdit ? $translate.projects.save_changes : $translate.projects.create}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}