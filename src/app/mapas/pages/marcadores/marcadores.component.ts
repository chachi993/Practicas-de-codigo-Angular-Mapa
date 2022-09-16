import { AfterViewInit, Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorColor{
  color:string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .mapa-container{
      width:100%;
      height:100%;
    }
    .list-group{
      position:fixed;
      top:20px;
      right:20px;
      z-index:99;
    }
    li{
      cursor:pointer
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [ -55.99014608989534, -34.749145410200455 ];
  marcadores: MarcadorColor[] = []; //arreglo de marcadores

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });
    this.leerLocalStorage();
  }
    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola Mundo'
    //const marker = new mapboxgl.Marker(
    //   {
    //     element.markerHtml
    //   }
  //    )
  //     .setLngLat(this.center)
  //     .addTo(this.mapa);
  // }
  
  irMarcador(marker: mapboxgl.Marker){
    this.mapa.flyTo({
      center: marker.getLngLat()
    });
  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
    .setLngLat(this.center)
    .addTo(this.mapa);
    this.marcadores.push({
      color, 
      marker: nuevoMarcador
    });
    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    })
  }

  guardarMarcadoresLocalStorage(){
    const lngLatArr: MarcadorColor[] = [];
    this.marcadores.forEach( m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({ 
        color: m.color,
        centro: [lng,lat]
      });
    })
//serializo para que se vuelva string
    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  leerLocalStorage(){
    if(!localStorage.getItem('marcadores')){
      return;
    }
    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);
    
    lngLatArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable:true
      })
      .setLngLat(m.centro!)
      .addTo(this.mapa);

      this.marcadores.push({
        marker: newMarker,
        color: m.color
      }); 
      newMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      })
    })
  }
  borrarMarcador(i: number){
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }
}
