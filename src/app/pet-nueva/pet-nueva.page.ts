import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { PetsService } from '../services/pets.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pet-nueva',
  templateUrl: './pet-nueva.page.html',
  styleUrls: ['./pet-nueva.page.scss'],
  standalone: false
})
export class PetNuevaPage implements OnInit {

  name: string = '';
  typeId: number | null = null;
  breedId: number | '' = '';
  gender: string = '';
  dateOfBirth: string = '';
  medicalHistory: string = '';
  ownerId: number | null = null;

  petTypes: any[] = [];
  breeds: any[] = [];
  filteredBreeds: any[] = [];
  owners: any[] = [];

  isLoading: boolean = true;
  isSaving: boolean = false;

  maxDate: string = new Date().toISOString().split('T')[0];

  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(
    private http: HttpClient,
    private petsService: PetsService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.cargarCatalogos();
    this.cargarOwners();
  }

  isAdminOrVet(): boolean {
    const user = this.authService.getCurrentUser();
    return !!user && (user.role_name === 'admin' || user.role_name === 'Veterinario');
  }

  cargarCatalogos() {
    this.isLoading = true;
    this.http.get('https://vetctrl.onrender.com/api/get_catalogs.php').subscribe({
      next: (res: any) => {
        if (res.success) {
          this.petTypes = res.data.pet_types || [];
          this.breeds = res.data.breeds || [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar catálogos:', err);
        this.isLoading = false;
      }
    });
  }

  cargarOwners() {
    if (!this.isAdminOrVet()) return;

    this.http.get(`${this.apiBaseUrl}?resource=owners`, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.owners = res.data || [];
        }
      },
      error: (err) => console.error('Error al cargar propietarios:', err)
    });
  }

  filtrarRazas() {
    this.breedId = '';
    if (!this.typeId) {
      this.filteredBreeds = [];
      return;
    }
    this.filteredBreeds = this.breeds.filter(b => b.type_id === this.typeId);
  }

  async guardar() {
    if (!this.name.trim()) {
      this.mostrarToast('El nombre es obligatorio', 'warning');
      return;
    }
    if (!this.typeId) {
      this.mostrarToast('Selecciona una especie', 'warning');
      return;
    }
    if (this.isAdminOrVet() && !this.ownerId) {
      this.mostrarToast('Selecciona un dueño', 'warning');
      return;
    }

    if (this.dateOfBirth) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(this.dateOfBirth);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        this.mostrarToast('La fecha de nacimiento no puede ser futura', 'warning');
        return;
      }

      const maxAge = 100;
      const oldestDate = new Date();
      oldestDate.setFullYear(oldestDate.getFullYear() - maxAge);
      if (selectedDate < oldestDate) {
        this.mostrarToast(`La edad no puede ser mayor a ${maxAge} años`, 'warning');
        return;
      }
    }

    const loader = await this.loadingController.create({ message: 'Guardando mascota...' });
    await loader.present();
    this.isSaving = true;

    const user = this.authService.getCurrentUser();
    const finalOwnerId = this.isAdminOrVet() ? this.ownerId : (user ? user.id : null);

    const payload: any = {
      name: this.name.trim(),
      type_id: this.typeId,
      owner_id: finalOwnerId,
    };

    if (this.breedId) payload.breed_id = this.breedId;
    if (this.gender) payload.gender = this.gender;
    if (this.dateOfBirth) payload.date_of_birth = this.dateOfBirth;
    if (this.medicalHistory.trim()) payload.medical_history = this.medicalHistory.trim();

    console.log('📤 Enviando mascota:', payload);

    this.petsService.addPet(payload).subscribe({
      next: async (res: any) => {
        await loader.dismiss();
        this.isSaving = false;
        if (res.success) {
          const toast = await this.toastController.create({
            message: 'Mascota registrada correctamente',
            duration: 2500,
            color: 'success'
          });
          await toast.present();
          this.router.navigate(['/tabs/tab2']);
        } else {
          this.mostrarToast(res.message || 'Error al guardar', 'danger');
        }
      },
      error: async (err: any) => {
        await loader.dismiss();
        this.isSaving = false;
        console.error('❌ Error al guardar:', err);
        this.mostrarToast(err.error?.message || 'Error de conexión', 'danger');
      }
    });
  }

  private async mostrarToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color
    });
    await toast.present();
  }
}