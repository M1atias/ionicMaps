import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
//import { SetProductoComponent } from './backend/set-producto/set-producto.component';
import { SetProductosComponent } from './backend/set-productos/set-productos.component';
 
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
    path: 'set-productos',
    component: SetProductosComponent
  },
  {
    path: 'pantalla-confirmacion',
    loadChildren: () => import('./pantalla-confirmacion/pantalla-confirmacion.module').then( m => m.PantallaConfirmacionPageModule)
  },
  {
    path: 'popovercomponent',
    loadChildren: () => import('./popovercomponent/popovercomponent.module').then( m => m.PopovercomponentPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
