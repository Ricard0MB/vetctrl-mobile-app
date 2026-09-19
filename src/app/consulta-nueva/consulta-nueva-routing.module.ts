import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaNuevaPage } from './consulta-nueva.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultaNuevaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaNuevaPageRoutingModule {}
