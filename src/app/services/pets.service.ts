import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PetsService {

  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Lista de mascotas (según el rol del usuario logueado)
  getPets(): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=pets`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Lista de mascotas de un dueño específico (filtro)
  getPetsByOwner(ownerId: number): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=pets&owner=${ownerId}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Detalle completo de una mascota
  getPetDetail(petId: number): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=pets&id=${petId}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Registrar nueva mascota
  addPet(petData: any): Observable<any> {
    return this.http.post(
      `${this.apiBaseUrl}?resource=pets`,
      petData,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Catálogos (especies, razas, roles, vaccine_types)
  getTypesAndBreeds(): Observable<any> {
    // Este endpoint NO requiere token porque es público
    return this.http.get(`https://vetctrl.onrender.com/api/get_catalogs.php`);
  }

  // Buscar mascotas
  searchPets(query: string): Observable<any> {
    return this.http.get(
      `${this.apiBaseUrl}?resource=pets&q=${encodeURIComponent(query)}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}