import { Component, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var Datamap: any;

@Component({
  selector: 'app-etymology-map',
  standalone: true,
  template: `<div id="globe-container" class="w-full h-full"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class EtymologyMapComponent implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initGlobe();
      }, 100);
    }
  }

  initGlobe() {
    const container = document.getElementById('globe-container');
    if (!container || typeof Datamap === 'undefined') {
      console.log('Container or Datamap not available');
      return;
    }

    // Calculate scale based on container size
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const scale = Math.min(containerWidth, containerHeight) * 0.45;

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
        scale: scale
      },
      setProjection: function(element: any) {
        const projection = (window as any).d3.geo.orthographic()
          .scale(scale)
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
          .scale(scale)
          .translate([container.offsetWidth / 2, container.offsetHeight / 2])
          .rotate([rotation, -30]);
        const path = (window as any).d3.geo.path().projection(projection);
        map.svg.selectAll('path').attr('d', path);
      }
    }, 50);
  }
}
