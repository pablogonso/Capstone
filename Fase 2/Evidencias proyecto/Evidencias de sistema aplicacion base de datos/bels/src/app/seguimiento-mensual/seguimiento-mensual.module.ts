import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SeguimientoMensualPageRoutingModule } from './seguimiento-mensual-routing.module';
import { SeguimientoMensualPage } from './seguimiento-mensual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeguimientoMensualPageRoutingModule,
  ],
  declarations: [SeguimientoMensualPage],
})
export class SeguimientoMensualPageModule {}
