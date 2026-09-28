import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { PetsService } from '../services/pets.service';
import { AuthService } from '../services/auth.service';
import { SpeciesIconsService } from '../services/species-icons.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements OnInit {

  listaMascotas: any[] = [];
  isLoading: boolean = true;

  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private petsService: PetsService,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private speciesIcons: SpeciesIconsService
  ) {}

  ngOnInit() {
    console.log('Tab2: ngOnInit');

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.cargarMascotas(term);
    });
  }

  ionViewWillEnter() {
    console.log('Tab2: ionViewWillEnter - recargando datos');
    this.cargarMascotas(this.searchTerm);
  }

  onSearchChange(event: any) {
    const term = event.detail.value || '';
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  cargarMascotas(search: string = '') {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      this.isLoading = false;
      return;
    }

    const obs = search.trim().length > 0
      ? this.petsService.searchPets(search.trim())
      : (user.role_name === 'Propietario'
          ? this.petsService.getPetsByOwner(user.id)
          : this.petsService.getPets());

    obs.subscribe({
      next: (respuesta: any) => {
        console.log('🟢 Datos recibidos:', respuesta);
        if (respuesta.success) {
          const data = respuesta.data;
          this.listaMascotas = Array.isArray(data)
            ? data
            : (data?.pets || []);
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('🔴 Error de conexión:', error);
        this.isLoading = false;
      }
    });
  }

  getSpeciesIcon(speciesName: string | undefined | null): string {
    return this.speciesIcons.getSpeciesIcon(speciesName);
  }

  goToDetail(petId: number) {
    this.router.navigate(['/pet-detail', petId]);
  }

  openAddPetModal() {
    this.router.navigate(['/pet-nueva']);
  }

  async confirmarLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
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