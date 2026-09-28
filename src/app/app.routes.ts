
import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('../app/core/layout/dash-board-layout/dash-board-layout.component')
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

