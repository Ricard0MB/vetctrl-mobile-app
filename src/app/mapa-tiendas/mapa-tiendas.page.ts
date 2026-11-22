import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';

@Component({
  selector: 'app-mapa-tiendas',
  templateUrl: './mapa-tiendas.page.html',
  styleUrls: ['./mapa-tiendas.page.scss'],
  standalone: false
})
export class MapaTiendasPage implements AfterViewInit {
  @ViewChild('map', { static: false }) mapRef!: ElementRef;
  newMap!: GoogleMap;
  
  // 👇 PON AQUÍ TU API KEY DE GOOGLE MAPS
  apiKey = 'TU_API_KEY_DE_GOOGLE_MAPS';

  constructor() {}

  async ngAfterViewInit() {
    await this.createMap();
  }

  async createMap() {
    this.newMap = await GoogleMap.create({
      id: 'my-map',
      element: this.mapRef.nativeElement,
      apiKey: this.apiKey,
      config: {
        center: { lat: 10.4806, lng: -66.9036 }, // Caracas
        zoom: 13,
      },
    });

    // Marcadores de prueba
    await this.newMap.addMarkers([
      { coordinate: { lat: 10.4806, lng: -66.9036 }, title: 'PetShop Luna' },
      { coordinate: { lat: 10.4900, lng: -66.9100 }, title: 'Farmacia Veterinaria' }
    ]);
  }
}