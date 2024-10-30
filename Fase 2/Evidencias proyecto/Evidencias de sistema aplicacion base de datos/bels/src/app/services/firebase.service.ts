// src/app/services/firebase.service.ts

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  // Método para obtener las respuestas desde la colección "Respuestas"
  getRespuestas(): Observable<any[]> {
    return this.firestore.collection('Respuestas').valueChanges();
  }

  // Nuevo método para obtener el ID de documento de usuario en "UsuariosRegistrados"
  async obtenerIdUsuarioDocumento(): Promise<string | null> {
    // Obtener el usuario autenticado actual
    const user = await this.afAuth.currentUser;
    if (!user) {
      console.error("Usuario no autenticado");
      return null;
    }

    // Buscar el documento en "UsuariosRegistrados" donde el correo coincida con el usuario actual
    const snapshot = await this.firestore.collection('UsuariosRegistrados', ref => 
      ref.where('correo', '==', user.email)
    ).get().toPromise();

    // Verificar si `snapshot` es `undefined` o vacío
    if (!snapshot || snapshot.empty) {
      console.error("No se encontró un documento para el usuario");
      return null;
    }

    return snapshot.docs[0].id;
  }
}
