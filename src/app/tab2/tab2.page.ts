import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PetsService } from '../services/pets.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements OnInit {

  listaMascotas: any[] = [];
  isLoading: boolean = true;

  constructor(
    private petsService: PetsService,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController   // ← nuevo
  ) {}

  ngOnInit() {
    console.log('Tab2: ngOnInit');
  }

  ionViewWillEnter() {
    console.log('Tab2: ionViewWillEnter - recargando datos');
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      this.isLoading = false;
      return;
    }

    const obs = user.role_name === 'Propietario'
      ? this.petsService.getPetsByOwner(user.id)
      : this.petsService.getPets();

    obs.subscribe({
      next: (respuesta: any) => {
        console.log('🟢 Datos recibidos:', respuesta);
        if (respuesta.success) {
          this.listaMascotas = respuesta.data.pets || respuesta.data || [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('🔴 Error de conexión:', error);
        this.isLoading = false;
      }
    });
  }

  goToDetail(petId: number) {
    this.router.navigate(['/pet-detail', petId]);
  }

  openAddPetModal() {
    this.router.navigate(['/pet-nueva']);
  }

  // ==========================================
  // LOGOUT con confirmación
  // ==========================================
  async confirmarLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, salir',
          role: 'destructive',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
  }
}