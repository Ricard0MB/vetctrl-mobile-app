import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PetsService } from '../services/pets.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pet-detail',
  templateUrl: './pet-detail.page.html',
  styleUrls: ['./pet-detail.page.scss'],
  standalone: false
})
export class PetDetailPage implements OnInit {

  petId: number = 0;
  isLoading: boolean = true;
  petData: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petsService: PetsService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.petId = +params['id'];
      this.cargarDetalle();
    });
  }

  // Se ejecuta cada vez que entras a la pantalla (útil para refrescar tras crear algo)
  ionViewWillEnter() {
    if (this.petId > 0) {
      this.cargarDetalle();
    }
  }

  cargarDetalle() {
    this.isLoading = true;
    this.petsService.getPetDetail(this.petId).subscribe({
      next: (respuesta: any) => {
        console.log('Detalle de mascota:', respuesta);
        if (respuesta.success) {
          this.petData = respuesta.data;
        } else {
          console.error('Error del servidor:', respuesta.message);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error de conexión:', error);
        this.isLoading = false;
      }
    });
  }

  // Verifica si el usuario puede crear consultas, vacunas, etc.
  canEdit(): boolean {
    const user = this.authService.getCurrentUser();
    return !!user && (user.role_name === 'Veterinario' || user.role_name === 'admin');
  }

  // Navegación a pantallas de creación
  nuevaConsulta() {
    if (!this.canEdit()) return;
    this.router.navigate(['/consulta-nueva', this.petId]);
  }

  nuevoTratamiento() {
    if (!this.canEdit()) return;
    this.router.navigate(['/tratamiento-nuevo', this.petId]);
  }

  aplicarVacuna() {
    if (!this.canEdit()) return;
    this.router.navigate(['/vacuna-nueva', this.petId]);
  }

  nuevaCita() {
    if (!this.canEdit()) return;
    this.router.navigate(['/tabs/tab3']);
  }

  volver() {
    this.router.navigate(['/tabs/tab2']);
  }

  // Formato de fecha
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}