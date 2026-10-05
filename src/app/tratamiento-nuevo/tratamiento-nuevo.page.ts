import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { PetsService } from '../services/pets.service';

@Component({
  selector: 'app-tratamiento-nuevo',
  templateUrl: './tratamiento-nuevo.page.html',
  styleUrls: ['./tratamiento-nuevo.page.scss'],
  standalone: false
})
export class TratamientoNuevoPage implements OnInit {

  petId: number = 0;
  petData: any = null;
  isLoadingPet: boolean = true;
  isSaving: boolean = false;

  // Catálogo de tratamientos filtrado por especie
  catalog: any[] = [];
  selectedCatalogId: number | null = null;

  title: string = '';
  startDate: string = '';
  endDate: string = '';
  diagnosis: string = '';
  medicationDetails: string = '';
  notes: string = '';

  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private petsService: PetsService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    const today = new Date();
    this.startDate = today.toISOString().slice(0, 10);

    this.route.params.subscribe(params => {
      this.petId = +params['petId'];
      this.cargarPet();
    });
  }

  /**
   * Cargar mascota. Al terminar, carga los tratamientos del catálogo filtrados por especie.
   */
  cargarPet() {
    this.isLoadingPet = true;
    this.petsService.getPetDetail(this.petId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.petData = res.data.pet;
          // 🔥 Cargar catálogo de tratamientos filtrado por especie
          this.cargarCatalogo();
        }
        this.isLoadingPet = false;
      },
      error: () => { this.isLoadingPet = false; }
    });
  }

  /**
   * Carga el catálogo de tratamientos predefinidos por especie.
   */
  cargarCatalogo() {
    const species = this.petData?.species_name;

    let url = `${this.apiBaseUrl}?resource=treatments-catalog`;
    if (species) {
      url += `&species=${encodeURIComponent(species)}`;
    }

    console.log('🟢 Cargando catálogo:', { species, url });

    this.http.get(url, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.catalog = res.data;
          console.log('🟢 Tratamientos cargados:', this.catalog.length);
        }
      },
      error: (err) => {
        console.error('🔴 Error al cargar catálogo:', err);
      }
    });
  }

  /**
   * Cuando el usuario selecciona un tratamiento, autocompleta todos los campos.
   */
  onCatalogSelected() {
    if (!this.selectedCatalogId) return;

    const t = this.catalog.find(c => c.id === this.selectedCatalogId);
    if (!t) return;

    // Autocompletar campos
    this.title = t.name;

    if (t.description) {
      this.diagnosis = t.description;
    }

    if (t.medication) {
      this.medicationDetails = t.medication;
    }

    // Notas con dosis y duración
    const notesParts: string[] = [];
    if (t.dosage) notesParts.push(`Dosis: ${t.dosage}`);
    if (t.duration) notesParts.push(`Duración: ${t.duration}`);
    if (notesParts.length > 0) {
      this.notes = notesParts.join(' | ');
    }

    console.log('🟢 Tratamiento seleccionado:', t.name);
  }

  /**
   * Limpiar el selector de tratamiento
   */
  limpiarCatalogo() {
    this.selectedCatalogId = null;
    this.title = '';
    this.diagnosis = '';
    this.medicationDetails = '';
    this.notes = '';
  }

  async guardar() {
    if (!this.title.trim() || !this.startDate || !this.medicationDetails.trim()) {
      const toast = await this.toastController.create({
        message: 'Título, fecha de inicio y medicación son obligatorios',
        duration: 2500,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loader = await this.loadingController.create({ message: 'Guardando tratamiento...' });
    await loader.present();
    this.isSaving = true;

    const payload = {
      pet_id: this.petId,
      title: this.title.trim(),
      start_date: this.startDate,
      end_date: this.endDate || null,
      diagnosis: this.diagnosis.trim() || null,
      medication_details: this.medicationDetails.trim(),
      notes: this.notes.trim() || null
    };

    console.log('📤 Enviando tratamiento:', payload);

    this.http.post(`${this.apiBaseUrl}?resource=treatments`, payload, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: async (res: any) => {
        await loader.dismiss();
        this.isSaving = false;
        if (res.success) {
          const toast = await this.toastController.create({
            message: 'Tratamiento registrado',
            duration: 2500,
            color: 'success'
          });
          await toast.present();
          this.router.navigate(['/pet-detail', this.petId]);
        } else {
          const toast = await this.toastController.create({
            message: res.message || 'Error al guardar',
            duration: 3000,
            color: 'danger'
          });
          await toast.present();
        }
      },
      error: async (err: any) => {
        await loader.dismiss();
        this.isSaving = false;
        const toast = await this.toastController.create({
          message: err.error?.message || 'Error de conexión',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
}
