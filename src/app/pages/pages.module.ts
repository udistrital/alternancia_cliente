import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { InformacionBasicaComponent } from './informacion-basica/informacion-basica.component';
import { HttpClientModule } from '@angular/common/http';
import { RequestManager } from './services/requestManager';
import {MatCardModule} from '@angular/material/card';


const pagesComponents = [
  DashboardComponent,
  PagesComponent,
  InformacionBasicaComponent
]

@NgModule({
  declarations: [
    ...pagesComponents
     ],
  imports: [
    HttpClientModule,
    CommonModule,
    PagesRoutingModule,
    MatCardModule
  ],
  providers: [
    RequestManager,
  ]
})
export class PagesModule { }
