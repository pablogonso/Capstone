import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class LangchainService {

  // URL del backend Flask
  private apiUrl = 'http://127.0.0.1:5000/api/generar-plan'; // Asegúrate de que esta URL sea correcta

  constructor() { }

  // Método para enviar los puntajes y recibir el plan de trabajo
  async generarPlanTrabajo(puntajes: any, ciudad: string, pais: string): Promise<string> {
    try {
      const response = await axios.post(this.apiUrl, {
        puntajes: puntajes,
        ciudad: ciudad,
        pais: pais
      });

      // Devolver el plan de trabajo generado por el backend
      return response.data.plan_de_trabajo;
    } catch (error) {
      console.error('Error al generar el plan de trabajo:', error);
      throw error;
    }
  }
}
