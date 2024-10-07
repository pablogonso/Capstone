import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RealizarTestPage } from './realizar-test.page';

const routes: Routes = [
  {
    path: '',
    component: RealizarTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RealizarTestPageRoutingModule {}
