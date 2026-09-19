import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TratamientoNuevoPage } from './tratamiento-nuevo.page';

const routes: Routes = [
  {
    path: '',
    component: TratamientoNuevoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TratamientoNuevoPageRoutingModule {}
