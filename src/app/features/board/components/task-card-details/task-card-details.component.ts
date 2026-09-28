import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Task } from '../../interface/board.interface';
import { BoardService } from '../../services/board.service';
import { CreateTaskComponent } from '../create-task/create-task.component';

@Component({
  selector: 'app-task-card-details',
  imports: [CreateTaskComponent],
  templateUrl: './task-card-details.component.html',
  styleUrl: './task-card-details.component.scss',
})
export class TaskCardDetailsComponent {

  constructor(
    private boardService: BoardService,

  ) { }

  @Input() isOpen = false;
  @Input() boardId!: number;
  @Input() task!: Task;
  @Input() statusOptions: string[] = [];

  @Output() closeModal = new EventEmitter<void>();

  isMenuOpen = false;

  isDotsMenuOpen = false;

  isTaskModalOpen = false;
  taskToEdit: Task | undefined;

  getCompletedCount(): number {
    return this.task.subtasks.filter(s => s.completed).length;
  }


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Close the modal when the user clicks the overlay
  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.isMenuOpen = false;
      this.closeModal.emit();
    }
  }

  //completed state of the given subtask
  toggleSubtask(subtaskId: number): void {
    this.boardService.toggleSubtaskCompleted(this.boardId, this.task.id, subtaskId);
  }

  // moves the task to the new column
  onStatusChange(event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.boardService.updateTaskStatus(this.boardId, this.task.id, newStatus);
    this.closeModal.emit();
  }


  //toggle the dots menu
  toggleDotsMenu(): void {
    this.isDotsMenuOpen = !this.isDotsMenuOpen;
  }

  //Delete the current task
  deleteTask(): void {
    this.boardService.deleteTask(this.boardId, this.task.id);
    this.isMenuOpen = false;
    this.closeModal.emit();
  }



  // open the edit task modal
  openEditTask(): void {
    this.taskToEdit = this.task;
    this.isTaskModalOpen = true;
    this.isDotsMenuOpen = false;
  }
  // close the edit task modal
  closeTaskModal(): void {
    this.isTaskModalOpen = false;
    this.taskToEdit = undefined;
    this.closeModal.emit();
  }
}