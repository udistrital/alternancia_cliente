import { Component, OnInit } from '@angular/core';
import { RequestManager } from '../services/requestManager';
import Swal from 'sweetalert2';
import { UserService } from '../services/userService';
import { DatosIdentificacion } from '../../@core/models/datos_identificacion';
import { environment } from './../../../environments/environment'
import { InfoComplementariaTercero } from '../../@core/models/info_complementaria_tercero';
import { Tercero } from '../../@core/models/tercero';
import { Vinculacion } from '../../@core/models/vinculacion';
import { Parametro } from '../../@core/models/parametro';
import { CargaAcademica } from '../../@core/models/carga_academica';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-informacion-basica',
  templateUrl: './informacion-basica.component.html',
  styleUrls: ['./informacion-basica.component.scss']
})
export class InformacionBasicaComponent implements OnInit {
  tercero: Tercero;
  datosIdentificacion: DatosIdentificacion;
  datosGenero: InfoComplementariaTercero;
  vinculacionesDocente: Vinculacion[];
  vinculacionesEstudiante: Vinculacion[];
  cargaAcademica: CargaAcademica[];
  vinculacionesOtros: Vinculacion[];
  datosEstadoCivil: InfoComplementariaTercero;
  vinculaciones: Vinculacion[];
  edad: number;
  source: LocalDataSource = new LocalDataSource();
  settings: any;

  constructor(
    private request: RequestManager,
    private userService: UserService
  ) {
  }

  cargarCampos() {
    this.settings = {
      actions: false,
      mode: 'external',
      columns: {
        Vinculacion: {
          title: 'Vinculacion',
          filter: false,
          valuePrepareFunction: (value) => value,
        },
        Proyecto: {
          title: 'Proyecto',
          filter: false,
          valuePrepareFunction: (value) => value,
        },
        Horario: {
          title: 'Horario',
          filter: false,
          valuePrepareFunction: (value) => value,
        },
        Asignatura: {
          title: 'Asignatura',
          filter: false,
          valuePrepareFunction: (value) => value,
        },
      },
    };
  }

  public corregirFecha(fecha: string): Date {
    let fechaHora = new Date(fecha);
    fechaHora.setHours(fechaHora.getHours() + 5);
    return fechaHora;
  }



  public calcularEdad(fechaNacimientoStr: string): number {
    if (fechaNacimientoStr) {
      const actual = new Date();
      const fechaNacimiento = this.corregirFecha(fechaNacimientoStr);
      let edad = actual.getFullYear() - fechaNacimiento.getFullYear();
      const mes = actual.getMonth() - fechaNacimiento.getMonth();

      if (mes < 0 || (mes === 0 && actual.getDate() < fechaNacimiento.getDate())) {
        edad--;
      }
      return edad;
    } else {
      return null
    }
  }

  public asignarVinculacion(vinculacion: Vinculacion) {
    let idRol: number = vinculacion.TipoVinculacion.Id;


    if (idRol != 293 && idRol != 294 && vinculacion.TipoVinculacion.ParametroPadreId != null) {
      vinculacion.TipoVinculacion.Nombre = vinculacion.TipoVinculacion.ParametroPadreId.Nombre;
    }

    if (idRol == 293 || idRol == 294 || (idRol >= 296 && idRol <= 299)) {
      let dateObj = new Date();
      let weekdayNumber = dateObj.getDay();
      this.vinculacionesDocente.push(vinculacion);
      this.request.get(environment.ACADEMICA_JBPM_SERVICE, `carga_academica/2021/1/${this.datosIdentificacion.Numero}/${weekdayNumber}`)
        .subscribe((carga: any) => {
          if (carga) {
            this.cargaAcademica = carga['carga_academica']['docente'];
            let datosCarga = this.cargaAcademica.map((carga) =>
              new Object({
                Vinculacion: `${carga.VINCULACION}`,
                Proyecto: `${carga.FACULTAD} - ${carga.PROYECTO}`,
                Horario: `${carga.SALON} - ${carga.DIA} - ${carga.HORA}`,
                Asignatura: `${carga.CODIGO_ASIGNATURA} - ${carga.ASIGNATURA} - GR ${carga.GRUPO}`,
              }))
            this.source.load(datosCarga)

          }
        }, (error) => {
          console.log(error);
          Swal.close();
        })

    } else if (vinculacion.TipoVinculacion.ParametroPadreId) {
      if (vinculacion.TipoVinculacion.ParametroPadreId.Id == 346) {
        this.vinculacionesEstudiante.push(vinculacion);
      } else {
        this.vinculacionesOtros.push(vinculacion);
      }
    } else if (vinculacion.TipoVinculacion.Id == 346) {
      this.vinculacionesEstudiante.push(vinculacion);
    } else {
      this.vinculacionesOtros.push(vinculacion);
    }
  }

