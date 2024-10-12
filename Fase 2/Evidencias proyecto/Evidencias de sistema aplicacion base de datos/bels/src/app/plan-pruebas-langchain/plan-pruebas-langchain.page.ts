import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-plan-pruebas-langchain',
  templateUrl: './plan-pruebas-langchain.page.html',
  styleUrls: ['./plan-pruebas-langchain.page.scss'],
})
export class PlanPruebasLangchainPage implements OnInit {

  puntajes = {
    "Autocuidado": [0,1,3,2,1,4,3,1,0,0],
    "Habilidades Domésticas": [0,1,3,2,0,0,0],
    "Habilidades Comunitarias": [1,1,1,1],
    "Relaciones Sociales": [4,4,4,4,4]
  };
  ciudad = "Santiago";
  pais = "Chile";
  planTrabajo: string = '';
  formattedPlan: string = '';  // Para almacenar el plan formateado
  preguntasRespuestas: any[] = [];  // Almacenar las preguntas y respuestas
  cargando: boolean = false;  // Variable para controlar el spinner

  constructor() { }

  ngOnInit() {
    
  }

  async generarRespuestas() {
    this.cargando = true;  // Mostrar el spinner mientras se procesa la solicitud
    try {
      console.log("Puntajes que se están enviando:", this.puntajes);  // Verificar puntajes
      console.log("Ciudad y País:", this.ciudad, this.pais);  // Verificar ciudad y país
  
      const response = await axios.post('http://127.0.0.1:5000/api/generar-respuestas', {
        puntajes: this.puntajes,  // Enviando los puntajes
        ciudad: this.ciudad,  // Enviando la ciudad
        pais: this.pais  // Enviando el país
      }, {
        headers: {
          'Content-Type': 'application/json'  // Asegurar que el Content-Type es JSON
        }
      });
      
      if (response.data && response.data.preguntas_respuestas) {
        this.preguntasRespuestas = response.data.preguntas_respuestas;
      }
    } catch (error) {
      console.error("Error al generar las respuestas:", error);
    }
    this.cargando = false;  // Ocultar el spinner cuando finalice la solicitud
  }
  

 // Función para formatear el plan de trabajo
formatPlan(plan: string): string {
  if (!plan) {
    return '';  // Devolver una cadena vacía si el plan no es válido
  }

  // Reemplazar '###' con <h3> y '####' con <h4> para formatear encabezados
  let formatted = plan
    .replace(/### /g, '<h3>')  // Reemplazar '### ' con <h3>
    .replace(/#### /g, '<h4>')  // Reemplazar '#### ' con <h4>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Reemplazar **bold** con <strong>
    .replace(/\n/g, '<br>');  // Reemplazar saltos de línea con <br>

  // Mejorar el manejo de listas y elementos enumerados
  formatted = formatted
    .replace(/- /g, '<li>')  // Reemplazar '-' con <li> para listas no ordenadas
    .replace(/<br><li>/g, '<ul><li>')  // Abrir la lista <ul> cuando encontramos el primer <li>
    .replace(/<\/li><br>/g, '</li></ul>')  // Cerrar la lista <ul> cuando terminan los elementos

    // Reemplazar enumeraciones (si usas números para enumerar)
    .replace(/([0-9]+)\.\s/g, '<strong>$1.</strong> ');  // Poner en negrita los números de enumeraciones

  return formatted;  // Devolver el plan formateado
}

}

