export type ToastType = "success" | "error" | "info" | "warning";


export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration: number; 
    isConfirm?: boolean;    
    onConfirm?: () => void; 
    onCancel?: () => void;
}

export interface CreateToastData {
    message: string;
    type: ToastType;
    duration: number;
}

export interface ConfirmToastData {
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
}