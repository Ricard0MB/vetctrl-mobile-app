import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertasVacunasPage } from './alertas-vacunas.page';

const routes: Routes = [{ path: '', component: AlertasVacunasPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertasVacunasPageRoutingModule {}