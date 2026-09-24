import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dash-board-layout',
  imports: [SidebarComponent, NavbarComponent, RouterOutlet],
  templateUrl: './dash-board-layout.component.html',
  styleUrl: './dash-board-layout.component.scss',
})
export class DashBoardLayoutComponent { }
