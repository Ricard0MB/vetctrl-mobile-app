import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule) },
  // 👇 NUEVA RUTA AGREGADA AQUÍ
  { path: 'forgot-password', loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule) },
  { path: 'tabs', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule) },
  { path: 'pet-detail/:id', loadChildren: () => import('./pet-detail/pet-detail.module').then(m => m.PetDetailPageModule) },
  { path: 'pet-nueva', loadChildren: () => import('./pet-nueva/pet-nueva.module').then(m => m.PetNuevaPageModule) },
  { path: 'consulta-nueva/:petId', loadChildren: () => import('./consulta-nueva/consulta-nueva.module').then(m => m.ConsultaNuevaPageModule) },
  { path: 'vacuna-nueva/:petId', loadChildren: () => import('./vacuna-nueva/vacuna-nueva.module').then(m => m.VacunaNuevaPageModule) },
  { path: 'tratamiento-nuevo/:petId', loadChildren: () => import('./tratamiento-nuevo/tratamiento-nuevo.module').then(m => m.TratamientoNuevoPageModule) },
  { path: 'mis-citas',  loadChildren: () => import('./mis-citas/mis-citas.module').then(m => m.MisCitasPageModule) },
  { path: 'alertas-vacunas', loadChildren: () => import('./alertas-vacunas/alertas-vacunas.module').then(m => m.AlertasVacunasPageModule) },
  { path: 'perfil', loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilPageModule) },
  { path: 'admin-panel', loadChildren: () => import('./admin-panel/admin-panel.module').then(m => m.AdminPanelPageModule) },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }