export interface Task {
    id: string;
    name: string;
    duedate: string;
    description: string;
    color: string;
    sequence: number;
    priority: number;
    isComplete: boolean;
    completedOn: string;
    completedAt: string;
    dueTime: string;
    createdBy: string;
}
