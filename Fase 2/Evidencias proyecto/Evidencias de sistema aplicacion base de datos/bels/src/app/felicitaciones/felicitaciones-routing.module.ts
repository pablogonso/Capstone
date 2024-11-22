import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FelicitacionesPage } from './felicitaciones.page';

const routes: Routes = [
  {
    path: '',
    component: FelicitacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FelicitacionesPageRoutingModule {}
