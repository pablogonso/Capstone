import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Para obtener el estado de autenticación

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth, // Firebase Authentication para obtener el estado
    private router: Router
  ) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          console.log('Usuario autenticado:', user);
          resolve(true); // Usuario autenticado, acceso permitido
        } else {
          console.log('Usuario no autenticado, redirigiendo al login.');
          this.router.navigate(['/login']); // Redirigir al login
          resolve(false); // No autenticado, acceso denegado
        }
      });
    });
  }
}
