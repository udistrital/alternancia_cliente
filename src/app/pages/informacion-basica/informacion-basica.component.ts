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
      // add: {
      //   addButtonContent: '<span class="material-icons md-30">add_circle</span>',
      //   createButtonContent: '<i class="nb-checkmark"></i>',
      //   cancelButtonContent: '<i class="nb-close"></i>',
      // },
      // edit: {
      //   editButtonContent: '<span class="material-icons">edit</span>',
      //   saveButtonContent: '<i class="nb-checkmark"></i>',
      //   cancelButtonContent: '<i class="nb-close"></i>',
      // },
      // delete: {
      //   deleteButtonContent: '<span class="material-icons">delete</span>',
      //   confirmDelete: true,
      // },
      actions: false,
      mode: 'external',
      columns: {
        // Id: {
        //   title: this.translate.instant('GLOBAL.id'),
        //   // type: 'number;',
        //   valuePrepareFunction: (value) => {
        //     return value;
        //   },
        // },
        Nombre: {
          title: 'Nombre',
          // type: 'string;',
          valuePrepareFunction: (value) => `${value.primerNombre} ${value.segundoNombre}`,
        },
        Aplicacion: {
          title: 'Aplicación',
          // type: 'aplicacion;',
          valuePrepareFunction: (value) => value,
          // eslint-disable-next-line max-len
          filterFunction: (cell?: any, search?: string): boolean => (((cell.Nombre).toLowerCase()).indexOf(search.toLowerCase()) !== -1 || search === ''),
        },
      },
    };
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

  public asignarVinculacion(vinculacion: Vinculacion){
    let idRol: number = vinculacion.TipoVinculacion.Id;


    if (idRol != 293 && idRol != 294 && vinculacion.TipoVinculacion.ParametroPadreId != null) {
      vinculacion.TipoVinculacion.Nombre = vinculacion.TipoVinculacion.ParametroPadreId.Nombre;    
    }
    
    if (idRol == 293 || idRol == 294 || (idRol >= 296 && idRol <= 299)) {
      this.vinculacionesDocente.push(vinculacion);
       this.request.get(environment.ACADEMICA_JBPM_SERVICE, `carga_academica/2020/3/41782864/3`)
         .subscribe((carga: any) => {
          this.cargaAcademica = carga['carga_academica']['docente'];
        })

    } else if (idRol >= 9999 && idRol <= 99999) {//VERFIFICAR IDS DE PARAMETRO PARA ESTUDIANTE
      this.vinculacionesEstudiante.push(vinculacion);
    } else {
      this.vinculacionesOtros.push(vinculacion);
    }
  }

  ngOnInit(): void {
    this.cargarCampos();
    this.source.load([
      {Aplicacion: 'prueba', Nombre: {primerNombre: 'Fabian', segundoNombre: 'Sánchez'} }
    ])
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

      this.request.get(environment.ACADEMICA_JBPM_SERVICE, `carga_academica/2020/3/41782864/3`)
      .subscribe((carga: any) => {
        this.cargaAcademica = carga['carga_academica']['docente'];
        console.log("carga academica: ", this.cargaAcademica)
       })


      
      //this.request.get(environment.TERCEROS_SERVICE, `datos_identificacion/?query=Numero:`+ data['user']['documento'])
       this.request.get(environment.TERCEROS_SERVICE, `datos_identificacion/?query=TerceroId.Id:9811`)
        .subscribe((datosInfoTercero: any) => {
          this.datosIdentificacion = {
            ...datosInfoTercero[0],
            ...{ FechaExpedicion: datosInfoTercero[0].FechaExpedicion ? new Date(datosInfoTercero[0].FechaExpedicion) : '' }
          }          
          this.tercero = this.datosIdentificacion.TerceroId;      
          this.edad = this.calcularEdad(this.tercero.FechaNacimiento);          

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
              
              this.vinculacionesDocente = [];
              this.vinculacionesEstudiante = [];
              this.vinculacionesOtros = [];

              for (let i = 0; i < this.vinculaciones.length; i++) {
                this.vinculaciones[i] = {
                  ...datosInfoVinculaciones[i],
                  ...{ FechaInicioVinculacion: this.vinculaciones[i].FechaInicioVinculacion ? new Date(this.vinculaciones[i].FechaInicioVinculacion) : '' },
                  ...{ FechaFinVinculacion: this.vinculaciones[i].FechaFinVinculacion ? new Date(this.vinculaciones[i].FechaFinVinculacion) : '' }
                }
                this.request.get(environment.PARAMETROS_SERVICE, `parametro/?query=Id:` + this.vinculaciones[i].TipoVinculacionId)
                  .subscribe((vinculacion: any) => {
                    this.vinculaciones[i].TipoVinculacion = vinculacion['Data'][0];
/*                     console.log(this.vinculaciones[i].TipoVinculacionId);
                    console.log(vinculacion['Data'][0]); */
                    if (this.vinculaciones[i].DependenciaId) {
                      this.request.get(environment.OIKOS_SERVICE, `dependencia/` + this.vinculaciones[i].DependenciaId)
                        .subscribe((dependencia: any) => {
                          this.vinculaciones[i].Dependencia = dependencia;
                          Swal.close();
                        }
                        )
                    }
                    console.log(this.vinculaciones[i])
                    this.asignarVinculacion(this.vinculaciones[i]);
                  })                                
              }
            })
        })
    })



  }

}
