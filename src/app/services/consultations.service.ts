import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConsultationsService {

  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Listar consultas (según rol)
  getConsultations(): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=consultations`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Listar consultas de una mascota
  getConsultationsByPet(petId: number): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=consultations&pet_id=${petId}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Detalle de una consulta
  getConsultation(id: number): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=consultations&id=${id}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Crear consulta (solo veterinario/admin)
  createConsultation(data: {
  pet_id: number;
  consultation_date: string;
  reason: string;
  diagnosis: string;
  treatment?: string | null;   // ← aceptar null también
  notes?: string | null;       // ← aceptar null también
}): Observable<any> {
    return this.http.post(
      `${this.apiBaseUrl}?resource=consultations`,
      data,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Actualizar consulta
  updateConsultation(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.apiBaseUrl}?resource=consultations&id=${id}`,
      data,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}