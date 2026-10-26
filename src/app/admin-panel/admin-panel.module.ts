import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AdminPanelPageRoutingModule } from './admin-panel-routing.module';
// 🔥 CORREGIDO AQUÍ (sin el punto final):
import { AdminPanelPage } from './admin-panel.page'; 

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AdminPanelPageRoutingModule],
  declarations: [AdminPanelPage]
})
export class AdminPanelPageModule {}