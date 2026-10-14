import { BoardService } from '../../../features/board/services/board.service';
import { Board } from '../../../features/board/interface/board.interface';
import { NavigationEnd, Router } from '@angular/router';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CreateTaskComponent } from '../../../features/board/components/create-task/create-task.component';
import { CreateBoardComponent } from '../../../features/board/components/create-board/create-board.component';
import {filter, Subscription} from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CreateTaskComponent, CreateBoardComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {

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

   private routerSub?:Subscription;
    private boardsChangedSub?:Subscription;

  ngOnInit(): void {
    this.updateBoardName();

    this.routerSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updateBoardName();
    });

  this.boardsChangedSub = this.boardService.boardsChanged.subscribe(() => {
      this.updateBoardName();
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.boardsChangedSub?.unsubscribe();
  }

  //show selected board name
  updateBoardName(): void {
    const id = this.boardService.getCurrentBoardId()
    const board = this.boardService.getBoardById(id);
    this.boardName = board?.name ?? '';
  }


  //toggle the dots menu
   toggleDotsMenu(): void {
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
  const id = this.boardService.getCurrentBoardId();
  const board = this.boardService.getBoardById(id);
      if (!board) return;

        const confirmed = confirm(`Are you sure you want to delete "${board.name}"? `);
  if (!confirmed) return;

    this.boardService.deleteSelectedBoard(id);
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
    const id = this.boardService.getCurrentBoardId()
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


