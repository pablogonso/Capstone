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

  // Método para obtener el ID de documento de usuario en "UsuariosRegistrados"
  async obtenerIdUsuarioDocumento(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    if (!user) {
      console.error("Usuario no autenticado");
      return null;
    }

    const snapshot = await this.firestore.collection('UsuariosRegistrados', ref => 
      ref.where('correo', '==', user.email)
    ).get().toPromise();

    if (!snapshot || snapshot.empty) {
      console.error("No se encontró un documento para el usuario");
      return null;
    }

    return snapshot.docs[0].id;
  }

  // Método para generar un ID único de respuesta basado en el ID del usuario y el contador
  async generarIdRespuesta(usuarioIdDocumento: string): Promise<string> {
    const userDoc = await this.firestore.collection('UsuariosRegistrados').doc(usuarioIdDocumento).get().toPromise();
    let contador = 1;

    if (userDoc && userDoc.exists) {
      const userData = userDoc.data() as { contadorRespuestas?: number };
      contador = (userData?.contadorRespuestas || 0) + 1;

      // Actualizar el contador en el documento del usuario
      await this.firestore.collection('UsuariosRegistrados').doc(usuarioIdDocumento).update({
        contadorRespuestas: contador
      });
    } else {
      // Si no existe el campo `contadorRespuestas`, inicializarlo en el documento del usuario
      await this.firestore.collection('UsuariosRegistrados').doc(usuarioIdDocumento).set(
        { contadorRespuestas: contador }, 
        { merge: true }
      );
    }

    const contadorFormatted = contador.toString().padStart(3, '0');
    return `${usuarioIdDocumento}${contadorFormatted}`;
  }

  // Guardar respuestas como un nuevo documento en Firebase usando un ID de respuesta único
  async guardarRespuestasGrupo(usuarioIdDocumento: string, grupo: string, respuestas: any[]): Promise<void> {
    const idRespuesta = await this.generarIdRespuesta(usuarioIdDocumento);

    // Verificar si el documento ya existe y, en caso afirmativo, crear uno nuevo
    const docRef = this.firestore.collection('Respuestas').doc(idRespuesta);
    const docSnapshot = await docRef.get().toPromise();

    if (docSnapshot?.exists) {
      console.warn(`Documento con ID ${idRespuesta} ya existe, generando un nuevo ID.`);
      return this.guardarRespuestasGrupo(usuarioIdDocumento, grupo, respuestas); // Llamada recursiva para intentar guardar con un nuevo ID
    }

    // Guardar en un documento nuevo, evitando merge para evitar sobreescrituras
    await docRef.set({
      grupo: grupo,
      respuestas: respuestas
    });
    console.log(`Respuestas guardadas correctamente con ID: ${idRespuesta}`);
  }

  // Método para obtener respuestas filtradas por grupo activo en la colección 'Respuestas'
  async getRespuestasPorGrupo(grupoActivo: string): Promise<any[]> {
    console.log(`Intentando obtener respuestas para el grupo: ${grupoActivo}`);
    try {
      const snapshot = await this.firestore.collection('Respuestas', ref => 
        ref.where('grupo', '==', grupoActivo)
      ).get().toPromise();

      if (snapshot && !snapshot.empty) {
        const respuestasFiltradas = snapshot.docs
          .map(doc => {
            const data = doc.data() as { respuestas: any[] };
            return data.respuestas || [];
          })
          .reduce((acc, val) => acc.concat(val), []);

        if (respuestasFiltradas.length > 0) {
          console.log(`Respuestas obtenidas para el grupo ${grupoActivo}:`, respuestasFiltradas);
        } else {
          console.warn(`No se encontraron respuestas específicas para el grupo ${grupoActivo}.`);
        }

        return respuestasFiltradas;
      } else {
        console.warn(`No se encontraron documentos en la colección 'Respuestas' para el grupo: ${grupoActivo}`);
        return [];
      }
    } catch (error) {
      console.error(`Error al intentar obtener respuestas para el grupo ${grupoActivo}:`, error);
      return [];
    }
  }
}




