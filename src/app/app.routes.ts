import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { managerGuard } from './core/guards/manager-guard';
import { ownershipGuard } from './core/guards/ownership-guard';
import {
  passwordChangedGuard,
  passwordGuard,
} from './core/guards/password-guard';
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
  // Troca obrigatória: única rota autenticada SEM o passwordGuard (seria um
  // laço). O passwordChangedGuard faz o inverso — quem já trocou não fica preso.
  {
    path: 'change-password',
    loadComponent: () =>
      import('./pages/change-password/change-password').then(
        (m) => m.ChangePassword,
      ),
    canActivate: [authGuard, passwordChangedGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard, passwordGuard],
  },
  {
    path: 'management/:type',
    loadComponent: () =>
      import('./pages/management/management').then((m) => m.Management),
    canActivate: [authGuard, passwordGuard, roleGuard],
  },
  {
    path: 'analysts',
    loadComponent: () =>
      import('./pages/analysts-management/analysts-management').then(
        (m) => m.AnalystsManagement,
      ),
    canActivate: [authGuard, passwordGuard, managerGuard],
  },
  {
    path: 'dna-management',
    loadComponent: () =>
      import('./pages/dna-management/dna-management').then(
        (m) => m.DnaManagement,
      ),
    canActivate: [authGuard, passwordGuard, roleGuard],
  },
  {
    path: 'user-supply/:maestraId',
    loadComponent: () =>
      import('./pages/user-supply-details/user-supply-details').then(
        (m) => m.UserSupplyDetails,
      ),
    canActivate: [authGuard, passwordGuard, roleGuard],
  },
  {
    path: 'human-design/:userId',
    loadComponent: () =>
      import('./pages/human-design/human-design').then((m) => m.HumanDesign),
    canActivate: [authGuard, passwordGuard, ownershipGuard],
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
    canActivate: [authGuard, passwordGuard, ownershipGuard],
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
    canActivate: [authGuard, passwordGuard, ownershipGuard],
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
  {
    path: 'perfect-plain/:userId',
    loadComponent: () =>
      import('./pages/perfect-plain/perfect-plain').then((m) => m.PerfectPlain),
    canActivate: [authGuard, passwordGuard, ownershipGuard],
  },
  { path: '**', redirectTo: '' },
];
