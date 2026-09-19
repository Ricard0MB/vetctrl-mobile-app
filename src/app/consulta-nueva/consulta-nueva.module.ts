import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ConsultaNuevaPageRoutingModule } from './consulta-nueva-routing.module';
import { ConsultaNuevaPage } from './consulta-nueva.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaNuevaPageRoutingModule
  ],
  declarations: [ConsultaNuevaPage]
})
export class ConsultaNuevaPageModule {}
