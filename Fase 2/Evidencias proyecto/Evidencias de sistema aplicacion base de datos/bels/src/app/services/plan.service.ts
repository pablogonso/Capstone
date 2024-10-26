import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  constructor(private firestore: AngularFirestore) {}

  // Generar un ID único para el plan de trabajo
  generarIdPlan(usuarioId: string, numeroSecuencial: number): string {
    const numeroStr = numeroSecuencial.toString().padStart(3, '0');
    return `${usuarioId}${numeroStr}`;
  }

  // Guardar el plan de trabajo completo para un grupo en Firebase
  guardarPlanTrabajoGrupo(planTrabajo: any) {
    return this.firestore.collection('PlanesTrabajo').doc(planTrabajo.idPlan).set(planTrabajo);
  }
}
