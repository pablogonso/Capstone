import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from '@ionic/angular'; // Importa NavController

@Component({
  selector: 'app-ingresar-datos',
  templateUrl: './ingresar-datos.page.html',
  styleUrls: ['./ingresar-datos.page.scss'],
})
export class IngresarDatosPage {
  nombre: string = '';
  apellido: string = '';
  edad: number = 0; // Inicializado en 0
  correo: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';

  constructor(private navCtrl: NavController) {} // Inyecta NavController

  onSubmit() {
    console.log('Formulario enviado', {
      nombre: this.nombre,
      apellido: this.apellido,
      edad: this.edad,
      correo: this.correo,
      contrasena: this.contrasena,
      confirmarContrasena: this.confirmarContrasena
    });

    // Redirigir a la página de cuenta creada
    this.navCtrl.navigateForward('/cuenta-creada');
  }
}
