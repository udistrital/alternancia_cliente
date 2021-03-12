import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { InformacionBasicaComponent } from './informacion-basica/informacion-basica.component';
import { HttpClientModule } from '@angular/common/http';
import { RequestManager } from './services/requestManager';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
//import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS,} from '@angular/material-moment-adapter';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { SaludActualComponent } from './salud-actual/salud-actual.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { PreexistenciaComponent } from './preexistencia/preexistencia.component';
import { FormsModule } from '@angular/forms';
import { OasGridColsDirective } from './directives/oas-grid-cols.directive';
import { QrCodeModule } from 'ng-qrcode';
import { QrComponent } from './qr/qr.component';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { QrscanComponent } from './qrscan/qrscan.component';
import { NgQrScannerModule } from 'ngx-qr';


const pagesComponents = [
  DashboardComponent,
  PagesComponent,
  InformacionBasicaComponent,
  SaludActualComponent,
  PreexistenciaComponent,
];

const materialModules = [
  MatCardModule,
  MatListModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatGridListModule,
  MatExpansionModule,
  MatButtonModule,
  MatStepperModule
];
@NgModule({
  declarations: [
    ...pagesComponents,
    OasGridColsDirective,
    QrComponent,
    QrscanComponent,
  ],
  imports: [
    NgQrScannerModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    PagesRoutingModule,
    QrCodeModule,
    Ng2SmartTableModule,
    ...materialModules
  ],
  providers: [
    RequestManager,
  ]
})
export class PagesModule { }
