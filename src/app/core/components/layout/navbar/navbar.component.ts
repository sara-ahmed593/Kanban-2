import { BoardService } from './../../../../features/board/pages/services/board.service';
import { Board } from '../../../../features/board/pages/interface/board.interface';
import { Router } from '@angular/router';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CreateTaskComponent } from '../../../../features/board/pages/components/create-task/create-task.component';
import { CreateBoardComponent } from '../../../../features/board/pages/components/create-board/create-board.component';




@Component({
  selector: 'app-navbar',
  imports: [CreateTaskComponent, CreateBoardComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {

  constructor(
    private boardService: BoardService,
    private router: Router,
  ) { }

  @Output() toggleSidebar = new EventEmitter<void>();

  boardName = '';

  isBoardModalOpen = false;
  boardToEdit: Board | undefined;
  isDotsMenuOpen = false;
  isTaskModalOpen = false;


  ngOnInit(): void {
    this.updateBoardName();

    this.router.events.subscribe(() => {
      this.updateBoardName();
    });

    this.boardService.boardsChanged.subscribe(() => {
      this.updateBoardName();
    });
  }

  //show selected board name
  updateBoardName(): void {
    const url = this.router.url;
    const id = Number(url.split('/').pop());
    const board = this.boardService.getBoardById(id);
    this.boardName = board?.name ?? '';
  }


  //toggle the dots menu
  toggleMenu(): void {
    this.isDotsMenuOpen = !this.isDotsMenuOpen;
  }

  //emit sidebar event
  onSidebarToggle(): void {
    this.toggleSidebar.emit();
  }

  //toggle add task menu 
  toggleTaskModal(): void {
    this.isTaskModalOpen = !this.isTaskModalOpen;
  }

  // delete the selected board
  deleteBoard(): void {
    const board = this.boardService.selectedBoard;
    if (!board) return;


    this.boardService.deleteSelectedBoard();
    this.isDotsMenuOpen = false;

    const remainingBoards = this.boardService.getBoards();
    if (remainingBoards.length > 0) {
      this.router.navigate(['/boards', remainingBoards[0].id]);
    } else {
      this.boardName = '';
      this.router.navigate(['/']);
    }
  }


  // open edit board menu 
  openEditBoard(): void {
    const id = Number(this.router.url.split('/').pop());
    this.boardToEdit = this.boardService.getBoardById(id);
    this.isBoardModalOpen = true;
    this.isDotsMenuOpen = false;


  }


  // close edit board menu 
  closeBoardModal(): void {
    this.isBoardModalOpen = false;
    this.boardToEdit = undefined;
  }
}


