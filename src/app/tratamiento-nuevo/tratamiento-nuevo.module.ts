import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TratamientoNuevoPageRoutingModule } from './tratamiento-nuevo-routing.module';
import { TratamientoNuevoPage } from './tratamiento-nuevo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TratamientoNuevoPageRoutingModule
  ],
  declarations: [TratamientoNuevoPage]
})
export class TratamientoNuevoPageModule {}
