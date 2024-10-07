import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BelsService {

  constructor(private firestore: AngularFirestore) { }

  // Obtener todas las preguntas de la colección 'Preguntas'
  getPreguntas(): Observable<any[]> {
    return this.firestore.collection('Preguntas').valueChanges();
  }
}
