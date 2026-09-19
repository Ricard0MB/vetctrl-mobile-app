import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';
import { PetsService } from '../services/pets.service';
import { AuthService } from '../services/auth.service';
import { AppointmentsService } from '../services/appointments.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit {

  listaMascotas: any[] = [];
  selectedPetId: number | null = null;
  motivoConsulta: string = '';
  fechaPreferida: string = new Date().toISOString();
  horaPreferida: string = '10:00';
  isLoading: boolean = false;

  constructor(
    private petsService: PetsService,
    private authService: AuthService,
    private appointmentsService: AppointmentsService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.cargarMascotasUsuario();
  }

  ionViewWillEnter() {
    this.cargarMascotasUsuario();
  }

  cargarMascotasUsuario() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      console.warn('No hay usuario logueado');
      return;
    }

    // Para admin/veterinario traemos todas las mascotas
    // Para propietario solo las suyas
    const obs = user.role_name === 'Propietario'
      ? this.petsService.getPetsByOwner(user.id)
      : this.petsService.getPets();

    obs.subscribe({
      next: (res: any) => {
        if (res.success) {
          // La respuesta del listado viene como { data: { pets: [...] } } o { data: [...] }
          this.listaMascotas = res.data.pets || res.data;
          if (this.listaMascotas.length > 0) {
            this.selectedPetId = this.listaMascotas[0].id;
          }
        }
      },
      error: (err) => {
        console.error('Error cargando mascotas:', err);
      }
    });
  }

  async agendarCita() {
    if (!this.selectedPetId || !this.motivoConsulta.trim()) {
      const toast = await this.toastController.create({
        message: 'Por favor completa todos los campos requeridos.',
        duration: 2500,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loader = await this.loadingController.create({
      message: 'Agendando cita...'
    });
    await loader.present();

    // Convertir la fecha ISO a formato MySQL "YYYY-MM-DD HH:MM:SS"
    const fechaBase = new Date(this.fechaPreferida);
    const yyyy = fechaBase.getFullYear();
    const mm = String(fechaBase.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaBase.getDate()).padStart(2, '0');
    const hh = this.horaPreferida.split(':')[0];
    const mi = this.horaPreferida.split(':')[1] || '00';
    const appointmentDate = `${yyyy}-${mm}-${dd} ${hh}:${mi}:00`;

    const citaPayload = {
      pet_id: this.selectedPetId,
      appointment_date: appointmentDate,
      reason: this.motivoConsulta.trim()
    };

    console.log('📤 Enviando cita:', citaPayload);

    this.appointmentsService.createAppointment(citaPayload).subscribe({
      next: async (res: any) => {
        await loader.dismiss();
        console.log('📥 Respuesta:', res);

        if (res.success) {
          const toast = await this.toastController.create({
            message: '¡Cita agendada correctamente!',
            duration: 3000,
            color: 'success'
          });
          await toast.present();
          this.motivoConsulta = '';
        } else {
          const toast = await this.toastController.create({
            message: res.message || 'Error al agendar la cita',
            duration: 3500,
            color: 'danger'
          });
          await toast.present();
        }
      },
      error: async (err) => {
        await loader.dismiss();
        console.error('❌ Error al agendar:', err);

        let msg = 'Error de conexión con el servidor.';
        if (err.status === 401) msg = 'Sesión expirada. Inicia sesión de nuevo.';
        else if (err.status === 422) msg = err.error?.message || 'Datos inválidos.';
        else if (err.status === 403) msg = 'No tienes permiso para agendar esta cita.';

        const toast = await this.toastController.create({
          message: msg,
          duration: 3500,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
}