import { Component, signal, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { EtymologyMapComponent } from './etymology-map.component';
import { BelligerentsMapComponent } from './belligerents-map.component';
import { provideHttpClient, withFetch } from '@angular/common/http';

declare var Datamap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass, EtymologyMapComponent, BelligerentsMapComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('glassmorphic-ui');
  private platformId = inject(PLATFORM_ID);
  
  currentSlide = 0;
  totalSlides = 3;

  ngOnInit() {
    // Carousel auto-rotate disabled
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateCarousel();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.updateCarousel();
  }

  updateCarousel() {
    // Carousel now uses absolute positioning with transforms
    // No DOM manipulation needed - handled by Angular bindings
  }
}
