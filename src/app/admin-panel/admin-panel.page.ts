import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.page.html',
  styleUrls: ['./admin-panel.page.scss'],
  standalone: false
})
export class AdminPanelPage implements OnInit {
  segment: string = 'metricas';
  metricas: any = {};
  bitacora: any[] = [];
  precios: Array<{ id?: number; service_key: string; label: string; price_usd: number }> = [];
  guardandoPrecios: boolean = false;
  isLoading: boolean = true;

  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarMetricas();
    this.cargarBitacora();
    this.cargarPrecios();
  }

  cargarMetricas() {
    this.http.get(`${this.apiBaseUrl}?resource=reports&action=metrics`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (res: any) => {
        if (res.success) this.metricas = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  cargarBitacora() {
    this.http.get(`${this.apiBaseUrl}?resource=reports&action=logs`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.bitacora = Array.isArray(res.data) ? res.data : (res.data.logs || []);
        }
      }
    });
  }

  cargarPrecios() {
    this.http.get(`${this.apiBaseUrl}?resource=prices&action=list`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          this.precios = res.data.map((item: any) => ({
            ...item,
            price_usd: Number(item.price_usd)
          }));
        }
      },
      error: (err) => {
        console.error('Error cargando precios:', err);
      }
    });
  }

  guardarPrecios() {
    if (this.guardandoPrecios) return;

    const payload = {
      prices: this.precios.map(p => ({
        service_key: p.service_key,
        price_usd: Number(p.price_usd)
      }))
    };

    this.guardandoPrecios = true;

    this.http.post(`${this.apiBaseUrl}?resource=prices&action=update`, payload, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: async (res: any) => {
        this.guardandoPrecios = false;
        if (res.success) {
          await this.mostrarToast('Tarifas actualizadas correctamente.', 'success');
        } else {
          await this.mostrarToast(res.error || res.message || 'No se pudieron guardar las tarifas.', 'danger');
        }
      },
      error: async (err) => {
        this.guardandoPrecios = false;
        await this.mostrarToast(err?.error?.error || 'Error de conexión al guardar tarifas.', 'danger');
      }
    });
  }

  async mostrarToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  segmentChanged(event: any) {
    this.segment = event.detail.value;
    if (this.segment === 'precios' && this.precios.length === 0) {
      this.cargarPrecios();
    }
  }
}