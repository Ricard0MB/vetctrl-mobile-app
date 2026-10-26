import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VaccinesService } from '../services/vaccines.service';

@Component({
  selector: 'app-alertas-vacunas',
  templateUrl: './alertas-vacunas.page.html',
  styleUrls: ['./alertas-vacunas.page.scss'],
  standalone: false
})
export class AlertasVacunasPage implements OnInit {

  alertas: any[] = [];
  isLoading: boolean = true;

  constructor(
    private vaccinesService: VaccinesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarAlertas();
  }

  ionViewWillEnter() {
    this.cargarAlertas();
  }

  cargarAlertas() {
    this.isLoading = true;
    this.vaccinesService.getVaccineAlerts().subscribe({
      next: (res: any) => {
        if (res.success) {
          // Ordenamos por fecha de vencimiento (las más urgentes primero)
          this.alertas = res.data.sort((a: any, b: any) => 
            new Date(a.next_due_date).getTime() - new Date(b.next_due_date).getTime()
          );
        }
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  // Calcula si está vencida o cuántos días faltan
  getDiasRestantes(fechaStr: string): number {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fecha = new Date(fechaStr);
    fecha.setHours(0, 0, 0, 0);
    const diffTime = fecha.getTime() - hoy.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  irAAplicarVacuna(petId: number) {
    this.router.navigate(['/vacuna-nueva', petId]);
  }
}