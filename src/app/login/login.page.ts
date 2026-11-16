import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  username = '';
  password = '';
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Variable del Tema
  isDarkMode = false;

  // Variables del Tutorial
  isTutorialOpen = false;
  currentStep = 0;
  steps = [
    { 
      title: "📝 Crear tu cuenta", 
      desc: `<p>Para empezar a usar VetCtrl, necesitas registrarte. Sigue estos pasos:</p><ul><li>Haz clic en Regístrate.</li><li>Completa tus datos.</li><li>Acepta los términos y presiona "Crear cuenta".</li></ul>`
    },
    { 
      title: "🔑 Iniciar sesión", 
      desc: `<p>Una vez registrado, vuelve a esta página para acceder:</p><ul><li>Introduce tu usuario o correo.</li><li>Escribe tu contraseña.</li><li>Presiona "Ingresar".</li></ul>`
    },
    { 
      title: "🔄 Recuperar contraseña", 
      desc: `<p>Si olvidaste tu contraseña:</p><ul><li>Haz clic en "¿Olvidaste tu contraseña?".</li><li>Ingresa el correo con el que te registraste.</li><li>Sigue el enlace que llegará a tu correo.</li></ul>`
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Comprobar el estado actual del tema
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.username || !this.password) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    // 👇 AQUÍ ESTÁ LA MAGIA: Conectamos con el backend real
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        // El AuthService ya guardó el token y el usuario internamente
        this.router.navigate(['/tabs']); 
      },
      error: (err) => {
        this.isLoading = false;
        // Mostramos el error que devuelva el servidor (ej. contraseña incorrecta)
        this.errorMessage = err.error?.message || 'Error al iniciar sesión. Verifica tus datos.';
      }
    });
  }

  // --- Métodos del Tutorial ---
  openTutorial(event: Event) {
    event.preventDefault();
    this.currentStep = 0;
    this.isTutorialOpen = true;
  }

  closeTutorial() {
    this.isTutorialOpen = false;
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    } else {
      this.closeTutorial();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}