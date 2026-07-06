import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { ownershipGuard } from './core/guards/ownership-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'management/:type',
    loadComponent: () =>
      import('./pages/management/management').then((m) => m.Management),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'dna-management',
    loadComponent: () =>
      import('./pages/dna-management/dna-management').then(
        (m) => m.DnaManagement,
      ),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'user-supply/:maestraId',
    loadComponent: () =>
      import('./pages/user-supply-details/user-supply-details').then(
        (m) => m.UserSupplyDetails,
      ),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'human-design/:userId',
    loadComponent: () =>
      import('./pages/human-design/human-design').then((m) => m.HumanDesign),
    canActivate: [authGuard, ownershipGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/human-design/human-design-home/human-design-home').then(
            (m) => m.HumanDesignHome,
          ),
      },
      {
        path: ':module',
        loadComponent: () =>
          import(
            './pages/human-design/human-design-detail/human-design-detail'
          ).then((m) => m.HumanDesignDetail),
      },
    ],
  },
  {
    path: 'numerology/:userId',
    loadComponent: () =>
      import('./pages/numerology/numerology').then((m) => m.Numerology),
    canActivate: [authGuard, ownershipGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/numerology/home/home').then((m) => m.Home),
      },
      {
        path: ':module',
        loadComponent: () =>
          import(
            './pages/numerology/numerology-detail/numerology-detail'
          ).then((m) => m.NumerologyDetail),
      },
    ],
  },
  {
    path: 'astrology/:userId',
    loadComponent: () =>
      import('./pages/astrology/astrology').then((m) => m.Astrology),
    canActivate: [authGuard, ownershipGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/astrology/astrology-home/astrology-home').then(
            (m) => m.AstrologyHome,
          ),
      },
      {
        path: ':module',
        loadComponent: () =>
          import('./pages/astrology/astrology-detail/astrology-detail').then(
            (m) => m.AstrologyDetail,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
