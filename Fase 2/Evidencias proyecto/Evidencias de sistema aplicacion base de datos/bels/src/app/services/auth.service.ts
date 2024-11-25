import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  // Función para registrar un nuevo usuario
  register(email: string, password: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .catch(error => {
        console.error('Error al registrar el usuario:', error);
        throw error;
      });
  }

  // Función para iniciar sesión con correo y contraseña
  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        throw error;
      });
  }

  // Función para cerrar sesión
  logout(): Promise<void> {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']); // Redirigir al login después de cerrar sesión
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
      throw error;
    });
  }

  // Función para guardar datos adicionales del usuario en Firestore
  guardarDatosUsuario(uid: string, nombre: string, apellido: string, edad: number, correo: string): Promise<void> {
    return this.firestore.collection('UsuariosRegistrados').doc(uid).set({
      nombre,
      apellido,
      edad,
      correo
    }).catch(error => {
      console.error('Error al guardar datos del usuario:', error);
      throw error;
    });
  }

  // Recuperar contraseña
  recuperarContrasena(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email).catch(error => {
      if (error.code === 'auth/user-not-found') {
        throw new Error('Este correo no está registrado');
      }
      throw error;
    });
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user) // Devuelve true si el usuario está autenticado
    );
  }

  // Obtener el UID del usuario actual
  getCurrentUserUID(): Promise<string | null> {
    return this.afAuth.currentUser.then(user => user ? user.uid : null);
  }
}
