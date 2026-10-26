import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {
  userData: any = {};
  newPassword = '';
  confirmPassword = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userData = { ...user, new_password: '' };
    }
  }

  async guardarCambios() {
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.mostrarToast('Las contraseñas no coinciden', 'warning');
      return;
    }

    if (this.newPassword && this.newPassword.length < 6) {
      this.mostrarToast('La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    this.isLoading = true;
    const payload = {
      first_name: this.userData.first_name,
      last_name: this.userData.last_name,
      email: this.userData.email,
      phone: this.userData.phone,
      address: this.userData.address,
      new_password: this.newPassword || null
    };

    this.authService.updateProfile(payload).subscribe({
      next: async (res: any) => {
        this.isLoading = false;
        if (res.success) {
          this.mostrarToast('Perfil actualizado correctamente', 'success');
          this.newPassword = '';
          this.confirmPassword = '';
        }
      },
      error: async (err: any) => {
        this.isLoading = false;
        this.mostrarToast(err.error?.message || 'Error al actualizar', 'danger');
      }
    });
  }

  async mostrarToast(msg: string, color: string) {
    const toast = await this.toastController.create({ message: msg, duration: 3000, color });
    await toast.present();
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}