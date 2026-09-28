import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-dash-board-layout',
  imports: [SidebarComponent, NavbarComponent, RouterOutlet],
  templateUrl: './dash-board-layout.component.html',
  styleUrl: './dash-board-layout.component.scss',
})
export class DashBoardLayoutComponent { }
