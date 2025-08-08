import { UpperCasePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  templateUrl: './hero-page.component.html',
  imports: [UpperCasePipe],
  styles: [
    `
      h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class HeroPageComponent {
  name = signal('Ironman');
  age = signal(45);
  heroDescription = computed(() => `${this.name()} - ${this.age()}`);
  capitalizedHeroName = computed(() => this.name().toUpperCase());

  changeHero() {
    this.name.set('Spider-Man');
    this.age.set(22);
  }
  changeAge() {
    this.age.set(60);
  }

  resetForm() {
    this.name.set('Ironman');
    this.age.set(45);
  }
}
