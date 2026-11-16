import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false // 👈 ESTA ES LA LÍNEA QUE ARREGLA EL ERROR
})
export class AppComponent {
  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    // Revisar el tema al arrancar la app
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}