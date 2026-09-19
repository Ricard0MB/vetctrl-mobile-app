import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PetNuevaPage } from './pet-nueva.page';

const routes: Routes = [
  {
    path: '',
    component: PetNuevaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetNuevaPageRoutingModule {}