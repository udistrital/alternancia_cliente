import { Component, OnInit } from '@angular/core';
import { RequestManager } from '../services/requestManager';
import Swal from 'sweetalert2';
import { UserService } from '../services/userService';
import { DatosIdentificacion } from '../../@core/models/datos_identificacion';
import { environment } from './../../../environments/environment'
import { InfoComplementariaTercero } from '../../@core/models/info_complementaria_tercero';
import { Tercero } from '../../@core/models/tercero';
import { Vinculacion } from '../../@core/models/vinculacion';
@Component({
  selector: 'app-informacion-basica',
  templateUrl: './informacion-basica.component.html',
  styleUrls: ['./informacion-basica.component.scss']
})
export class InformacionBasicaComponent implements OnInit {
  tercero: Tercero;
  datosIdentificacion: DatosIdentificacion;
  datosGenero: InfoComplementariaTercero;
  datosEstadoCivil: InfoComplementariaTercero;
  vinculaciones: Vinculacion[];
  edad: number;
  constructor(
    private request: RequestManager,
    private userService: UserService
  ) {

  }


  public calcularEdad(fechaNacimientoStr: string): number {
    const actual = new Date();
    const fechaNacimiento = new Date(fechaNacimientoStr);
    let edad = actual.getFullYear() - fechaNacimiento.getFullYear();
    const mes = actual.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && actual.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  ngOnInit(): void {
    Swal.fire({
      title: 'Por favor espere!',
      html: 'Cargando datos de usuario',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading()
      },
    });



    this.userService.user$.subscribe((data) => {
      console.log("tercero", data)

      this.request.get(environment.TERCEROS_SERVICE, `tercero/?query=UsuarioWSO2:jgcastellanosj`)
      //this.request.get(environment.TERCEROS_SERVICE, `tercero/?query=UsuarioWSO2:`+ data['user']['sub'])
        .subscribe((tercero: any) => {
          this.tercero = tercero[0];
          this.edad = this.calcularEdad(this.tercero.FechaNacimiento);
          this.request.get(environment.TERCEROS_SERVICE, `datos_identificacion/?query=TerceroId.Id:` + this.tercero.Id)
            .subscribe((datosTercero: any) => {
              this.datosIdentificacion = {
                ...datosTercero[0],
                ...{ FechaExpedicion: datosTercero[0].FechaExpedicion ? new Date(datosTercero[0].FechaExpedicion) : '' }
              }
            })

          this.request.get(environment.TERCEROS_SERVICE, `info_complementaria_tercero/?query=TerceroId.Id:` + this.tercero.Id
            + `,InfoComplementariaId.GrupoInfoComplementariaId.Id:6`)
            .subscribe((datosInfoGenero: any) => {
              this.datosGenero = datosInfoGenero[0];
            })

          this.request.get(environment.TERCEROS_SERVICE, `info_complementaria_tercero/?query=TerceroId.Id:` + this.tercero.Id
            + `,InfoComplementariaId.GrupoInfoComplementariaId.Id:2`)
            .subscribe((datosInfoEstadoCivil: any) => {
              this.datosEstadoCivil = datosInfoEstadoCivil[0];
            })

          this.request.get(environment.TERCEROS_SERVICE, `vinculacion/?query=TerceroPrincipalId.Id:9759`)
            //this.request.get(environment.TERCEROS_SERVICE, `vinculacion/?query=TerceroPrincipalId.Id:` + this.tercero.Id)
            .subscribe((datosInfoVinculaciones: any) => {
              this.vinculaciones = datosInfoVinculaciones;
              for (let i = 0; i < this.vinculaciones.length; i++) {
                this.vinculaciones[i] = {
                  ...datosInfoVinculaciones[i],
                  ...{ FechaInicioVinculacion: this.vinculaciones[i].FechaInicioVinculacion ? new Date(this.vinculaciones[i].FechaInicioVinculacion) : '' },
                  ...{ FechaFinVinculacion: this.vinculaciones[i].FechaFinVinculacion ? new Date(this.vinculaciones[i].FechaFinVinculacion) : '' }
                }
                this.request.get(environment.PARAMETROS_SERVICE, `parametro/?query=Id:` + this.vinculaciones[i].TipoVinculacionId)
                  .subscribe((vinculacion: any) => {
                    this.vinculaciones[i].TipoVinculacion = vinculacion['Data'][0];
                    console.log(this.vinculaciones[i].TipoVinculacionId);
                    console.log(vinculacion['Data'][0]);
                  })
                if (this.vinculaciones[i].DependenciaId) {
                  this.request.get(environment.OIKOS_SERVICE, `dependencia/` + this.vinculaciones[i].DependenciaId)
                    .subscribe((dependencia: any) => {
                      this.vinculaciones[i].Dependencia = dependencia;
                      Swal.close();
                    }
                    )
                }
              }
            })
        })
    })



  }

}
