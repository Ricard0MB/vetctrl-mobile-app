import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular'; 
import { PetsService } from '../services/pets.service';
import { AuthService } from '../services/auth.service';
import { SpeciesIconsService } from '../services/species-icons.service';
import { EditPetModalComponent } from '../edit-pet-modal/edit-pet-modal.component';

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
    public authService: AuthService,
    private speciesIcons: SpeciesIconsService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.petId = +params['id'];
      this.cargarDetalle();
    });
  }

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
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error de conexión:', error);
        this.isLoading = false;
      }
    });
  }

  // 👇 FUNCIÓN BLINDADA: Revisa role_name o role, y siempre devuelve true si no hay usuario (solo para probar)
  canEdit(): boolean {
    const user = this.authService.getCurrentUser();
    // Si quieres que el botón salga SIEMPRE para probar, descomenta la siguiente línea:
    // return true; 

    if (!user) return false;
    
    // Buscamos en 'role_name' o en 'role' por si tu backend usa otro nombre
    const rolReal = user.role_name || user.role || user.rol || '';
    const rol = rolReal.toLowerCase();
    
    console.log('ROL DETECTADO EN EL FRONTEND:', rol); // Míralo en la consola F12
    
    return rol.includes('admin') || rol.includes('veterinario') || rol.includes('vet');
  }

  getSpeciesIcon(speciesName: string | undefined | null): string {
    return this.speciesIcons.getSpeciesIcon(speciesName);
  }

  async openEditModal() {
    if (!this.petData) return;

    const modal = await this.modalCtrl.create({
      component: EditPetModalComponent,
      componentProps: {
        pet: { ...this.petData.pet }
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.cargarDetalle();
    }
  }

  nuevaConsulta() { if (this.canEdit()) this.router.navigate(['/consulta-nueva', this.petId]); }
  nuevoTratamiento() { if (this.canEdit()) this.router.navigate(['/tratamiento-nuevo', this.petId]); }
  aplicarVacuna() { if (this.canEdit()) this.router.navigate(['/vacuna-nueva', this.petId]); }
  nuevaCita() { if (this.canEdit()) this.router.navigate(['/tabs/tab3']); }
  volver() { this.router.navigate(['/tabs/tab2']); }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}