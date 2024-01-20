import { Task } from "./task.model";

export interface AlertConfig {
    alertType: AlertType;
    message: string;
    buttonEnabled?: boolean;
    buttonText?: string;
    isAutoDismissable?: boolean;
    autoDismissIn?: number;
    taskData?: Task;
}

export enum AlertType {
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
    Info = 'info'
}