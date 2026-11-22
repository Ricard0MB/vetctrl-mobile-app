import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Browser } from '@capacitor/browser';
import { AuthService } from './auth.service'; // Ajusta tu ruta si es diferente
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createPayment(citaId: number, montoUsd: number): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}?resource=payments&action=create`, 
      { cita_id: citaId, monto_usd: montoUsd },
      { headers: this.authService.getAuthHeaders() }
    );
  }

  async openPaymentLink(link: string) {
    await Browser.open({ url: link });
  }

  checkPaymentStatus(transactionId: string): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}?resource=payments&action=status&id=${transactionId}`, 
      { headers: this.authService.getAuthHeaders() }
    );
  }
}