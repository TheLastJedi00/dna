import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { HumanDesign } from './pages/human-design/human-design';
import { HumanDesignHome } from './pages/human-design/human-design-home/human-design-home';
import { HumanDesignDetail } from './pages/human-design/human-design-detail/human-design-detail';
import { Numerology } from './pages/numerology/numerology';
import { Home } from './pages/numerology/home/home';
import { NumerologyDetail } from './pages/numerology/numerology-detail/numerology-detail';
import { authGuard } from './core/guards/auth-guard';
import { ownershipGuard } from './core/guards/ownership-guard';
import { Managment } from './pages/managment/managment';
import { roleGuard } from './core/guards/role-guard';
import { DnaManagment } from './pages/dna-managment/dna-managment';
import { UserSupplyDetails } from './pages/user-supply-details/user-supply-details';
import { Astrology } from './pages/astrology/astrology';
import { AstrologyHome } from './pages/astrology/astrology-home/astrology-home';
import { AstrologyDetail } from './pages/astrology/astrology-detail/astrology-detail';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'managment/:type', component: Managment, canActivate: [authGuard, roleGuard] },
  {
    path: 'dna-managment',
    component: DnaManagment,
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'user-supply/:maestraId',
    component: UserSupplyDetails,
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'human-design/:userId',
    component: HumanDesign,
    canActivate: [authGuard, ownershipGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: HumanDesignHome },
      { path: ':module', component: HumanDesignDetail },
    ],
  },
  {
    path: 'numerology/:userId',
    component: Numerology,
    canActivate: [authGuard, ownershipGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: Home },
      { path: ':module', component: NumerologyDetail },
    ],
  },
  {
    path: 'astrology/:userId',
    component: Astrology,
    canActivate: [authGuard, ownershipGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', component: AstrologyHome },
      { path: ':module', component: AstrologyDetail },
    ],
  },
];
