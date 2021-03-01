import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages/pages.component';
import { InformacionBasicaComponent } from './informacion-basica/informacion-basica.component';


@NgModule({
  declarations: [DashboardComponent, PagesComponent, InformacionBasicaComponent],
  imports: [
    CommonModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
