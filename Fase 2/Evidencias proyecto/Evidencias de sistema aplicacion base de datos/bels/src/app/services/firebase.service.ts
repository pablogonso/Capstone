// src/app/services/firebase.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore) {}

  // Método para obtener las respuestas desde la colección "Respuestas"
  getRespuestas(): Observable<any[]> {
    return this.firestore.collection('Respuestas').valueChanges();
  }
}
