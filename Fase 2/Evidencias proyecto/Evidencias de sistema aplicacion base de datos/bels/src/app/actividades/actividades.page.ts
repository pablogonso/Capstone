import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ActividadesComponent } from './actividades.component';

@NgModule({
  declarations: [ActividadesComponent], // Declara los componentes que pertenecen a este módulo
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [ActividadesComponent] // Exporta los componentes que quieras usar fuera de este módulo
})
export class ActividadesModule { }
