import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
import { PluginListenerHandle } from '@capacitor/core';
import { App } from '@capacitor/app';
import { AppointmentsService } from '../services/appointments.service';
import { AuthService } from '../services/auth.service';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-mis-citas',
  templateUrl: './mis-citas.page.html',
  styleUrls: ['./mis-citas.page.scss'],
  standalone: false
})
export class MisCitasPage implements OnInit, OnDestroy {

  citas: any[] = [];
  isLoading: boolean = true;
  precioConsulta: number = 10.00;
  private transactionIdPendiente: string | null = null;
  private appListener?: PluginListenerHandle;
  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(
    private http: HttpClient,
    private appointmentsService: AppointmentsService,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController,
    private paymentService: PaymentService
  ) {}

  async ngOnInit() {
    this.cargarPrecioConsulta();
    this.cargarCitas();

    // 👇 await obligatorio en Capacitor para obtener el handle real con .remove()
    this.appListener = await App.addListener('appStateChange', async (state) => {
      if (state.isActive && this.transactionIdPendiente) {
        this.verificarPago(this.transactionIdPendiente);
      }
    });
  }

  ionViewWillEnter() {
    this.cargarPrecioConsulta();
    this.cargarCitas();
  }

  async ngOnDestroy() {
    if (this.appListener && typeof this.appListener.remove === 'function') {
      await this.appListener.remove();
    }
  }

  cargarPrecioConsulta() {
    this.http.get(`${this.apiBaseUrl}?resource=prices&action=list`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          const tarifaConsulta = res.data.find((p: any) => p.service_key === 'consulta');
          if (tarifaConsulta && Number(tarifaConsulta.price_usd) > 0) {
            this.precioConsulta = Number(tarifaConsulta.price_usd);
          }
        }
      },
      error: (err) => {
        console.error('Error cargando precio de consulta:', err);
      }
    });
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
      error: () => {
        this.isLoading = false;
      }
    });
  }

  pagarCita(citaId: number, monto: number = this.precioConsulta) {
    const montoFinal = Number(monto) > 0 ? Number(monto) : this.precioConsulta;
    this.presentToast('Generando link de pago...', 'primary');

    this.paymentService.createPayment(citaId, montoFinal).subscribe({
      next: async (res: any) => {
        console.log('Respuesta del backend:', res);

        if (res.success && res.data && res.data.payment_link) {
          this.transactionIdPendiente = res.data.transaction_id;
          await this.paymentService.openPaymentLink(res.data.payment_link);
        } else {
          this.presentToast('El backend respondió pero sin el link de Wayu.', 'danger');
        }
      },
      error: (err) => {
        console.error('Error de red o servidor:', err);
        this.presentToast('Error de conexión. Revisa la consola.', 'danger');
      }
    });
  }

 verificarPago(transactionId: string) {
    this.paymentService.checkPaymentStatus(transactionId).subscribe({
      next: async (res: any) => {
        const estadoPago = res?.data?.estado ?? res?.estado;

        if (estadoPago === 'completed') {
          const alert = await this.alertController.create({
            header: '¡Pago Exitoso! 🎉',
            message: 'Tu cita ha sido marcada como PAGADA.',
            buttons: ['OK']
          });
          await alert.present();
          this.transactionIdPendiente = null;
          this.cargarCitas();
        } else {
          this.presentToast('Pago pendiente o en proceso de validación.', 'warning');
          this.transactionIdPendiente = null;
          this.cargarCitas();
        }
      },
      error: () => {
        this.presentToast('No se pudo verificar el estado del pago.', 'warning');
        this.transactionIdPendiente = null;
        this.cargarCitas();
      }
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
    this.appointmentsService.updateAppointment(id, { status: 'CANCELADA' }).subscribe({
      next: async (res: any) => {
        if (res.success) {
          this.presentToast('Cita cancelada exitosamente', 'success');
          this.cargarCitas();
        }
      },
      error: async () => {
        this.presentToast('Error al cancelar la cita', 'danger');
      }
    });
  }

  getBadgeColor(status: string): string {
    const s = (status || '').toUpperCase();
    if (s === 'PENDIENTE') return 'warning';
    if (s === 'PAGADA' || s === 'PAGADO' || s === 'COMPLETADA') return 'success';
    if (s === 'CANCELADA') return 'danger';
    return 'medium';
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }
}