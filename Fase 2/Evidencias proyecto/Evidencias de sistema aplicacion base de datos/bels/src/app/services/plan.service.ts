// src/app/services/plan.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  constructor(private firestore: AngularFirestore) {}

  // Método para generar un ID único de plan basado en el ID del documento de usuario
  async generarIdPlan(usuarioIdDocumento: string): Promise<string> {
    // Obtener el último plan de trabajo para el usuario actual, ordenado por idPlan de manera descendente
    const planesSnapshot = await this.firestore.collection('PlanesTrabajo', ref =>
      ref.where('idPlan', '>=', usuarioIdDocumento) // Filtra por el prefijo de idPlan
         .orderBy('idPlan', 'desc')
         .limit(1)
    ).get().toPromise();

    let planNumber = 1; // Comenzamos desde 1 si no hay planes anteriores

    // Si existe al menos un plan previo, obtener el último número en la secuencia
    if (planesSnapshot && !planesSnapshot.empty) {
      const lastPlanId = planesSnapshot.docs[0].id;
      
      // Extraer los últimos tres dígitos del `idPlan` actual y convertir a número
      const lastPlanNumber = parseInt(lastPlanId.slice(-3)); 
      
      // Incrementar el último número para obtener el siguiente en la secuencia
      planNumber = lastPlanNumber + 1;
    }

    // Formatear el número del plan a tres dígitos
    const planNumberFormatted = planNumber.toString().padStart(3, '0');

    // Concatenar el `usuarioIdDocumento` con el siguiente número en secuencia para formar el nuevo `idPlan`
    return `${usuarioIdDocumento}${planNumberFormatted}`;
  }

 // Método para guardar el plan de trabajo en Firebase
async guardarPlanTrabajoGrupo(planTrabajo: any): Promise<void> {
  const { idPlan } = planTrabajo;
  await this.firestore.collection('PlanesTrabajo').doc(idPlan).set(planTrabajo, { merge: true });
}

}
