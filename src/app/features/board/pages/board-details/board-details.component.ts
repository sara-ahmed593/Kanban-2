import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { Board, Task } from '../../interface/board.interface';
import { TaskCardDetailsComponent } from '../../components/task-card-details/task-card-details.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-board-details',
  imports: [TaskCardDetailsComponent],
  templateUrl: './board-details.component.html',
  styleUrl: './board-details.component.scss',
})
export class BoardDetailsComponent implements OnInit, OnDestroy{

  constructor(
    private boardService: BoardService,
    private route: ActivatedRoute,
  ) { }


  board?: Board;
  currentBoardId: number | null = null;

  selectedTask: Task | null = null;
  isTaskDetailOpen = false;

  private boardsChangedSub?:Subscription;
 
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentBoardId = Number(params.get('id'));
      this.reloadBoard();
    });


    this.boardsChangedSub = this.boardService.boardsChanged.subscribe(() => {
      this.reloadBoard();
    });
  }

 ngOnDestroy(): void {
    this.boardsChangedSub?.unsubscribe();
  }

  reloadBoard(): void {
    if (this.currentBoardId === null) return;
    this.board = this.boardService.getBoardById(this.currentBoardId);
  }

  //gives each column a color
  colors: string[] = [
    '#49C4E5',
    '#8471F2',
    '#67E2AE',
    '#FF9F43',
    '#EA5455',
    '#00CFE8',
    '#7367F0',
    '#28C76F'
  ];

  //Returns a color from the palette
  getColumnColor(index: number): string {
    return this.colors[index % this.colors.length];
  }


  // used as the status dropdown options
  getStatusOptions(): string[] {
    return this.board?.columns.map(c => c.name) ?? [];
  }

  //open the task-details modal
  openTaskDetail(task: Task): void {
    this.selectedTask = task;
    this.isTaskDetailOpen = true;
  }

  // close the task-details modal
  closeTaskDetail(): void {
    this.isTaskDetailOpen = false;
    this.selectedTask = null;
  }


  onDragStart(e: DragEvent, task: Task): void {
    e.dataTransfer?.setData('taskId', task.id.toString());
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();

  }

  onDrop(e: DragEvent, newStatus: string): void {
    e.preventDefault();

    const taskId = Number(
      e.dataTransfer?.getData('taskId')
    );

    if (!taskId || this.currentBoardId === null) {
      return;
    }

    this.boardService.updateTaskStatus(
      this.currentBoardId,
      taskId,
      newStatus
    );

    this.reloadBoard();
  }
}

