import { Board } from '../../interface/board.interface';
import { BoardService } from '../../services/board.service';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-create-board',
  imports: [ReactiveFormsModule],
  templateUrl: './create-board.component.html',
  styleUrl: './create-board.component.scss',
})
export class CreateBoardComponent implements OnInit {


  columnList: string[] = [
    'Todo',
    'In-progress',
    'Done'
  ];

  @Input() isOpen = false;

  @Output() closeModal = new EventEmitter<void>();
  @Input() boardToEdit: Board | undefined;

  boardForm: FormGroup;

  constructor(
    private boardService: BoardService,
    private fb: FormBuilder,
  ) {
    this.boardForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],

    });
  }


  ngOnInit(): void {
    this.loadBoardData();
  }



  // Close the modal when the user clicks the overlay
  onOverlayClick(event: MouseEvent): void {

    if (event.target === event.currentTarget) {
      this.closeModal.emit();
    }

  }

  //Add an empty column
  addNewColumn(): void {
    this.columnList.push('');
  }


  //Remove a column
  removeColumn(index: number): void {
    this.columnList.splice(index, 1);
  }

  // Fill the form with the selected board data
  loadBoardData(): void {
    if (!this.boardToEdit) return;

    this.boardForm.get('name')?.setValue(this.boardToEdit.name);

    this.columnList = this.boardToEdit.columns.map(
      column => column.name
    );
  }


  //Validates the submited form 
  createNewBoard(): void {

    const isColumnsValid = this.columnList.length > 0 &&
      this.columnList.every(
        col => col.trim().length > 0
      );


    if (!this.boardForm.valid || !isColumnsValid) {
      this.boardForm.markAllAsTouched();
      console.log(this.boardForm.value)
      return
    };

    if (this.boardToEdit) {


      this.boardService.updateBoard(
        this.boardToEdit.id,
        this.boardForm.value.name,
        this.columnList
      );

    } else {


      const newBoard = {
        id: Date.now(),
        name: this.boardForm.value.name,
        columns: this.columnList.map((columnName, index) => ({
          id: index + 1,
          name: columnName,
          tasks: []
        }))
      };

      this.boardService.addBoard(newBoard);
    }

    this.closeModal.emit();
  }
}
