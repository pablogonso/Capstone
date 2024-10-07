import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerResultadosPage } from './ver-resultados.page';

const routes: Routes = [
  {
    path: '',
    component: VerResultadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerResultadosPageRoutingModule {}
