import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Task } from '../../interface/board.interface';
import { BoardService } from './../../services/board.service';

@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
})
export class CreateTaskComponent implements OnInit, OnChanges {


  @Input() isOpen = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() taskCreated = new EventEmitter<void>();

  @Input() taskToEdit: Task | undefined;

  statusOptions: string[] = [];
  subtasks: string[] = [''];

  taskForm: FormGroup;
  constructor(
    private boardService: BoardService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['', Validators.required],
    });

  }


  ngOnInit(): void {
    const id = Number(this.router.url.split('/').pop());
    const board = this.boardService.getBoardById(id);

    if (board && board.columns?.length) {
      this.statusOptions = board.columns.map((col) => col.name);

      if (!this.taskToEdit) {
        this.taskForm.get('status')?.setValue(
          this.statusOptions[0]
        );
      }
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.loadTaskData();
    }
  }
  //Add an empty column
  addSubtask(): void {
    this.subtasks.push('');
  }

  //Remove a column
  removeSubtask(index: number): void {
    this.subtasks.splice(index, 1);
  }

  // Closes the modal when the user clicks the overlay
  onOverlayClick(event: MouseEvent): void {

    if (event.target === event.currentTarget) {
      this.closeModal.emit();
    }

  }




  //load task data
  loadTaskData(): void {
    if (!this.taskToEdit) return;


    this.taskForm.setValue({
      title: this.taskToEdit.title,
      description: this.taskToEdit.description,
      status: this.taskToEdit.status,
    });

    this.subtasks = this.taskToEdit.subtasks.map(
      subtask => subtask.title
    );

  }

  //Validates the form and subtasks
  onCreateTask(): void {

    const isSubtasksValid = this.subtasks.length > 0 &&
      this.subtasks.every(subtask => subtask.trim().length > 0);

    if (!this.taskForm.valid || !isSubtasksValid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const boardId = Number(this.router.url.split('/').pop());
    if (this.taskToEdit) {
      this.boardService.updateTask(
        boardId,
        this.taskToEdit.id,
        this.taskForm.value.title,
        this.taskForm.value.description,
        this.taskForm.value.status,
        this.subtasks
      );
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        status: this.taskForm.value.status,
        subtasks: this.subtasks.map(title => ({
          id: Date.now() + Math.floor(Math.random() * 100000),
          title,
          completed: false
        }))
      };

      this.boardService.addTaskToBoard(boardId, newTask);
    }

    this.taskCreated.emit();

    this.closeModal.emit();

    this.taskForm.reset();

    this.subtasks = [''];
  }
}



