import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage {
  email = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // URL de tu API en Render
  private apiBaseUrl = 'https://vetctrl.onrender.com/api/index.php';

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.email) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Llamada a la API
    this.http.post(`${this.apiBaseUrl}?resource=forgot-password`, { email: this.email })
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.success) {
            this.successMessage = res.data.message;
          } else {
            this.errorMessage = res.message || 'Ocurrió un error.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Error de conexión con el servidor.';
        }
      });
  }
}