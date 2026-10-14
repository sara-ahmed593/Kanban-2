import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Board, Task } from '../interface/board.interface';
import { StorageService } from '../../../core/services/storage.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BoardService {

  constructor(
    private storageService: StorageService,
    private router: Router

  ) { }

  boards: Board[] = [];

  selectedBoard: Board | undefined;

  boardsChanged = new Subject<void>();


  loadBoards(): void {
    this.boards =
      this.storageService.getItem('boards') ?? [];
  }



  saveBoards(): void {
    this.storageService.setItem('boards', this.boards);
    this.boardsChanged.next();
  }


  // Boards
  //--------------------------------

  // Add a new board 
  addBoard(board: Board): void {
    this.boards.push(board);
    this.saveBoards();
  }


  // return all boards 
  getBoards(): Board[] {
    this.loadBoards();
    return this.boards;
  }


  //Sets the currently selected board 
  setSelectedBoard(board: Board): void {
    this.selectedBoard = board;
  }

  //Finds a board by its id
  getBoardById(id: number): Board | undefined {
    return this.boards.find(board => board.id === id);
  }

  // Remove the selected board 
  deleteSelectedBoard(id: number): void {
    this.loadBoards(); 

    this.boards = this.boards.filter(
      board => board.id !== id
    );
    this.saveBoards();

    this.selectedBoard = undefined;

  }


  //change data in board
  updateBoard(boardId: number, name: string, columnNames: string[]): void {

    const board = this.getBoardById(boardId);

    if (!board) {
      return;
    }

    board.name = name;

    board.columns = columnNames.map((columnName, index) => ({
      id: index + 1,
      name: columnName,
      tasks: board.columns[index]?.tasks ?? []
    }));

    this.saveBoards();

  }



  // Tasks
  //--------------------------------

  // add a new task 
  addTaskToBoard(boardId: number, task: Task): void {

    const board = this.getBoardById(boardId);

    if (!board) {
      return;
    }

    const column = board.columns.find(
      column => column.name === task.status
    );

    if (!column) {
      return;
    }

    column.tasks.push(task);

    this.saveBoards();

  }


  // Completed state of subtasks
  toggleSubtaskCompleted(boardId: number, taskId: number, subtaskId: number): void {

    const board = this.getBoardById(boardId);
    if (!board) return;

    for (const column of board.columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        const subtask = task.subtasks.find(s => s.id === subtaskId);
        if (subtask) {
          subtask.completed = !subtask.completed;
        }
        break;
      }
    }

    this.saveBoards();

  }



  //Move task to a different status

  updateTaskStatus(boardId: number, taskId: number, newStatus: string): void {

    const board = this.getBoardById(boardId);
    if (!board) return;

    let movedTask: Task | undefined;

    for (const column of board.columns) {
      const index = column.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        movedTask = column.tasks[index];
        column.tasks.splice(index, 1);
        break;
      }
    }

    if (!movedTask) return;

    movedTask.status = newStatus;
    const targetColumn = board.columns.find(c => c.name === newStatus);
    if (targetColumn) {
      targetColumn.tasks.push(movedTask);
    }

    this.saveBoards();

  }


  // Delete selected task
  deleteTask(boardId: number, taskId: number): void {
    const board = this.getBoardById(boardId);
    if (!board) return;

    for (const column of board.columns) {
      const index = column.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        column.tasks.splice(index, 1);
        break;
      }
    }

    this.saveBoards();

  }


  // change data in the task 
  updateTask(boardId: number, taskId: number, title: string, description: string, status: string, subtaskTitles: string[]): void {
    const board = this.getBoardById(boardId);
    if (!board) return;

    let existingTask: Task | undefined;

    for (const column of board.columns) {
      const index = column.tasks.findIndex(t => t.id === taskId);
      if (index !== -1) {
        existingTask = column.tasks[index];
        column.tasks.splice(index, 1);
        break;
      }
    }

    if (!existingTask) return;

    const oldSubtasks = existingTask.subtasks;

    existingTask.title = title;
    existingTask.description = description;
    existingTask.status = status;
    existingTask.subtasks = subtaskTitles.map((subTitle, index) => ({
      id: oldSubtasks[index]?.id ?? Date.now() + index,
      title: subTitle,
      completed: oldSubtasks[index]?.completed ?? false
    }));

    const targetColumn = board.columns.find(c => c.name === status);
    if (targetColumn) {
      targetColumn.tasks.push(existingTask);
    }

    this.saveBoards();

  }

  getCurrentBoardId() {
  const url = this.router.url;
  const id = Number(url.split('/').pop());
 return id
}
}
