import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagBienvenidaPage } from './pag-bienvenida.page';

const routes: Routes = [
  {
    path: '',
    component: PagBienvenidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagBienvenidaPageRoutingModule {}
