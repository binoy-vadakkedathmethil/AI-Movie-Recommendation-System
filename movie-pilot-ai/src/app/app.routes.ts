import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { LayoutComponent } from './shared/components/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  {
    // LayoutComponent renders the sidebar + topbar once and hosts a
    // <router-outlet> — every child route below swaps only the page content,
    // so the shell never re-renders on navigation.
    path: 'app',
    component: LayoutComponent,
    children: [
        {
          path: 'dashboard',
          // canActivate: [authGuard],
            loadComponent: () =>
              import('./features/dashboard/dashboard.component')
                .then(m => m.DashboardComponent)
          },
          {
          path: 'movie/:id',
          loadComponent: () =>
              import('./features/movie-details/movie-details')
                .then(m => m.MovieDetails)
          },

      { path: '**', redirectTo: 'dashboard' }
    ]
  },


  
 
];

