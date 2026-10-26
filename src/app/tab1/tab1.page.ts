import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PetsService } from '../services/pets.service';
import { AppointmentsService } from '../services/appointments.service';
import { VaccinesService } from '../services/vaccines.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  username: string = '';
  roleName: string = '';
  
  totalMascotas: number = 0;
  citasPendientes: number = 0;
  alertasVacunas: number = 0;
  
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private petsService: PetsService,
    private appointmentsService: AppointmentsService,
    private vaccinesService: VaccinesService
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.username;
      this.roleName = user.role_name;
    }
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.isLoading = true;
    
    // Hacemos las 3 peticiones en paralelo para que cargue más rápido
    forkJoin({
      pets: this.petsService.getPets(),
      citas: this.appointmentsService.getAppointments(),
      vacunas: this.vaccinesService.getVaccineAlerts()
    }).subscribe({
      next: (res: any) => {
        // 1. Total Mascotas
        if (res.pets.success) {
          const pets = Array.isArray(res.pets.data) ? res.pets.data : (res.pets.data.pets || []);
          this.totalMascotas = pets.length;
        }
        
        // 2. Citas Pendientes
        if (res.citas.success) {
          const citas = Array.isArray(res.citas.data) ? res.citas.data : [];
          this.citasPendientes = citas.filter((c: any) => c.status === 'PENDIENTE').length;
        }

        // 3. Alertas de vacunas
        if (res.vacunas.success) {
          const vacunas = Array.isArray(res.vacunas.data) ? res.vacunas.data : [];
          this.alertasVacunas = vacunas.length;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.isLoading = false;
      }
    });
  }

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }
}