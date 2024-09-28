import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentaCreadaPage } from './cuenta-creada.page';

const routes: Routes = [
  {
    path: '',
    component: CuentaCreadaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentaCreadaPageRoutingModule {}
