import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaTiendasPage } from './mapa-tiendas.page';

const routes: Routes = [
  {
    path: '',
    component: MapaTiendasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaTiendasPageRoutingModule {}
