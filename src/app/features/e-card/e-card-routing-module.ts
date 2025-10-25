import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardViewerComponent } from './components/card-viewer/card-viewer';

const routes: Routes = [
  {
    path: ':slug', // Ruta dinámica con el slug
    component: CardViewerComponent
  },
  {
    path: '',
    redirectTo: '/404', // Redirigir si no hay slug
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ECardRoutingModule { }