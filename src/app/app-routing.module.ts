import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  { path: 'access_token', redirectTo: 'pages', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
      // enableTracing: true,
      useHash: true,
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
