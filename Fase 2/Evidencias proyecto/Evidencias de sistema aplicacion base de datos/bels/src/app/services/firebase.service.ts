import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PlanTrabajo } from 'src/app/models/plan-trabajo.models';
import { planesTrabajo } from '../Modelo/tareas.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


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

  // Método para guardar un plan de trabajo en Firebase
  async guardarPlanTrabajo(planTrabajo: PlanTrabajo) {
    try {
      await this.firestore.collection('PlanesTrabajo').add(planTrabajo);
      console.log("Plan de trabajo guardado:", planTrabajo);
    } catch (error) {
      console.error("Error al guardar el plan de trabajo:", error);
    }
  }

  // Método para obtener el último plan de trabajo basado en timestamp y idUsuario
  async obtenerUltimoPlanTrabajo(idUsuario: string): Promise<PlanTrabajo | null> {
    try {
      const snapshot = await this.firestore.collection('PlanesTrabajo', ref => 
        ref.where('idUsuario', '==', idUsuario) // Filtrar por idUsuario
           .orderBy('timestamp', 'desc')       // Ordenar por timestamp en orden descendente
           .limit(1)                           // Limitar a un solo documento
      ).get().toPromise();

      if (snapshot && !snapshot.empty) {
        const ultimoPlanDoc = snapshot.docs[0];
        const data = ultimoPlanDoc.data() as PlanTrabajo;
        data.id = ultimoPlanDoc.id; // Agregar el ID del documento para referencia futura
        console.log(`Último plan de trabajo obtenido para el usuario ${idUsuario}:`, data);
        return data;
      } else {
        console.warn("No se encontró ningún plan de trabajo para el usuario con ID:", idUsuario);
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el último plan de trabajo:", error);
      return null;
    }
  }

  // Otros métodos (sin cambios)...

  // Método para guardar respuestas en Firebase usando un ID de respuesta único
  async guardarRespuestasGrupo(usuarioId: string, grupo: string, respuestasArray: any[]) {
    const respuestasRef = this.firestore.collection(`Respuestas/${usuarioId}/tests`).doc();
    await respuestasRef.set({
      usuarioId,
      grupo,
      respuestas: respuestasArray,
      timestamp: new Date()
    });
    return { id: respuestasRef.ref.id };
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
    const respuestasRef = this.firestore.collection('Respuestas').doc(idPersonalizado);
    await respuestasRef.set({
      usuarioId,
      grupo,
      respuestas: respuestasArray,
      timestamp: new Date(),
    });
    return respuestasRef;
  }

  





}