  ngOnInit(): void {
    this.cargarCampos();

    Swal.fire({
      title: 'Por favor espere!',
      html: 'Cargando datos de usuario',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading()
      },
    });

    this.userService.user$.subscribe((data) => {
      this.request.get(environment.TERCEROS_SERVICE, `datos_identificacion/?query=Numero:` + data['userService']['documento'])
        .subscribe((datosInfoTercero: any) => {
          this.datosIdentificacion = {
            ...datosInfoTercero[0],
            ...{ FechaExpedicion: datosInfoTercero[0].FechaExpedicion ? this.corregirFecha(datosInfoTercero[0].FechaExpedicion) : '' }
          }
          this.tercero = this.datosIdentificacion.TerceroId;
          this.edad = this.calcularEdad(this.tercero ? this.tercero.FechaNacimiento ? this.tercero.FechaNacimiento : null : null);
          this.request.get(environment.TERCEROS_SERVICE, `info_complementaria_tercero/?query=TerceroId.Id:${!!this.tercero ? this.tercero.Id ? this.tercero.Id : '' : ''}`
            + `,InfoComplementariaId.GrupoInfoComplementariaId.Id:6`)
            .subscribe((datosInfoGenero: any) => {
              this.datosGenero = datosInfoGenero[0];
            }, (error) => {
              console.log(error);
              Swal.close();
            })

          this.request.get(environment.TERCEROS_SERVICE, `info_complementaria_tercero/?query=TerceroId.Id:${!!this.tercero ? this.tercero.Id ? this.tercero.Id : '' : ''}`
            + `,InfoComplementariaId.GrupoInfoComplementariaId.Id:2`)
            .subscribe((datosInfoEstadoCivil: any) => {
              this.datosEstadoCivil = datosInfoEstadoCivil[0];
            }, (error) => {
              console.log(error);
              Swal.close();
            })

          this.request.get(environment.TERCEROS_SERVICE, `vinculacion/?query=Activo:true,TerceroPrincipalId.Id:${!!this.tercero ? this.tercero.Id ? this.tercero.Id : '' : ''}`)
            .subscribe((datosInfoVinculaciones: any) => {
              this.vinculaciones = datosInfoVinculaciones;
              this.vinculacionesDocente = [];
              this.vinculacionesEstudiante = [];
              this.vinculacionesOtros = [];
              for (let i = 0; i < this.vinculaciones.length; i++) {
                this.vinculaciones[i] = {
                  ...datosInfoVinculaciones[i],
                  ...{ FechaInicioVinculacion: this.vinculaciones[i].FechaInicioVinculacion ? this.corregirFecha(this.vinculaciones[i].FechaInicioVinculacion) : '' },
                  ...{ FechaFinVinculacion: this.vinculaciones[i].FechaFinVinculacion ? this.corregirFecha(this.vinculaciones[i].FechaFinVinculacion) : '' }
                }
                if (JSON.stringify(this.vinculaciones[i]) !== '{}') {
                  this.request.get(environment.PARAMETROS_SERVICE, `parametro/?query=Id:` + this.vinculaciones[i].TipoVinculacionId)
                    .subscribe((vinculacion: any) => {
                      this.vinculaciones[i].TipoVinculacion = vinculacion['Data'][0];
                      if (this.vinculaciones[i].DependenciaId) {
                        this.request.get(environment.OIKOS_SERVICE, `dependencia/` + this.vinculaciones[i].DependenciaId)
                          .subscribe((dependencia: any) => {
                            this.vinculaciones[i].Dependencia = dependencia;
                            Swal.close();

                            Swal.fire({
                              inputValue: 1,
                              html: `
                              <h3 class="title-term-conditional">Importante !</h3>
                              <p class="text-term-condional">Actualmente esta aplicación se encuentra en construcción</p>
                              <h4 class="subtitle-term-conditional">Fases: </h4>
                              <ul class="important-list">
                                <li><div class="item-list-important"> <span class="material-icons md-30 success">assignment_turned_in</span> Caracterización. </div> </li>
                                <li><div class="item-list-important"> <span class="material-icons md-30 pending">pending_actions</span> Análisis. </div> </li>
                                <li><div class="item-list-important"> <span class="material-icons md-30 pending">pending_actions</span> Control de acceso. </div> </li>
                                <li><div class="item-list-important"> <span class="material-icons md-30 pending">pending_actions</span> Registro de síntomas. </div> </li>
                              </ul>
                              `,

                            })
                          }, (error) => {
                            console.log(error);
                            Swal.close();
                          })

                      }
                      this.asignarVinculacion(this.vinculaciones[i]);
                    })
                }
              }
            })
        }, (error) => {
          console.log(error);
          Swal.close();
        })
    })



  }

}
