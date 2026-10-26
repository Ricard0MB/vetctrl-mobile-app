import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertasVacunasPageRoutingModule } from './alertas-vacunas-routing.module';
import { AlertasVacunasPage } from './alertas-vacunas.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AlertasVacunasPageRoutingModule],
  declarations: [AlertasVacunasPage]
})
export class AlertasVacunasPageModule {}