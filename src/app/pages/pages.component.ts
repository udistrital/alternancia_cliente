import { Component, OnInit } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { RequestManager } from './services/requestManager';
import { UserService } from './services/userService';
import { DatosIdentificacion } from '../@core/models/datos_identificacion';

@Component({
  selector: 'app-pages',
  template: `<div *ngIf="loaded" class="main-container">
              <router-outlet></router-outlet>
            </div>`,
})
export class PagesComponent implements OnInit {
  loaded = false;
  userData: any;
  environment: any;
  loadingRouter: boolean;


  constructor(    private router: Router, private userService:UserService,
    private request: RequestManager ) {
    this.environment = environment;
    router.events.subscribe((event) => {
      if (event instanceof RouteConfigLoadStart) {
        Swal.fire({
          title: 'Cargando módulo ...',
          html: `Por favor espere`,
          showConfirmButton: false,
          allowOutsideClick: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });
        this.loadingRouter = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loadingRouter = false;
        Swal.close();
      } else {
        Swal.close();
      }
    });
  }
  ngOnInit(): void {
    this.loaded = true;

    this.userService.user$.subscribe((data: any)=> {
      if(data?data.user?data.user.documento?true:false:false:false && localStorage.getItem('access_token') != null) {
        // this.request.get(environment.TERCEROS_SERVICE, `datos_identificacion/?query=Numero:`+ data.user.documento)
        // .subscribe((tercero)=> {
        //   console.log(this.terceroData);
        // })
        this.request.get(environment.TERCEROS_SERVICE, `datos_identificacion?query=Numero:`+ '80761795')
        .subscribe((datosIdentificacion: DatosIdentificacion)=> {
          let tercero = datosIdentificacion[2].TerceroId;
          this.userService.updateTercero(tercero);
          console.log(tercero);
        })
      }
    })
  }
}
