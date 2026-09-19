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

  cargarPet() {
    this.isLoadingPet = true;
    this.petsService.getPetDetail(this.petId).subscribe({
      next: (res: any) => {
        if (res.success) this.petData = res.data.pet;
        this.isLoadingPet = false;
      },
      error: () => { this.isLoadingPet = false; }
    });
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
        }
      },
      error: async (err: any) => {
        await loader.dismiss();
        this.isSaving = false;
        const toast = await this.toastController.create({
          message: err.error?.message || 'Error al guardar',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
}
