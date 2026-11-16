import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 Importante para el ngModel
import { IonicModule } from '@ionic/angular';
import { PetDetailPageRoutingModule } from './pet-detail-routing.module';
import { PetDetailPage } from './pet-detail.page';

// 👇 Importamos tu modal
import { EditPetModalComponent } from '../edit-pet-modal/edit-pet-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // 👈 Agregado
    IonicModule,
    PetDetailPageRoutingModule
  ],
  // 👇 Declaramos la página y el modal juntos
  declarations: [PetDetailPage, EditPetModalComponent]
})
export class PetDetailPageModule {}