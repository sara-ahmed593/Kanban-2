import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../../features/board/services/board.service';
import { Board } from '../../../features/board/interface/board.interface';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CreateBoardComponent } from '../../../features/board/components/create-board/create-board.component';
import {StorageService} from '../../services/storage.service';


@Component({
  selector: 'app-sidebar',
  imports: [CreateBoardComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  constructor(
    private boardService: BoardService,
    private router: Router,
    private storageService: StorageService,
  ) { }


  boardList: Board[] = [];

  isDarkMode = false;


  isBoardModalOpen = false;

  activeBoardId: number | null = null;

  isSidebarHidden = false;

  //Select a board and navitate to it
  selectBoard(id: number): void {
    const board = this.boardService.getBoardById(id);
    if (board) {
      this.boardService.setSelectedBoard(board);
    }
    this.router.navigate(['/boards', id]);
  }




  ngOnInit(): void {
this.updateStateBoard()
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateStateBoard()
      });



    const savedTheme = this.storageService.getItem('theme');

    if (savedTheme === 'light') {
      this.isDarkMode = false;
      document.documentElement.classList.add('light');
    } else {
      this.isDarkMode = true;
      document.documentElement.classList.remove('light');
    }

  }
private updateStateBoard(): void {
  this.activeBoardId = this.boardService.getCurrentBoardId();
  this.boardList = this.boardService.getBoards();
}


  // toggle light and dark theme
  toggleTheme(): void {

    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.documentElement.classList.remove('light');
      this.storageService.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      this.storageService.setItem('theme', 'light');
    }

  }


  //open create new board
  openBoardModal(): void {
    this.isBoardModalOpen = true;

  }

  //close create new board
  closeBoardModal(): void {
    this.isBoardModalOpen = false;

  }



  //toggle sidebar menu 
  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
