import { Component, OnInit } from '@angular/core';
import { RequestManager } from '../services/requestManager';
import Swal from 'sweetalert2';
import { UserService } from '../services/userService';
import { Tercero } from '../../@core/models/tercero';
import { DatosIdentificacion } from '../../@core/models/datos_identificacion';
import { environment } from './../../../environments/environment' 
@Component({
  selector: 'app-informacion-basica',
  templateUrl: './informacion-basica.component.html',
  styleUrls: ['./informacion-basica.component.scss']
})
export class InformacionBasicaComponent implements OnInit {
  tercero: Tercero;
  loaded: boolean = false;
  datosIdentificacion: DatosIdentificacion;
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
      .subscribe((res: any) => {
        this.tercero = res[0];
        
        this.request.get(environment.TERCEROS_SERVICE,`datos_identificacion/?query=TerceroId.Id:`+ this.tercero.Id)
        .subscribe((res: any) => {
          this.datosIdentificacion = res[0];        
          Swal.close();
          this.loaded = true;
        })

      })
      

      
    
  }

}
