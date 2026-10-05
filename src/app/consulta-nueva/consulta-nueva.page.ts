import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ConsultationsService } from '../services/consultations.service';
import { PetsService } from '../services/pets.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-consulta-nueva',
  templateUrl: './consulta-nueva.page.html',
  styleUrls: ['./consulta-nueva.page.scss'],
  standalone: false
})
export class ConsultaNuevaPage implements OnInit {

  petId: number = 0;
  petData: any = null;
  isLoadingPet: boolean = true;
  isSaving: boolean = false;

  // Catálogo de enfermedades filtrado por especie
  diseases: any[] = [];
  selectedDiseaseId: number | null = null;

  consultationDate: string = '';
  reason: string = '';
  diagnosis: string = '';
  treatment: string = '';
  notes: string = '';

  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private consultationsService: ConsultationsService,
    private petsService: PetsService,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.consultationDate = now.toISOString().slice(0, 16);

    this.route.params.subscribe(params => {
      this.petId = +params['petId'];
      this.cargarPet();
    });
  }

  /**
   * Cargar mascota. Al terminar, carga las enfermedades filtradas por especie.
   */
  cargarPet() {
    this.isLoadingPet = true;
    this.petsService.getPetDetail(this.petId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.petData = res.data.pet;
          // 🔥 Cargar enfermedades filtradas por la especie de la mascota
          this.cargarEnfermedades();
        }
        this.isLoadingPet = false;
      },
      error: () => { this.isLoadingPet = false; }
    });
  }

  /**
   * Carga las enfermedades filtradas por la especie de la mascota.
   */
  cargarEnfermedades() {
    const species = this.petData?.species_name;

    let url = `${this.apiBaseUrl}?resource=diseases`;
    if (species) {
      url += `&species=${encodeURIComponent(species)}`;
    }

    console.log('🟢 Cargando enfermedades:', { species, url });

    this.http.get(url, {
      headers: this.authService.getAuthHeaders()
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.diseases = res.data;
          console.log('🟢 Enfermedades cargadas:', this.diseases.length);
        }
      },
      error: (err) => {
        console.error('🔴 Error al cargar enfermedades:', err);
      }
    });
  }

  /**
   * Cuando el usuario selecciona una enfermedad, autocompleta diagnóstico y tratamiento.
   */
  onDiseaseSelected() {
    if (!this.selectedDiseaseId) return;

    const disease = this.diseases.find(d => d.id === this.selectedDiseaseId);
    if (!disease) return;

    // Autocompletar el motivo con el nombre de la enfermedad (si está vacío)
    if (!this.reason.trim()) {
      this.reason = disease.name;
    }

    // Autocompletar el diagnóstico con la descripción
    const desc = disease.description ? `: ${disease.description}` : '';
    this.diagnosis = `${disease.name}${desc}`;

    // Si tiene síntomas, los agregamos al diagnóstico
    if (disease.symptoms) {
      this.diagnosis += `\n\nSíntomas: ${disease.symptoms}`;
    }

    // Autocompletar el tratamiento recomendado
    if (disease.treatment_recommended && !this.treatment.trim()) {
      this.treatment = disease.treatment_recommended;
    }

    console.log('🟢 Enfermedad seleccionada:', disease.name);
  }

  /**
   * Limpiar el selector de enfermedad
   */
  limpiarEnfermedad() {
    this.selectedDiseaseId = null;
    this.diagnosis = '';
    this.treatment = '';
  }

  async guardar() {
    if (!this.diagnosis.trim()) {
      const toast = await this.toastController.create({
        message: 'El diagnóstico es obligatorio',
        duration: 2500,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loader = await this.loadingController.create({ message: 'Guardando consulta...' });
    await loader.present();
    this.isSaving = true;

    const dateForApi = this.consultationDate.replace('T', ' ') + ':00';

    const payload = {
      pet_id: this.petId,
      consultation_date: dateForApi,
      reason: this.reason.trim(),
      diagnosis: this.diagnosis.trim(),
      treatment: this.treatment.trim() || null,
      notes: this.notes.trim() || null
    };

    console.log('📤 Enviando consulta:', payload);

    this.consultationsService.createConsultation(payload).subscribe({
      next: async (res: any) => {
        await loader.dismiss();
        this.isSaving = false;
        if (res.success) {
          const toast = await this.toastController.create({
            message: 'Consulta registrada correctamente',
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
