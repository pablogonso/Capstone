import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  // Método para obtener el ID de usuario logueado en Firebase
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

  // Método para obtener el último test guardado para un usuario específico basado en el ID de usuario en el nombre del documento
  async obtenerUltimoTestGuardado(usuarioIdDocumento: string): Promise<any> {
    try {
      const snapshot = await this.firestore.collection('Respuestas', ref =>
        ref.where('id', '>=', usuarioIdDocumento + '000') // Filtra usando el prefijo exacto del usuario
           .where('id', '<=', usuarioIdDocumento + '\uf8ff') // Limita el rango para solo incluir IDs del usuario actual
           .orderBy('id', 'desc') // Ordena en orden descendente para traer el ID más alto
           .limit(1) // Obtiene solo el último documento
      ).get().toPromise();

      if (snapshot && !snapshot.empty) {
        const ultimoTestDoc = snapshot.docs[0];
        console.log(`ID del último test encontrado para el usuario ${usuarioIdDocumento}: ${ultimoTestDoc.id}`);
        return ultimoTestDoc.data();  // Retorna los datos del último documento encontrado
      } else {
        console.warn(`No se encontró un test guardado para el usuario: ${usuarioIdDocumento}`);
        return null;
      }
    } catch (error) {
      console.error(`Error al obtener el último test guardado para el usuario ${usuarioIdDocumento}:`, error);
      return null;
    }
  }

  // Guardar respuestas como un nuevo documento en Firebase usando un ID de respuesta único
  async guardarRespuestasGrupo(usuarioId: string, grupo: string, respuestasArray: any[]) {
    const respuestasRef = this.firestore.collection('Respuestas').doc(); // Creamos una referencia a un nuevo documento
    await respuestasRef.set({
      usuarioId,
      grupo,
      respuestas: respuestasArray,
      timestamp: new Date()
    });
    return { id: respuestasRef.ref.id }; // Devuelve el ID del documento correctamente
  }
  

  // Generar un ID único de respuesta basado en el ID del usuario
  async generarIdRespuesta(usuarioIdDocumento: string): Promise<string> {
    const userDoc = await this.firestore.collection('UsuariosRegistrados').doc(usuarioIdDocumento).get().toPromise();
    let contador = 1;

    if (userDoc && userDoc.exists) {
      const userData = userDoc.data() as { contadorRespuestas?: number };
      contador = (userData?.contadorRespuestas || 0) + 1;

      await this.firestore.collection('UsuariosRegistrados').doc(usuarioIdDocumento).update({
        contadorRespuestas: contador
      });
    } else {
      await this.firestore.collection('UsuariosRegistrados').doc(usuarioIdDocumento).set(
        { contadorRespuestas: contador },
        { merge: true }
      );
    }

    const contadorFormatted = contador.toString().padStart(3, '0');
    return `${usuarioIdDocumento}${contadorFormatted}`;
  }

  // Obtener respuestas filtradas por grupo activo en la colección 'Respuestas'
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

  // Obtener respuestas por ID de documento
  async obtenerRespuestasPorId(respuestasId: string): Promise<any[]> {
    const doc = await this.firestore.collection('Respuestas').doc(respuestasId).get().toPromise();
    if (doc && doc.exists) {
      const data = doc.data() as { respuestas: any[] };
      return data.respuestas || [];
    } else {
      throw new Error("No se encontró el documento con el ID especificado.");
    }
  }
  
  async guardarRespuestasGrupoConId(usuarioId: string, grupo: string, respuestasArray: any[], idPersonalizado: string) {
    const respuestasRef = this.firestore.collection('Respuestas').doc(idPersonalizado); // Usa el ID personalizado como documento
    await respuestasRef.set({
      usuarioId,
      grupo,
      respuestas: respuestasArray,
      timestamp: new Date()
    });
    return respuestasRef; // Devuelve la referencia del documento
  }
  

}
