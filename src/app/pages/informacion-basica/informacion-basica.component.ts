import { Component, OnInit } from '@angular/core';
import { RequestManager } from '../services/requestManager';
import Swal from 'sweetalert2';
import { UserService } from '../services/userService';
import { DatosIdentificacion } from '../../@core/models/datos_identificacion';
import { environment } from './../../../environments/environment' 
@Component({
  selector: 'app-informacion-basica',
  templateUrl: './informacion-basica.component.html',
  styleUrls: ['./informacion-basica.component.scss']
})
export class InformacionBasicaComponent implements OnInit {
  tercero: any;
  datosIdentificacion: any;
  loaded: boolean = false;
  constructor(
    private request: RequestManager,
    private userService: UserService
  ) {

    }

  ngOnInit(): void {
    Swal.fire({
      title: 'Por favor espere!',
      html: 'Cargando información del recurso ...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading()
      },
    });
    
    
      this.userService.user$.subscribe((data)=> {
        console.log("tercero",  data)
      })
      this.request.get(environment.TERCEROS_SERVICE,`tercero/?query=UsuarioWSO2:jgcastellanosj` )
      .subscribe((tercero: any) => {
        this.tercero = tercero[0];
  
        this.request.get(environment.TERCEROS_SERVICE,`datos_identificacion/?query=TerceroId.Id:`+ this.tercero.Id)
        .subscribe((datosTercero: any) => {
          debugger;
          this.datosIdentificacion = {
            ...datosTercero[0],
            ...{ FechaExpedicion: datosTercero[0].FechaExpedicion?new Date(datosTercero[0].FechaExpedicion):'' }
          }
          this.loaded = true;
        })

      })
      

      
    
  }

}
