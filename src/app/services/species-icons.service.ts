import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeciesIconsService {

  /**
   * Devuelve el nombre de la clase de Font Awesome
   * según la especie de la mascota.
   */
  getSpeciesIcon(speciesName: string | undefined | null): string {
    if (!speciesName) return 'fa-solid fa-paw';

    const s = speciesName.toLowerCase().trim();

    // Perros
    if (s.includes('perro') || s.includes('can') || s.includes('dog')) {
      return 'fa-solid fa-dog';
    }
    // Gatos
    if (s.includes('gato') || s.includes('fel') || s.includes('cat')) {
      return 'fa-solid fa-cat';
    }
    // Caballos
    if (s.includes('caballo') || s.includes('equino') || s.includes('horse')) {
      return 'fa-solid fa-horse';
    }
    // Vacas
    if (s.includes('vaca') || s.includes('bovino') || s.includes('toro') || s.includes('cow')) {
      return 'fa-solid fa-cow';
    }
    // Cerdos
    if (s.includes('cerdo') || s.includes('porcino') || s.includes('pig')) {
      return 'fa-solid fa-piggy-bank';
    }
    // Aves
    if (s.includes('ave') || s.includes('pájaro') || s.includes('pajaro') || s.includes('loro') || s.includes('bird')) {
      return 'fa-solid fa-dove';
    }
    // Conejos
    if (s.includes('conejo') || s.includes('rabbit')) {
      return 'fa-solid fa-rabbit';
    }
    // Peces
    if (s.includes('pez') || s.includes('fish') || s.includes('pisc')) {
      return 'fa-solid fa-fish';
    }
    // Reptiles / serpientes
    if (s.includes('reptil') || s.includes('serpiente') || s.includes('iguana') || s.includes('snake')) {
      return 'fa-solid fa-worm';
    }
    // Roedores (hámster, cobayo, etc.)
    if (s.includes('roedor') || s.includes('hámster') || s.includes('hamster') || s.includes('cobayo')) {
      return 'fa-solid fa-paw';
    }
    // Insectos
    if (s.includes('insecto') || s.includes('bug')) {
      return 'fa-solid fa-bug';
    }
    // Exóticos / otros
    if (s.includes('exótico') || s.includes('exotico') || s.includes('anfibio')) {
      return 'fa-solid fa-frog';
    }

    // Fallback: huella genérica
    return 'fa-solid fa-paw';
  }
}