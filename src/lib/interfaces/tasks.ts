export interface Task{
    id: number,
    title: string,
    status: 'todo' | 'doing' | 'done',
    level: 'low' | 'medium' | 'high' | 'critical',
}
