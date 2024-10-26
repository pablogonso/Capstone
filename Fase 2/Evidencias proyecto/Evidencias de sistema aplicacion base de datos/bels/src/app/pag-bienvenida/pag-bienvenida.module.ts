import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PagBienvenidaPageRoutingModule } from './pag-bienvenida-routing.module';
import { PagBienvenidaPage } from './pag-bienvenida.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagBienvenidaPageRoutingModule
  ],
  declarations: [PagBienvenidaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]  // Para permitir el uso de componentes personalizados
})
export class PagBienvenidaPageModule {}
