import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa Firebase Authentication
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importa Firestore para guardar los datos adicionales
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth, // Inyecta Firebase Authentication
    private firestore: AngularFirestore, // Inyecta Firestore
    private router: Router // Para redirigir después de la autenticación
  ) { }

  // Función para registrar un nuevo usuario
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Función para iniciar sesión con correo y contraseña
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Función para cerrar sesión
  logout() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']); // Redirigir al login después de cerrar sesión
    });
  }

  // Función para guardar datos adicionales del usuario en Firestore
  guardarDatosUsuario(uid: string, nombre: string, apellido: string, edad: number, correo: string) {
    return this.firestore.collection('UsuariosRegistrados').doc(uid).set({
      nombre: nombre,
      apellido: apellido,
      edad: edad,
      correo: correo
    });
  }

  recuperarContrasena(email: string) {
    return this.afAuth.sendPasswordResetEmail(email)
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          throw new Error('Este correo no está registrado');
        }
        throw error;
      });
  }

}

