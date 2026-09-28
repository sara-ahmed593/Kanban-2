export interface Board {
    id: number;
    name: string;
    columns: BoardColumn[];

}

export interface BoardColumn {
    id: number;
    name: string;
    tasks: Task[];
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    subtasks: Subtask[];
}

export interface Subtask {
    id: number;
    title: string;
    completed: boolean;
}

