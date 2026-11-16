import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PetDetailPageRoutingModule } from './pet-detail-routing.module';
import { PetDetailPage } from './pet-detail.page';

// 👇 ESTA ES LA LÍNEA QUE TE FALTABA (Importar el modal)
import { EditPetModalComponent } from '../edit-pet-modal/edit-pet-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetDetailPageRoutingModule
  ],
  // 👇 Aquí van declarados ambos
  declarations: [
    PetDetailPage, 
    EditPetModalComponent
  ]
})
export class PetDetailPageModule {}