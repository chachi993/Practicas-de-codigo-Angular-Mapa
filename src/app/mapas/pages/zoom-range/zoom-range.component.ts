import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl  from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .mapa-container{
      width:100%;
      height:100%;
    }
    .row{
      width: 400px;
      background-color: #fff;
      position: fixed;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      border-radius: 5px;
      z-index: 999;
    }`
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [ -55.99014608989534, -34.749145410200455 ];

  constructor() { }
  
  //porque antes el viewchild no se carga
  ngAfterViewInit(): void { 
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });
    this.mapa.on('zoom', (ev) => { //creo un listener, cuando cambia el zoom
      this.zoomLevel = this.mapa.getZoom(); 
    });
    this.mapa.on('zoomend', (ev) => { 
      if(this.mapa.getZoom() > 18){
        this.mapa.zoomTo(18); 
      }
    });
    //movemos el mapa
    this.mapa.on('move', (ev) => { //creo un listener, cuando cambia el zoom
      const target = ev.target;
      const {lng, lat } = target.getCenter();
      this.center = [lng, lat];
    });
  }
    zoomOut(){
      this.mapa.zoomOut()
    }
    
    zoomIn(){
      this.mapa.zoomIn();
    }
    zoomCambio(valor: any){
      this.mapa.zoomTo(Number(valor))
    }
    ngOnDestroy(): void { //limpiar todos los listener
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
    }

  }

