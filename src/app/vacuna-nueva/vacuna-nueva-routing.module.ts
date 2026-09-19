import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VacunaNuevaPage } from './vacuna-nueva.page';

const routes: Routes = [
  {
    path: '',
    component: VacunaNuevaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VacunaNuevaPageRoutingModule {}
