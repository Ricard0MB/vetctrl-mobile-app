import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { ConsultationsService } from '../services/consultations.service';
import { PetsService } from '../services/pets.service';

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

  consultationDate: string = '';
  reason: string = '';
  diagnosis: string = '';
  treatment: string = '';
  notes: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultationsService: ConsultationsService,
    private petsService: PetsService,
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

  cargarPet() {
    this.isLoadingPet = true;
    this.petsService.getPetDetail(this.petId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.petData = res.data.pet;
        }
        this.isLoadingPet = false;
      },
      error: () => { this.isLoadingPet = false; }
    });
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