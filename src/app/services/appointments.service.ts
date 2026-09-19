import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Listar citas (según el rol)
  getAppointments(): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=appointments`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Listar citas de una mascota
  getAppointmentsByPet(petId: number): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=appointments&pet_id=${petId}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Crear cita
  createAppointment(data: {
    pet_id: number;
    appointment_date: string;
    reason: string;
    vet_id?: number;
  }): Observable<any> {
    return this.http.post(
      `${this.apiBaseUrl}?resource=appointments`,
      data,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Cancelar cita
  cancelAppointment(id: number): Observable<any> {
    return this.http.post(
      `${this.apiBaseUrl}?resource=appointments&id=${id}`,
      {},
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Detalle de una cita
  getAppointment(id: number): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=appointments&id=${id}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}