import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-plan-pruebas-langchain',
  templateUrl: './plan-pruebas-langchain.page.html',
  styleUrls: ['./plan-pruebas-langchain.page.scss'],
})
export class PlanPruebasLangchainPage implements OnInit {
  puntajes = {
    "Autocuidado": [0, 1, 3, 2, 1, 4, 3, 1, 0, 0],
    "Habilidades Domésticas": [0, 1, 3, 2, 0, 0, 0],
    "Habilidades Comunitarias": [1, 1, 1, 1],
    "Relaciones Sociales": [4, 4, 4, 4, 4]
  };
  ciudad = "Santiago";
  pais = "Chile";
  recomendaciones: any[] = [];  // Para almacenar las recomendaciones por grupo
  cargando: boolean = false;  // Control del estado del spinner

  constructor() {}

  ngOnInit() {}

  // Llamada al backend para generar recomendaciones
  async generarRespuestas() {
    this.cargando = true;  // Mostrar el spinner

    try {
      console.log("Enviando puntajes:", this.puntajes);
      console.log("Ciudad:", this.ciudad, "País:", this.pais);

      const response = await axios.post('http://127.0.0.1:5000/api/generar-respuestas', {
        puntajes: this.puntajes,
        ciudad: this.ciudad,
        pais: this.pais
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.recomendaciones) {
        this.recomendaciones = response.data.recomendaciones;
      }
    } catch (error) {
      console.error("Error al generar las respuestas:", error);
    }

    this.cargando = false;  // Ocultar el spinner
  }
}
