import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Servicio de autenticación
import { NavController } from '@ionic/angular'; // NavController para redirigir
import { AlertController } from '@ionic/angular'; // Para mostrar alertas en caso de error

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService, 
    private navCtrl: NavController,
    private alertController: AlertController // Para mostrar errores
  ) {}

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
}
