import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Completa usuario y contraseña';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response && response.success) {
          this.router.navigate(['/tabs']);
        } else {
          this.errorMessage = response?.message || 'Error al iniciar sesión';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error de conexión con el servidor.';
      }
    });
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }
}