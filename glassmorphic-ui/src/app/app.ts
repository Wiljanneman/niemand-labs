import { Component, signal, OnInit, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser, NgClass } from '@angular/common';

declare var Datamap: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  protected readonly title = signal('glassmorphic-ui');
  private platformId = inject(PLATFORM_ID);
  
  currentSlide = 0;
  totalSlides = 3;

  ngOnInit() {
    // Carousel auto-rotate disabled
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initGlobe();
      }, 100);
    }
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
    const carousel = document.getElementById('carousel');
    if (carousel) {
      const offset = this.currentSlide * -100;
      carousel.style.transform = `translateX(calc(${offset}% + ${this.currentSlide * 24}px))`;
    }
  }

  initGlobe() {
    const container = document.getElementById('globe-container');
    if (!container || typeof Datamap === 'undefined') {
      console.log('Container or Datamap not available');
      return;
    }

    const map = new Datamap({
      element: container,
      responsive: true,
      fills: {
        defaultFill: 'rgba(56, 189, 248, 0.3)',
        afrikaans: 'rgba(236, 138, 72, 0.8)',
        influence: 'rgba(129, 140, 248, 0.5)'
      },
      data: {
        ZAF: { fillKey: 'afrikaans' },
        NAM: { fillKey: 'afrikaans' },
        NLD: { fillKey: 'influence' },
        BEL: { fillKey: 'influence' }
      },
      geographyConfig: {
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 0.5,
        highlightBorderColor: 'rgba(255, 255, 255, 0.8)',
        highlightFillColor: 'rgba(56, 189, 248, 0.6)',
        popupTemplate: (geo: any, data: any) => {
          return `<div class="hoverinfo glass-card p-2">${geo.properties.name}</div>`;
        }
      },
      projection: 'orthographic',
      projectionConfig: {
        rotation: [20, -30],
        scale: 200
      },
      setProjection: function(element: any) {
        const projection = (window as any).d3.geo.orthographic()
          .scale(200)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2])
          .rotate([20, -30]);
        const path = (window as any).d3.geo.path().projection(projection);
        return {path: path, projection: projection};
      }
    });

    // Auto-rotate globe
    let rotation = 20;
    setInterval(() => {
      rotation += 0.5;
      if (map.options && map.options.projectionConfig) {
        map.options.projectionConfig.rotation = [rotation, -30];
      }
      if (map.svg) {
        const projection = (window as any).d3.geo.orthographic()
          .scale(200)
          .translate([container.offsetWidth / 2, container.offsetHeight / 2])
          .rotate([rotation, -30]);
        const path = (window as any).d3.geo.path().projection(projection);
        map.svg.selectAll('path').attr('d', path);
      }
    }, 50);
  }
}
