// import { BoardDetailsComponent } from './features/board/pages/board-details/board-details.component';
// import { DashBoardLayoutComponent } from './core/components/layout/dash-board-layout/dash-board-layout.component';
import { Routes } from '@angular/router';





export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('../app/core/components/layout/dash-board-layout/dash-board-layout.component')
                .then(c => c.DashBoardLayoutComponent),
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('../app/features/board/pages/board-details/board-details.component')
                        .then(c => c.BoardDetailsComponent)
            },
            {
                path: 'boards/:id',
                loadComponent: () =>
                    import('../app/features/board/pages/board-details/board-details.component')
                        .then(c => c.BoardDetailsComponent)
            },
        ]
    },
];
// import { Routes } from '@angular/router';
// import { BoardDetailsComponent } from './features/board/pages/board-details/board-details.component';

// export const routes: Routes = [
//     {
//         path: '',
//         loadComponent: () =>
//             import('../app/features/board/pages/board-details/board-details.component')
//                 .then(c => c.BoardDetailsComponent)
//     }, {

//         path: 'boards/:id',
//         loadComponent: () =>
//             import('../app/features/board/pages/board-details/board-details.component')
//                 .then(c => c.BoardDetailsComponent)
//     },

// ];
