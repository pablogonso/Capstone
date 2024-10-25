import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Servicio de autenticación
import { NavController } from '@ionic/angular'; // NavController para redirigir
import { AlertController } from '@ionic/angular'; // Para mostrar alertas en caso de error
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private afAuth : AngularFireAuth,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertController: AlertController // Para mostrar errores
  ) { }

  onSubmit() {
    this.authService.login(this.email, this.password)
      .then(() => {
        this.navCtrl.navigateForward('/pag-bienvenida');
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        this.presentAlert('Error al iniciar sesión', 'Credenciales incorrectas o usuario no registrado');
      });
  }

  goToRegister() {
    // Redirigir a la página de creación de cuenta
    this.navCtrl.navigateForward('/ingresar-datos');
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  recuperarContrasena() {
    if (!this.email) {
      this.presentAlert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    this.authService.recuperarContrasena(this.email)
      .then(() => {
        this.presentAlert('Correo Enviado', 'Por favor revisa tu correo electrónico para restablecer tu contraseña');
      })
      .catch(error => {
        if (error.message === 'Este correo no está registrado') {
          this.presentAlert('Error', 'El correo ingresado no se encuentra registrado. Verifica e intenta nuevamente.');
        } else {
          this.presentAlert('Error', 'No se pudo enviar el correo de recuperación. Intenta nuevamente.');
        }
      });
  }



}

