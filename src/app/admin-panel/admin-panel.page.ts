import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  isLoading: boolean = true;
  
  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarMetricas();
    this.cargarBitacora();
  }

  cargarMetricas() {
    this.http.get(`${this.apiBaseUrl}?resource=reports&action=metrics`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (res: any) => {
        if (res.success) this.metricas = res.data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
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

  

  segmentChanged(event: any) {
    this.segment = event.detail.value;
  }
}