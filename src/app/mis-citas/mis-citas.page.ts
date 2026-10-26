import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { AppointmentsService } from '../services/appointments.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.page.html',
  styleUrls: ['./mis-citas.page.scss'],
  standalone: false
})
export class MisCitasPage implements OnInit {

  citas: any[] = [];
  isLoading: boolean = true;

  constructor(
    private appointmentsService: AppointmentsService,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarCitas();
  }

  ionViewWillEnter() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.isLoading = true;
    this.appointmentsService.getAppointments().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.citas = Array.isArray(res.data) ? res.data : [];
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  async cancelarCita(cita: any) {
    const alert = await this.alertController.create({
      header: 'Cancelar Cita',
      message: `¿Estás seguro de cancelar la cita de ${cita.pet_name}?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Sí, cancelar',
          role: 'destructive',
          handler: () => {
            this.ejecutarCancelacion(cita.id);
          }
        }
      ]
    });
    await alert.present();
  }

  ejecutarCancelacion(id: number) {
    // Actualizamos el estado a CANCELADA vía PUT
    this.appointmentsService.updateAppointment(id, { status: 'CANCELADA' }).subscribe({
      next: async (res: any) => {
        if (res.success) {
          const toast = await this.toastController.create({
            message: 'Cita cancelada exitosamente',
            duration: 2000,
            color: 'success'
          });
          await toast.present();
          this.cargarCitas(); // Recargar la lista
        }
      },
      error: async (err: any) => {
        const toast = await this.toastController.create({
          message: 'Error al cancelar la cita',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  getBadgeColor(status: string): string {
    if (status === 'PENDIENTE') return 'warning';
    if (status === 'COMPLETADA') return 'success';
    if (status === 'CANCELADA') return 'danger';
    return 'medium';
  }
}