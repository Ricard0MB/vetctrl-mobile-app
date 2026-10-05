import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { VaccinesService } from '../services/vaccines.service';
import { PetsService } from '../services/pets.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-vacuna-nueva',
  templateUrl: './vacuna-nueva.page.html',
  styleUrls: ['./vacuna-nueva.page.scss'],
  standalone: false
})
export class VacunaNuevaPage implements OnInit {

  petId: number = 0;
  petData: any = null;
  vaccineTypes: any[] = [];
  isLoadingPet: boolean = true;
  isSaving: boolean = false;

  vaccineTypeId: number | null = null;
  applicationDate: string = '';
  nextDueDate: string = '';
  loteNumber: string = '';
  notes: string = '';

  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private vaccinesService: VaccinesService,
    private petsService: PetsService,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    const today = new Date();
    this.applicationDate = today.toISOString().slice(0, 10);

    this.route.params.subscribe(params => {
      this.petId = +params['petId'];
      this.cargarPet();
    });
  }

  /**
   * Cargar los datos de la mascota.
   * Cuando termine, carga los tipos de vacuna filtrados por especie.
   */
  cargarPet() {
    this.isLoadingPet = true;
    this.petsService.getPetDetail(this.petId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.petData = res.data.pet;
          // 🔥 Después de cargar la mascota, cargamos los tipos filtrados por especie
          this.cargarTiposVacuna();
        }
        this.isLoadingPet = false;
      },
      error: () => {
        this.isLoadingPet = false;
      }
    });
  }

  /**
   * Carga los tipos de vacuna.
   * Si tenemos la especie de la mascota, filtramos por ella.
   */
  cargarTiposVacuna() {
    const species = this.petData?.species_name;

    let url = `${this.apiBaseUrl}?resource=vaccine-types`;
    if (species) {
      url += `&species=${encodeURIComponent(species)}`;
    }

    console.log('🟢 Cargando tipos de vacuna:', { species, url });

    this.http.get(url, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.vaccineTypes = res.data;
          console.log('🟢 Tipos de vacuna cargados:', this.vaccineTypes.length);
        }
      },
      error: (err) => {
        console.error('🔴 Error al cargar tipos de vacuna:', err);
      }
    });
  }

  async guardar() {
    if (!this.vaccineTypeId || !this.applicationDate) {
      const toast = await this.toastController.create({
        message: 'Selecciona el tipo de vacuna y la fecha',
        duration: 2500,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loader = await this.loadingController.create({ message: 'Registrando vacuna...' });
    await loader.present();
    this.isSaving = true;

    const payload = {
      pet_id: this.petId,
      vaccine_type_id: this.vaccineTypeId,
      application_date: this.applicationDate,
      next_due_date: this.nextDueDate || undefined,
      lote_number: this.loteNumber.trim() || undefined,
      notes: this.notes.trim() || undefined
    };

    console.log('📤 Enviando vacuna:', payload);

    this.vaccinesService.createVaccine(payload).subscribe({
      next: async (res: any) => {
        await loader.dismiss();
        this.isSaving = false;
        if (res.success) {
          const toast = await this.toastController.create({
            message: 'Vacuna registrada correctamente',
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
