import { Component, AfterViewInit, PLATFORM_ID, inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

declare var Datamap: any;
declare var d3: any;

@Component({
  selector: 'app-belligerents-map',
  standalone: true,
  imports: [],
  template: `<div id="belligerents-globe-container" class="w-full h-full"></div>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class BelligerentsMapComponent implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private rotationInterval: any;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.loadBelligerentsMap();
      }, 100);
    }
  }

  ngOnDestroy() {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }

  loadBelligerentsMap() {
    this.http.get('/worldgeojson.json').subscribe((data: any) => {
      this.initBelligerentsGlobe(data);
    });
  }

  initBelligerentsGlobe(data: any) {
    const container = document.getElementById('belligerents-globe-container');
    if (!container || typeof Datamap === 'undefined') {
      console.log('Container or Datamap not available');
      return;
    }

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const scale = Math.min(containerWidth, containerHeight) * 0.45;

    let globalRotation = [20, -30];

    const map = new Datamap({
      element: container,
      responsive: true,
      scope: 'collection',
      geographyConfig: {
        dataJson: data,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 0.5,
        highlightBorderColor: 'rgba(255, 255, 255, 0.8)',
        popupOnHover: true,
        popupTemplate: (geo: any, data: any) => {
          return `<div class="hoverinfo" style="background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; color: white;">${geo.properties.NAME}</div>`;
        }
      },
      setProjection: (element: any) => {
        const projection = (window as any).d3.geo.orthographic()
          .rotate(globalRotation)
          .scale(scale)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        const path = (window as any).d3.geo.path().projection(projection);
        return { path: path, projection: projection };
      },
      fills: {
        defaultFill: 'rgba(76, 77, 69, 0.3)',
        british: 'rgba(214, 39, 40, 0.8)',
        boerZAR: 'rgba(44, 160, 44, 0.8)',
        boerOVS: 'rgba(252, 141, 89, 0.8)'
      },
      data: {
        'Transvaal': { fillKey: 'boerZAR' },
        'Orange Free State': { fillKey: 'boerOVS' },
        'India': { fillKey: 'british' },
        'Ceylon': { fillKey: 'british' },
        'Australia': { fillKey: 'british' },
        'New Zealand': { fillKey: 'british' },
        'Canada': { fillKey: 'british' },
        'British South Africa': { fillKey: 'british' },
        'United Kingdom': { fillKey: 'british' },
        'Swaziland': { fillKey: 'british' },
        'Basutoland': { fillKey: 'british' },
        'Ireland': { fillKey: 'british' },
        'Scotland': { fillKey: 'british' }
      }
    });

    // Add graticule (grid lines)
    if (map.graticule) {
      map.graticule();
    }

    // Auto-rotate globe
    let rotation = 20;
    this.rotationInterval = setInterval(() => {
      rotation += 0.3;
      globalRotation = [rotation, -30];
      
      if (map.svg) {
        const projection = (window as any).d3.geo.orthographic()
          .scale(scale)
          .translate([container.offsetWidth / 2, container.offsetHeight / 2])
          .rotate(globalRotation);
        const path = (window as any).d3.geo.path().projection(projection);
        map.svg.selectAll('path').attr('d', path);
      }
    }, 50);

    // Style the countries after map is drawn
    setTimeout(() => {
      if (typeof d3 !== 'undefined') {
        d3.selectAll('#belligerents-globe-container path.datamaps-subunit').style('opacity', '0.3');
        d3.selectAll('#belligerents-globe-container path.datamaps-subunit').each(function(this: any, d: any) {
          if (d && d.properties) {
            const countryName = d.properties.NAME;
            const britishTerritories = [
              'India', 'Ceylon', 'Australia', 'New Zealand', 'Canada',
              'British South Africa', 'United Kingdom', 'Swaziland',
              'Basutoland', 'Ireland', 'Scotland'
            ];
            const boerTerritories = ['Transvaal', 'Orange Free State'];

            if (britishTerritories.includes(countryName) || boerTerritories.includes(countryName)) {
              d3.select(this).style('opacity', '1');
            }
          }
        });
      }
    }, 200);
  }
}
