import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importa el guardia de autenticación

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard] // Protección con AuthGuard
  },
  {
    path: '',
    redirectTo: 'home', // Redirigir a 'home' por defecto
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'ingresar-datos',
    loadChildren: () => import('./ingresar-datos/ingresar-datos.module').then(m => m.IngresarDatosPageModule)
  },
  {
    path: 'cuenta-creada',
    loadChildren: () => import('./cuenta-creada/cuenta-creada.module').then(m => m.CuentaCreadaPageModule)
  },
  {
    path: 'plan-pruebas-langchain',
    loadChildren: () => import('./plan-pruebas-langchain/plan-pruebas-langchain.module').then(m => m.PlanPruebasLangchainPageModule),
    canActivate: [AuthGuard] // Protección con AuthGuard
  },
  {
    path: 'plan-pruebas',
    loadChildren: () => import('./plan-pruebas/plan-pruebas.module').then(m => m.PlanPruebasPageModule),
    canActivate: [AuthGuard] // Protección con AuthGuard
  },
  {
    path: 'pag-bienvenida',
    loadChildren: () => import('./pag-bienvenida/pag-bienvenida.module').then(m => m.PagBienvenidaPageModule),
    canActivate: [AuthGuard] // Protección con AuthGuard
  },
  {
    path: 'realizar-test',
    loadChildren: () => import('./realizar-test/realizar-test.module').then(m => m.RealizarTestPageModule),
    canActivate: [AuthGuard] // Protección con AuthGuard
  },
  {
    path: 'ver-resultados',
    loadChildren: () => import('./ver-resultados/ver-resultados.module').then(m => m.VerResultadosPageModule),
    canActivate: [AuthGuard] // Protección con AuthGuard
  },
  {
    path: 'plan-de-trabajo',
    loadChildren: () => import('./plan-de-trabajo/plan-de-trabajo.module').then(m => m.PlanDeTrabajoPageModule),
    canActivate: [AuthGuard] // Protección con AuthGuard
  },
  {
    path: 'actividades',
    loadChildren: () => import('./actividades/actividades.module').then(m => m.ActividadesModule),
    canActivate: [AuthGuard] // Protección con AuthGuard
  },
  {
    path: 'instrucciones',
    loadChildren: () => import('./instrucciones/instrucciones.module').then(m => m.InstruccionesPageModule),
    canActivate: [AuthGuard] // Protección con AuthGuard
  },
  {
    path: 'seguimiento-mensual',
    loadChildren: () => import('./seguimiento-mensual/seguimiento-mensual.module').then(m => m.SeguimientoMensualPageModule),
    canActivate: [AuthGuard] // Protección con AuthGuard
  },
  {
    path: 'felicitaciones',
    loadChildren: () => import('./felicitaciones/felicitaciones.module').then(m => m.FelicitacionesPageModule),
    canActivate: [AuthGuard] // Protección con AuthGuard
  },
  {
    path: 'plan-creado',
    loadChildren: () => import('./plan-creado/plan-creado.module').then( m => m.PlanCreadoPageModule)
  },
  {
    path: '**',
    redirectTo: 'home' // Redirigir a 'home' cualquier ruta no encontrada
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
