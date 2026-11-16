import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service'; // Ajusta tu ruta

@Component({
  selector: 'app-edit-pet-modal',
  templateUrl: './edit-pet-modal.component.html',
  styleUrls: ['./edit-pet-modal.component.scss'],
  standalone: false
})
export class EditPetModalComponent implements OnInit {
  @Input() pet: any; // Recibe los datos actuales de la mascota
  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  saveChanges() {
    if (!this.pet.name) return;

    // Asumiendo que tu backend acepta un PUT en el recurso 'pets'
    this.http.put(`${this.apiBaseUrl}?resource=pets&id=${this.pet.id}`, this.pet, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: async (res: any) => {
        const toast = await this.toastCtrl.create({
          message: 'Mascota actualizada correctamente',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        
        // Cerramos el modal y devolvemos los datos actualizados
        this.modalCtrl.dismiss(this.pet, 'confirm');
      },
      error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: 'Error al actualizar',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}