import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeguimientoMensualPage } from './seguimiento-mensual.page';

const routes: Routes = [
  {
    path: '',
    component: SeguimientoMensualPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeguimientoMensualPageRoutingModule {}
