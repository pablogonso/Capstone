import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IngresarDatosPage } from './ingresar-datos.page';

const routes: Routes = [
  {
    path: '',
    component: IngresarDatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngresarDatosPageRoutingModule {}
