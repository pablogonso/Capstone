import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular'; // Importa NavController
import { AuthService } from '../services/auth.service'; 
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Para guardar los datos en Firestore

@Component({
  selector: 'app-ingresar-datos',
  templateUrl: './ingresar-datos.page.html',
  styleUrls: ['./ingresar-datos.page.scss'],
})
export class IngresarDatosPage {
  nombre: string = '';
  apellido: string = '';
  edad: | null = null; // Inicializado en 0
  correo: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';

  constructor(
    private navCtrl: NavController,
    private authService: AuthService, // Inyecta AuthService
    private firestore: AngularFirestore // Inyecta Firestore
  ) {}

  onSubmit() {
    if (this.contrasena !== this.confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Registrar al usuario en Firebase Authentication
    this.authService.register(this.correo, this.contrasena)
      .then((userCredential) => {
        const userId = userCredential.user?.uid; // Obtener el UID del usuario registrado

        // Guardar los datos adicionales del usuario en la colección 'UsuariosRegistrados'
        this.firestore.collection('UsuariosRegistrados').doc(userId).set({
          nombre: this.nombre,
          apellido: this.apellido,
          edad: this.edad,
          correo: this.correo,
        })
        .then(() => {
          console.log('Datos adicionales del usuario guardados en la colección UsuariosRegistrados');
          // Redirigir a la página de cuenta creada
          this.navCtrl.navigateForward('/cuenta-creada');
        })
        .catch(error => {
          console.error('Error al guardar los datos en Firestore:', error);
        });
      })
      .catch((error) => {
        console.error('Error al registrar el usuario en Firebase Authentication:', error);
       
      });
  }
}
