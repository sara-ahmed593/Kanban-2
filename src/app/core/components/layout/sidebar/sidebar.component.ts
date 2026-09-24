import { Component, inject, OnInit } from '@angular/core';
import { BoardService } from './../../../../features/board/pages/services/board.service';
import { Board } from '../../../../features/board/pages/interface/board.interface';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CreateBoardComponent } from '../../../../features/board/pages/components/create-board/create-board.component';


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
    this.boardList = this.boardService.getBoards();

    const id = Number(this.router.url.split('/').pop());
    this.activeBoardId = id;

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const id = Number(this.router.url.split('/').pop());

        this.activeBoardId = id;
        this.boardList = this.boardService.getBoards();
      });



    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
      this.isDarkMode = false;
      document.documentElement.classList.add('light');
    } else {
      this.isDarkMode = true;
      document.documentElement.classList.remove('light');
    }

  }



  // toggle light and dark theme
  toggleTheme(): void {

    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
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
