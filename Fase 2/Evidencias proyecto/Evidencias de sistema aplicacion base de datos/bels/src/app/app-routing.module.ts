import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'ingresar-datos',
    loadChildren: () => import('./ingresar-datos/ingresar-datos.module').then( m => m.IngresarDatosPageModule)
  },
  {
    path: 'cuenta-creada',
    loadChildren: () => import('./cuenta-creada/cuenta-creada.module').then( m => m.CuentaCreadaPageModule)
  },
  {
    path: 'plan-pruebas',
    loadChildren: () => import('./plan-pruebas/plan-pruebas.module').then( m => m.PlanPruebasPageModule)
  },  {
    path: 'pag-bienvenida',
    loadChildren: () => import('./pag-bienvenida/pag-bienvenida.module').then( m => m.PagBienvenidaPageModule)
  },
  {
    path: 'realizar-test',
    loadChildren: () => import('./realizar-test/realizar-test.module').then( m => m.RealizarTestPageModule)
  },
  {
    path: 'ver-resultados',
    loadChildren: () => import('./ver-resultados/ver-resultados.module').then( m => m.VerResultadosPageModule)
  },
  {
    path: 'plan-de-trabajo',
    loadChildren: () => import('./plan-de-trabajo/plan-de-trabajo.module').then( m => m.PlanDeTrabajoPageModule)
  },
  {
    path: 'actividades',
    loadChildren: () => import('./actividades/actividades.module').then( m => m.ActividadesPageModule)
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
