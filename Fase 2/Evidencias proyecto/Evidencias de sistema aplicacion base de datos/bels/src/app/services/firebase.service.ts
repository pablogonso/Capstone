import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { PlanTrabajo } from 'src/app/models/plan-trabajo.models';
import { planesTrabajo } from '../Modelo/tareas.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {}

  // Configuración del día de corte
  private DIA_CORTE = 'Jueves'; // Día configurable

  // Método para obtener el ID de usuario logueado en Firebase
  async obtenerIdUsuarioDocumento(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    if (!user) {
      console.error("Usuario no autenticado");
      return null;
    }

    const snapshot = await this.firestore.collection('UsuariosRegistrados', (ref) =>
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

  // Método público para obtener el día de corte
obtenerDiaDeCorte(): string {
  return this.DIA_CORTE; // Retorna el valor de DIA_CORTE
}


  // Método para obtener documentos de RegistroActividadesDiarias en un rango de fechas
  async obtenerDocumentosDeRango(idUsuario: string): Promise<any[]> {
    try {
      // Calcula las fechas de lunes a día de corte
      const hoy = new Date();
      const diaSemana = hoy.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
      const diasCorte = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const indiceCorte = diasCorte.indexOf(this.DIA_CORTE);

      if (indiceCorte === -1) {
        console.error('Día de corte inválido:', this.DIA_CORTE);
        return [];
      }

      // Calcula el rango de fechas (lunes a día de corte)
      const lunes = new Date(hoy);
      lunes.setDate(hoy.getDate() - diaSemana + 1); // Mueve al lunes de esta semana
      const diaCorte = new Date(lunes);
      diaCorte.setDate(lunes.getDate() + (indiceCorte - 1)); // Avanza hasta el día de corte

      console.log(`Buscando documentos desde ${lunes} hasta ${diaCorte}`);

      // Consulta documentos en el rango de fechas
      const snapshot = await this.firestore
        .collection('RegistroActividadesDiarias', (ref) =>
          ref
            .where('idUsuario', '==', idUsuario)
            .where('timestamp', '>=', lunes)
            .where('timestamp', '<=', diaCorte)
            .orderBy('timestamp', 'asc')
        )
        .get()
        .toPromise();

      if (snapshot && !snapshot.empty) {
        const documentos = snapshot.docs.map((doc) => doc.data());
        console.log(`Se encontraron ${documentos.length} documentos en el rango.`);
        return documentos;
      } else {
        console.warn('No se encontraron documentos en el rango especificado.');
        return [];
      }
    } catch (error) {
      console.error('Error al obtener documentos de rango:', error);
      return [];
    }
  }

  // Método para actualizar el campo PlanCompletado en el documento más reciente de PlanesTrabajo
  async actualizarPlanCompletado(idUsuario: string): Promise<boolean> {
    try {
      // Obtiene el último plan de trabajo
      const snapshot = await this.firestore
        .collection('PlanesTrabajo', (ref) =>
          ref
            .where('idUsuario', '==', idUsuario)
            .orderBy('timestamp', 'desc')
            .limit(1)
        )
        .get()
        .toPromise();

      if (snapshot && !snapshot.empty) {
        const planDoc = snapshot.docs[0];
        const planId = planDoc.id;

        // Actualiza el campo PlanCompletado
        await this.firestore
          .collection('PlanesTrabajo')
          .doc(planId)
          .update({ planCompletado: true });

        console.log(`Plan de trabajo actualizado como completado para el usuario ${idUsuario}.`);
        return true;
      } else {
        console.warn('No se encontró un plan de trabajo para el usuario:', idUsuario);
        return false;
      }
    } catch (error) {
      console.error('Error al actualizar el plan de trabajo:', error);
      return false;
    }
  }

  // Método para verificar si todas las actividades están completadas
  async verificarActividadesCompletadas(idUsuario: string): Promise<boolean> {
    try {
      const documentos = await this.obtenerDocumentosDeRango(idUsuario);

      // Revisa que todos los documentos tengan actividades completas
      const todasCompletadas = documentos.every((doc) =>
        doc.ActividadesRealizadas?.every((actividad: any) => actividad.Completo === true)
      );

      console.log(`Actividades completadas: ${todasCompletadas}`);
      return todasCompletadas;
    } catch (error) {
      console.error('Error al verificar actividades completadas:', error);
      return false;
    }
  }





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

  
  async obtenerNombreUsuario(): Promise<string | null> {
    try {
      const user = await this.afAuth.currentUser; // Obtiene el usuario autenticado
      if (!user || !user.email) {
        console.error("Usuario no autenticado o sin correo");
        return null;
      }
  
      // Consulta en Firestore el documento del usuario autenticado
      const snapshot = await this.firestore.collection('UsuariosRegistrados', ref =>
        ref.where('correo', '==', user.email)
      ).get().toPromise();
  
      if (!snapshot || snapshot.empty) { // Validación explícita
        console.warn("No se encontró un documento para el usuario");
        return null;
      }
  
      // Obtén el nombre del usuario
      const usuarioDoc = snapshot.docs[0];
      const usuarioData = usuarioDoc.data() as { nombre: string };
  
      return usuarioData.nombre;
    } catch (error) {
      console.error("Error al obtener el nombre del usuario:", error);
      return null;
    }
  }
  
  async obtenerActividadesDiarias(idUsuario: string): Promise<any[]> {
    try {
      const snapshot = await this.firestore
        .collection('RegistroActividadesDiarias', ref =>
          ref.where('idUsuario', '==', idUsuario) // Filtrar por idUsuario
        )
        .get()
        .toPromise();
  
      if (snapshot && !snapshot.empty) {
        const actividades: any[] = [];
        snapshot.docs.forEach(doc => {
          const docData = doc.data() as {
            timestamp?: any; // Campo opcional para evitar errores
            ActividadesRealizadas?: { Actividad: string; Completo: boolean }[];
          };
  
          // Verificar si el timestamp existe
          const timestamp = docData.timestamp ? docData.timestamp.toDate() : null;
          if (!timestamp) {
            console.warn(`El documento con ID ${doc.id} no tiene un campo timestamp.`);
            return; // Saltar este documento si no tiene un timestamp
          }
  
          const actividadesRealizadas = docData.ActividadesRealizadas || [];
          actividadesRealizadas.forEach((actividad: { Actividad: string; Completo: boolean }) => {
            actividades.push({
              ...actividad,
              Fecha: timestamp, // Usar el timestamp del nivel superior
            });
          });
        });
  
        console.log(`Actividades obtenidas para el usuario ${idUsuario}:`, actividades);
        return actividades;
      } else {
        console.warn(`No se encontraron actividades para el usuario con ID: ${idUsuario}`);
        return [];
      }
    } catch (error) {
      console.error('Error al obtener actividades diarias:', error);
      return [];
    }
  }

  async obtenerUltimoRegistroActividades(idUsuario: string): Promise<{ id: string; data: any } | null> {
    try {
      // Realiza la consulta a Firebase
      const snapshot = await this.firestore
        .collection('RegistroActividadesDiarias', (ref) =>
          ref.where('idUsuario', '==', idUsuario) // Filtra por el ID del usuario
            .orderBy('timestamp', 'desc')       // Ordena por timestamp descendente
            .limit(1)                           // Limita a un solo documento
        )
        .get()
        .toPromise();
  
      // Validar si el snapshot contiene datos
      if (snapshot && !snapshot.empty) {
        const ultimoDoc = snapshot.docs[0]; // Obtiene el primer documento
        const data = ultimoDoc.data(); // Datos del documento
  
        // Agregar el ID del documento al objeto de retorno
        console.log('Último registro de actividades obtenido:', { id: ultimoDoc.id, data });
        return { id: ultimoDoc.id, data }; // Retornar el ID y los datos del documento
      } else {
        console.warn('No se encontraron registros para el usuario:', idUsuario);
        return null; // Retornar null si no hay datos
      }
    } catch (error) {
      console.error('Error al obtener el último registro de actividades:', error);
      return null; // Retornar null en caso de error
    }
  }
  
  
  async guardarRegistroActividades(registro: any): Promise<void> {
    try {
      await this.firestore.collection('RegistroActividadesDiarias').add(registro);
      console.log('Registro guardado correctamente en RegistroActividadesDiarias.');
    } catch (error) {
      console.error('Error al guardar el registro en RegistroActividadesDiarias:', error);
      throw error;
    }
  }

  async actualizarActividades(idUsuario: string, actividades: any[]): Promise<void> {
    try {
      // Filtra por idUsuario y ordena por timestamp descendente, limitando a 1
      const snapshot = await this.firestore
        .collection('RegistroActividadesDiarias', (ref) =>
          ref.where('idUsuario', '==', idUsuario)
            .orderBy('timestamp', 'desc') // Orden descendente
            .limit(1)                    // Solo un documento
        )
        .get()
        .toPromise();

      // Verifica si el documento existe
      if (snapshot && !snapshot.empty) {
        const registroDoc = snapshot.docs[0]; // Obtiene el documento más reciente
        const registroId = registroDoc.id; // ID del documento

        // Define un tipo explícito para registroData
        const registroData = registroDoc.data() as { ActividadesRealizadas: any[] }; // Añade el tipo esperado

        // Verifica si el campo `ActividadesRealizadas` existe y es un array
        if (!registroData || !Array.isArray(registroData.ActividadesRealizadas)) {
          console.warn(`El documento con ID ${registroId} no tiene actividades registradas o el campo es inválido.`);
          return; // Salir si no hay actividades para actualizar
        }

        // Estructura las actividades actualizadas
        const actividadesActualizadas = actividades.map((actividad) => ({
          ...actividad,
          Completo: actividad.Completo ?? false, // Asegúrate de mantener la propiedad Completo
        }));

        // Actualiza el documento en Firebase
        await this.firestore
          .collection('RegistroActividadesDiarias')
          .doc(registroId)
          .update({ ActividadesRealizadas: actividadesActualizadas });

        console.log('Actividades actualizadas correctamente en Firebase para el registro:', registroId);
      } else {
        console.warn('No se encontró un registro de actividades para el usuario:', idUsuario);
      }
    } catch (error) {
      console.error('Error al actualizar las actividades:', error);
    }
  }
}
