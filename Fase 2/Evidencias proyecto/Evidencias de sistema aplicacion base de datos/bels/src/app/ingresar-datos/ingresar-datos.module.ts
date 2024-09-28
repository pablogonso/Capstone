import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IngresarDatosPageRoutingModule } from './ingresar-datos-routing.module';
import { IngresarDatosPage } from './ingresar-datos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngresarDatosPageRoutingModule
  ],
  declarations: [IngresarDatosPage]
})
export class IngresarDatosPageModule {}
