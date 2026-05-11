import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
import { UserLogin } from './pages/user-login/user-login';
import { Dashboard } from './pages/dashboard/dashboard';
import { HumanDesign } from './pages/human-design/human-design';
import { HumanDesignHome } from './pages/human-design/human-design-home/human-design-home';
import { HumanDesignTipoAurico } from './pages/human-design/human-design-tipo-aurico/human-design-tipo-aurico';
import { Autoridade } from './pages/human-design/autoridade/autoridade';
import { Perfil } from './pages/human-design/perfil/perfil';
import { Encarnacao } from './pages/human-design/encarnacao/encarnacao';
import { Centros } from './pages/human-design/centros/centros';
import { Numerology } from './pages/numerology/numerology';
import { Home } from './pages/numerology/home/home';
import { authGuard } from './core/guards/auth-guard';
import { Managment } from './pages/managment/managment';
import { roleGuard } from './core/guards/role-guard';
import { DnaManagment } from './pages/dna-managment/dna-managment';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: UserLogin },
  { path: 'dashboard/:userId', component: Dashboard, canActivate: [authGuard] },
  { path: 'managment/:type/:userId', component: Managment, canActivate: [authGuard, roleGuard]},
  { path: 'dna-managment/:userId', component: DnaManagment, canActivate: [authGuard, roleGuard]},
  {
    path: 'human-design',
    component: HumanDesign,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        component: HumanDesignHome,
      },
      {
        path: 'tipo-aurico',
        component: HumanDesignTipoAurico,
      },
      {
        path: 'autoridade',
        component: Autoridade,
      },
      {
        path: 'perfil',
        component: Perfil,
      },
      {
        path: 'encarnacao',
        component: Encarnacao,
      },
      {
        path: 'centros/:centro',
        component: Centros,
      },
    ],
  },
  {
    path: 'numerology',
    component: Numerology,
    children: [
      {path: '', component: Home}
    ],
  },
];
