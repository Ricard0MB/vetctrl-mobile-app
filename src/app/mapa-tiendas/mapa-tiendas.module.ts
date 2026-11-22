import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaTiendasPageRoutingModule } from './mapa-tiendas-routing.module';

import { MapaTiendasPage } from './mapa-tiendas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaTiendasPageRoutingModule
  ],
  declarations: [MapaTiendasPage], // <--- Comma added here
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapaTiendasPageModule {}