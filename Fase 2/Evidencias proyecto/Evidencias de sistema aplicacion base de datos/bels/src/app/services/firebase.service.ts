// src/app/services/firebase.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { planesTrabajo } from '../Modelo/tareas.model';


interface PlanTrabajo {
  idGrupo: string;
  preguntasPlanes: { plan: string }[];
}



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  
  constructor(private firestore: AngularFirestore) {}

  // Método para obtener las respuestas desde la colección "Respuestas"
  getRespuestas(): Observable<any[]> {
    return this.firestore.collection('Respuestas').valueChanges();
  }

  getPlanTrabajo(docId: string): Observable<PlanTrabajo> {
    return this.firestore.collection<PlanTrabajo>('PlanesTrabajo').doc(docId).valueChanges().pipe(
      map(data => {
        if (data) {
          return data;
        } else {
          return { idGrupo: '', preguntasPlanes: [] }; // Valor por defecto si data es undefined
        }
      })
    );
  }
}



