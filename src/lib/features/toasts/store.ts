import { writable } from 'svelte/store';
import type { Toast, CreateToastData} from '$lib'

const _toasts = writable<Toast[]>([]);

const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();
export const toasts = {
    subscribe: _toasts.subscribe,
    set: _toasts.set,
    update: _toasts.update
};

export const toastActions = {
    show(data: CreateToastData) {
        const id = crypto.randomUUID();
        const toast: Toast = {
            id,
            message: data.message,
            type: data.type,
            duration: data.duration ?? 3000, 
        };

        _toasts.update(toasts => [...toasts, toast]);
        activeTimers.set(id, setTimeout(() => this.remove(id), toast.duration));
        return id;
    },

    remove(toastId: string) {
        const timerId = activeTimers.get(toastId);
        if (timerId) {
            clearTimeout(timerId);
            activeTimers.delete(toastId);
        }
        _toasts.update(toasts => toasts.filter(toast => toast.id !== toastId));
    },
    success(message: string, duration?: number) {
        return this.show({ message, type: 'success', duration: duration ?? 3000 });
    },
    error(message: string, duration?: number) {
        return this.show({ message, type: 'error', duration: duration ?? 3000 });
    },
    info(message: string, duration?: number) {
        return this.show({ message, type: 'info', duration: duration ?? 3000 });
    },
    warning(message: string, duration?: number) {
        return this.show({ message, type: 'warning', duration: duration ?? 3000 });
    },
    pause(toastId: string) {
        const timerId = activeTimers.get(toastId);
        if (timerId) {
            clearTimeout(timerId);
            activeTimers.delete(toastId);
        }
    },
    resume(toastId: string, remainingDuration: number) {
        const newTimerId = setTimeout(() => this.remove(toastId), remainingDuration);
        activeTimers.set(toastId, newTimerId);
    },
    confirm(message: string): Promise<boolean> {
        return new Promise((resolve) => {
            const id = crypto.randomUUID();
            const toast: Toast = {
                id,
                message,
                type: 'info',
                duration: 0,
                isConfirm: true,
                onConfirm: () => {
                    resolve(true);
                    this.remove(id);
                },
                onCancel: () => {
                    resolve(false);
                    this.remove(id);
                },
            };

            _toasts.update(toasts => [...toasts, toast]);
        });
    }
}