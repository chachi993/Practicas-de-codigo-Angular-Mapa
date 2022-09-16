import { Component, OnInit } from '@angular/core';

interface MenuItem{
  ruta: string;
  nombre: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
  `
    li{
      cursor: pointer;
    }
    `
  ]
})
export class MenuComponent {

menuItems: MenuItem[] = [
  {
    ruta: '/mapas/fullscreen',
    nombre: 'Fullscreen'
  },
  {
    ruta: '/mapas/zoom-range',
    nombre: 'Zoom Range'
  },
  {
    ruta: '/mapas/properties',
    nombre: 'Properties'
  },
  {
    ruta: '/mapas/marcadores',
    nombre: 'Marcadores'
  }
]

}
