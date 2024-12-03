import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FelicitacionesFinalPage } from './felicitaciones-final.page';

const routes: Routes = [
  {
    path: '',
    component: FelicitacionesFinalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FelicitacionesFinalPageRoutingModule {}
