import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsuarioGuard } from './guards/usuario.guard';

const routes: Routes = [
  {
    path: 'main',
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule'
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule'},
  { path: 'basura', loadChildren: './pages/basura/basura.module#BasuraPageModule' },
  { path: 'califica', loadChildren: './pages/califica/califica.module#CalificaPageModule' },
  { path: 'ejemplos', loadChildren: './pages/ejemplos/ejemplos.module#EjemplosPageModule' },
  { path: 'nueva-basura', loadChildren: './pages/nueva-basura/nueva-basura.module#NuevaBasuraPageModule' },
  { path: 'zona', loadChildren: './pages/zona/zona.module#ZonaPageModule', canLoad: [ UsuarioGuard ] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
