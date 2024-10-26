import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ActividadesModule } from './actividades/actividades.module'; // Importar el módulo aquí


// Firebase y AngularFire
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Importar Firestore de AngularFire
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // Importar módulo de autenticación
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ActividadesModule,
    // Inicializar Firebase
    AngularFireModule.initializeApp(environment.firebase), // Configuración de Firebase
    AngularFirestoreModule,  // Módulo para usar Firestore
    AngularFireAuthModule    // Módulo para usar Firebase Authentication
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
