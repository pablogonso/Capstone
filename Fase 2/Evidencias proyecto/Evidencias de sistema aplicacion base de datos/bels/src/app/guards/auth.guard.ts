import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, take, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          console.log('Usuario no autenticado, redirigiendo al login.');
          this.router.navigate(['/login']);
          return of(false);
        }

        // Verificar si el usuario tiene un registro en Firestore
        const userId = user.uid;
        return this.firestore
          .collection('UsuariosRegistrados')
          .doc(userId)
          .get()
          .pipe(
            map((doc) => {
              if (doc.exists) {
                return true; // Usuario autenticado y con datos en Firestore
              } else {
                console.log('No se encontraron registros para el usuario:', userId);
                this.router.navigate(['/ingresar-datos']); // Redirige a una página para completar datos
                return false;
              }
            }),
            catchError((error) => {
              console.error('Error al verificar el registro del usuario:', error);
              this.router.navigate(['/login']); // Redirige al login en caso de error
              return of(false);
            })
          );
      })
    );
  }
}
