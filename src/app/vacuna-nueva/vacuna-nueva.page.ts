import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { VaccinesService } from '../services/vaccines.service';
import { PetsService } from '../services/pets.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vaccinesService: VaccinesService,
    private petsService: PetsService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    const today = new Date();
    this.applicationDate = today.toISOString().slice(0, 10);

    this.route.params.subscribe(params => {
      this.petId = +params['petId'];
      this.cargarPet();
      this.cargarTiposVacuna();
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

  cargarTiposVacuna() {
    this.vaccinesService.getVaccineTypes().subscribe({
      next: (res: any) => {
        if (res.success) this.vaccineTypes = res.data;
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