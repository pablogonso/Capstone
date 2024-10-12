import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanPruebasLangchainPage } from './plan-pruebas-langchain.page';

const routes: Routes = [
  {
    path: '',
    component: PlanPruebasLangchainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanPruebasLangchainPageRoutingModule {}
