import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { VacunaNuevaPageRoutingModule } from './vacuna-nueva-routing.module';
import { VacunaNuevaPage } from './vacuna-nueva.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VacunaNuevaPageRoutingModule
  ],
  declarations: [VacunaNuevaPage]
})
export class VacunaNuevaPageModule {}
