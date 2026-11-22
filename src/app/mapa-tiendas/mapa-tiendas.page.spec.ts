import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaTiendasPage } from './mapa-tiendas.page';

describe('MapaTiendasPage', () => {
  let component: MapaTiendasPage;
  let fixture: ComponentFixture<MapaTiendasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaTiendasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
