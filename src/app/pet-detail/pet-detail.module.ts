import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetDetailPage } from './pet-detail.page';
import { PetDetailPageRoutingModule } from './pet-detail-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PetDetailPageRoutingModule
  ],
  declarations: [PetDetailPage]   // <--- Declarado, no importado
})
export class PetDetailPageModule {}