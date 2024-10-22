import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VerActividadesComponent } from '../componentes/ver-actividades/ver-actividades.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [VerActividadesComponent],
  exports: [VerActividadesComponent] // Exportar si necesitas usarlo en otros módulos
})
export class ActividadesModule {}