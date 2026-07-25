import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RequestManager } from '../services/requestManager';
import Swal from 'sweetalert2';
import { UserService } from '../services/userService';
import { UtilService } from '../services/utilService';
import { DatosIdentificacion } from '../../@core/models/datos_identificacion';
import { environment } from '../../../environments/environment'
import { InfoComplementariaTercero } from '../../@core/models/info_complementaria_tercero';
import { Tercero } from '../../@core/models/tercero';
import { Documento } from '../../@core/models/documento';
//import { Vinculacion } from '../../@core/models/vinculacion';
//import { CargaAcademica } from '../../@core/models/carga_academica';
import { LocalDataSource } from 'ng2-smart-table';
//import { combineLatest, from } from 'rxjs';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.scss']
})
export class VehiculoComponent implements OnInit {
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  errorMessage: string | null = null;

  readonly allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  readonly maxFileSize = 5242880; // 5 MB en bytes
  isPost: boolean = true;
  infoVacunacion: any[] = [{ dato: '' }, { dato: '' }, { dato: '' }, { dato: '' }, { dato: '' }, { dato: '' }];
  maxDate: Date = new Date();
  minDate: Date = new Date(2021, 0, 1);
  tercero: Tercero | undefined ;
  datosIdentificacion: DatosIdentificacion | undefined ;
  datosGenero: InfoComplementariaTercero | undefined ;
  datosLocalidad: InfoComplementariaTercero | undefined ;
  //isVacunacion: number;
  //vinculacionesDocente: Vinculacion[];
  //vinculacionesEstudiante: Vinculacion[];
  //cargaAcademica: CargaAcademica[];
  //vinculacionesOtros: Vinculacion[];
  datosEstadoCivil: InfoComplementariaTercero | undefined ;
  //vinculaciones: Vinculacion[];
  
  edad: number | undefined ;
  source: LocalDataSource = new LocalDataSource();
  settings: any;
  epsLista: string[] = [];
  base64:any = null;
  enlace : string;
  extension: string;
  ifImagen: boolean;
  
  nombreArchivo: string;
  imageSrc: any;
  base64String: any;
  fotoCarnet: string;
  data:any;
  
  //formVacunacion: FormGroup;

  constructor(
    private request: RequestManager,
    private userService: UserService,
    private sanitizer:DomSanitizer,
    private utilService: UtilService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.ifImagen=false;
    this.enlace="";
    this.extension="";
    this.nombreArchivo="";
    this.fotoCarnet="";
 
    }

 
 
  ngOnInit(): void {
    this.userService.user$.subscribe((data) => {
      this.request.get(environment.TERCEROS_SERVICE, `datos_identificacion/?query=Numero:` + data['userService']['documento'])
        .subscribe((datosInfoTercero: any) => {
          this.datosIdentificacion = {
            ...datosInfoTercero[0]
          }
          this.tercero = this.datosIdentificacion.TerceroId;

          if (this.tercero) {
          

          
            this.request.get(environment.TERCEROS_SERVICE, `info_complementaria_tercero/?query=TerceroId.Id:${!!this.tercero ? this.tercero.Id ? this.tercero.Id : '' : ''}`
              + `,InfoComplementariaId.GrupoInfoComplementariaId.Id:6`)
              .subscribe((datosInfoGenero: any) => {
                this.datosGenero = datosInfoGenero[0];
              }, (error) => {
                console.log(error);
              })

            this.request.get(environment.TERCEROS_SERVICE, `info_complementaria_tercero/?query=TerceroId.Id:${!!this.tercero ? this.tercero.Id ? this.tercero.Id : '' : ''}`
              + `,InfoComplementariaId.GrupoInfoComplementariaId.Id:2`)
              .subscribe((datosInfoEstadoCivil: any) => {
                this.datosEstadoCivil = datosInfoEstadoCivil[0];
              }, (error) => {
                console.log(error);
              })

            this.request.get(environment.TERCEROS_SERVICE, `info_complementaria_tercero/?query=TerceroId.Id:${!!this.tercero ? this.tercero.Id ? this.tercero.Id : '' : ''}`
              + `,InfoComplementariaId.GrupoInfoComplementariaId.CodigoAbreviacion:LOCBOG`)
              .subscribe((datosInfoLocalidad: any) => {
                this.datosLocalidad = datosInfoLocalidad[0];
              }, (error) => {
                console.log(error);
              })
            
          //  this.consultarInfoVacunacion();
/*
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
                            }, (error) => {
                              console.log(error);
                            })
                        }
                        this.asignarVinculacion(this.vinculaciones[i]);
                      })
                  }
                }

              })*/
          }
        }, (error) => {
          console.log(error);
          Swal.close();
        })
    })



  }
 
 
 
}
