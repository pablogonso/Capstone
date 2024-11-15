import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seguimiento-mensual',
  templateUrl: './seguimiento-mensual.page.html',
  styleUrls: ['./seguimiento-mensual.page.scss'],
})
export class SeguimientoMensualPage implements OnInit {
  dias: any[] = []; // Lista de días con actividades

  constructor() {}

  ngOnInit() {
    // Datos simulados
    this.dias = [
      {
        dia: '1 de Enero',
        completadas: ['Tarea 1'],
        noCompletadas: ['Tarea 2', 'Tarea 3'],
        total: 3,
        expandido: false,
      },
      {
        dia: '2 de Enero',
        completadas: ['Tarea 1', 'Tarea 2'],
        noCompletadas: [],
        total: 2,
        expandido: false,
      },
      {
        dia: '3 de Enero',
        completadas: ['Tarea 1'],
        noCompletadas: ['Tarea 2'],
        total: 2,
        expandido: false,
      },
    ];
  }

  toggleDia(dia: any) {
    // Cambia el estado expandido del día seleccionado
    dia.expandido = !dia.expandido;

    // Colapsa cualquier otro día expandido
    this.dias.forEach(d => {
      if (d !== dia) {
        d.expandido = false;
      }
    });
  }
}
