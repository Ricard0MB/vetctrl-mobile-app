import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PetNuevaPageRoutingModule } from './pet-nueva-routing.module';
import { PetNuevaPage } from './pet-nueva.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetNuevaPageRoutingModule
  ],
  declarations: [PetNuevaPage]
})
export class PetNuevaPageModule {}