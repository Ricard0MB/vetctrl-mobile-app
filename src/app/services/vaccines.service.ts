import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VaccinesService {

  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getVaccines(): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=vaccines`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getVaccinesByPet(petId: number): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=vaccines&pet_id=${petId}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getVaccineAlerts(): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=vaccines&alerts=1`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  createVaccine(data: {
    pet_id: number;
    vaccine_type_id: number;
    application_date: string;
    next_due_date?: string;
    lote_number?: string;
    notes?: string;
  }): Observable<any> {
    return this.http.post(
      `${this.apiBaseUrl}?resource=vaccines`,
      data,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getVaccineTypes(): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=vaccine-types`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  createVaccineType(data: { name: string; species_target?: string; description?: string }): Observable<any> {
    return this.http.post(
      `${this.apiBaseUrl}?resource=vaccine-types`,
      data,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}