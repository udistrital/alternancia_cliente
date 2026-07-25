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
import { Vinculacion } from '../../@core/models/vinculacion';
//import { CargaAcademica } from '../../@core/models/carga_academica';
import { LocalDataSource } from 'ng2-smart-table';
//import { combineLatest, from } from 'rxjs';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-carnet',
  templateUrl: './carnet.component.html',
  styleUrls: ['./carnet.component.scss']
})
export class CarnetComponent implements OnInit {
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
  vinculaciones: Vinculacion[]= [];
  vinculacion:Vinculacion | undefined ;
  infoComplementariaId: number | undefined ;
  infoComplementariaTerceroId: number | undefined ;
  edad: number | undefined ;
  source: LocalDataSource = new LocalDataSource();
  settings: any;
  epsLista: string[] = [];
  base64:any = null;
  enlace : string;
  extension: string;
  ifImagen: boolean;
  RH: string;
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
    this.RH="";
    //this.cargarEps()
    }

  /*
  conditionallyRequiredValidator(formControl: AbstractControl) {
    if (!formControl.parent) {
      return null;
    }
    if (formControl.parent.get('radioVacunacion').value === 'true') {
      return Validators.required(formControl); 
    }
    return null;
  }

  getErrorMessage(campo: FormControl) {
    if (campo.hasError('required', )) {
      return 'Campo requerido';
    } else {
      return 'Introduzca un valor válido';
    }
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
*/
 public corregirFecha(fecha: string): Date {
    let fechaHora = new Date(fecha);
    fechaHora.setHours(fechaHora.getHours() + 5);
    return fechaHora;
  }
  //OJO ids quemados ponerlos en los enviroments ya que no necesariamente tienen el mismo id en todos los ambientes
/*
  public cargarEps(){
    this.request.get(environment.PARAMETROS_SERVICE,"parametro/?limit=-1&query=TipoParametroId.Id:34&order=asc&sortby=Nombre")
    .subscribe((res:any)=>{
      var lista=res.Data
      lista.forEach(reg=>{
        this.epsLista.push(reg.Nombre)
      })
    })
  }

  public calcularEdad(fechaNacimientoStr: string): number {
    if (fechaNacimientoStr) {
      const actual = new Date();
      const fechaNacimiento = new Date(fechaNacimientoStr);
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
*/
  public asignarVinculacion(vinculacion: Vinculacion) {
    let idRol: number = vinculacion.TipoVinculacion.Id;


    if (idRol == 290 || idRol == 291 ) {
        vinculacion.TipoVinculacion.Nombre = 'CONTRATISTA';
      }
      if (idRol == 346 ) {
        vinculacion.TipoVinculacion.Nombre = 'ESTUDIANTE';
      }
      if (idRol == 300 || idRol == 301 || idRol == 302 || idRol == 303 || idRol == 304 || idRol == 305 || idRol == 306 || idRol == 307 || idRol == 311 || idRol == 347 ) {
        vinculacion.TipoVinculacion.Nombre = 'FUNCIONARIO';
      }
      if (idRol == 292 || idRol == 293 || idRol == 294 || idRol == 295 || idRol == 296 || idRol == 297 || idRol == 298 || idRol == 299 ) {
        vinculacion.TipoVinculacion.Nombre = 'DOCENTE';
      }
/*
    if (idRol == 293 || idRol == 294 || (idRol >= 296 && idRol <= 299)) {
      let dateObj = new Date();
      let weekdayNumber = dateObj.getDay();
     /* this.vinculacionesDocente.push(vinculacion);
      this.request.get(environment.ACADEMICA_JBPM_SERVICE, `carga_academica/${new Date().getFullYear()}/1/${this.datosIdentificacion.Numero}/${weekdayNumber}`)
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
/*
  consultarInfoVacunacion() {
    combineLatest(
      this.request.get(environment.TERCEROS_SERVICE, `/info_complementaria?query=GrupoInfoComplementariaId.Id:50&limit=0&order=asc&sortby=Id&fields=Id,Nombre`),
      //------------------------------------------------------- formData -----------------------------------------------
      this.request.get(environment.TERCEROS_SERVICE,
        '/info_complementaria_tercero?limit=0&order=asc&sortby=Id&query=InfoComplementariaId.GrupoInfoComplementariaId.Id:50,TerceroId.Id:'
        + this.tercero.Id)
    )
      .subscribe(
        ([consultaInfoVacunacion, datosInfoVacunacion, datosOtros]: any) => {
          if (consultaInfoVacunacion) {
            if (datosInfoVacunacion && JSON.stringify(datosInfoVacunacion) !== '[{}]') {
              datosInfoVacunacion.sort((a, b) => (a.InfoComplementariaId.Id < b.InfoComplementariaId.Id ? -1 : 1));
              this.isPost = false;
              this.infoVacunacion = consultaInfoVacunacion.map((itemVacunacion, index) => ({
                ...itemVacunacion,
                ...{ form: datosInfoVacunacion[index] },
                label: itemVacunacion['Nombre'],
                dato: index == 1 ? this.corregirFecha((JSON.parse(datosInfoVacunacion[index].Dato)).dato) : datosInfoVacunacion[index]?JSON.parse(datosInfoVacunacion[index].Dato).dato:"",
                name: itemVacunacion['Nombre']
              }))
              this.formVacunacion.get('radioVacunacion').setValue(this.infoVacunacion[0]?this.infoVacunacion[0].dato:"");
              this.formVacunacion.get('fechaVacunacion').setValue(this.infoVacunacion[1]?this.infoVacunacion[1].dato:"");
              this.formVacunacion.get('empresaVacunacion').setValue(this.infoVacunacion[2]?this.infoVacunacion[2].dato:"");
              this.formVacunacion.get('eps').setValue(this.infoVacunacion[3]?this.infoVacunacion[3].dato:"");
              this.formVacunacion.get('urlCertificado').setValue(this.infoVacunacion[4]?this.infoVacunacion[4].dato:"");
              this.formVacunacion.get('faseVacunacion').setValue(this.infoVacunacion[5]?this.infoVacunacion[5].dato:"");
            } else {
              this.isPost = true;
              this.infoVacunacion = consultaInfoVacunacion.map((itemVacunacion, index) => ({
                ...itemVacunacion,
                label: itemVacunacion['Nombre'],
                dato: "",
                name: itemVacunacion['Nombre']
              }))
              Swal.close();
            }
          }
        });*/
  }
/*
  radioVacunacionActualizado() {
    this.formVacunacion.get('fechaVacunacion').setValue("");
    this.formVacunacion.get('empresaVacunacion').setValue("");
  }

  async save() {
    this.infoVacunacion[0].dato = this.formVacunacion.get('radioVacunacion').value;
    this.infoVacunacion[1].dato = this.infoVacunacion[0].dato=='true'?this.formVacunacion.get('fechaVacunacion').value:"";
    this.infoVacunacion[2].dato = this.infoVacunacion[0].dato=='true'?this.formVacunacion.get('empresaVacunacion').value:"";
    this.infoVacunacion[3].dato = this.formVacunacion.get('eps').value
    this.infoVacunacion[4].dato = this.formVacunacion.get('urlCertificado').value
    this.infoVacunacion[5].dato = this.formVacunacion.get('faseVacunacion').value

    const isValidTerm = await this.utilService.termsAndConditional();

    if (isValidTerm) {
      Swal.fire({
        title: 'Información de vacunación',
        text: `Se ${this.isPost ? 'almacenará' : 'actualizará'} la información correspondiente al esquema de vacunación`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: this.isPost ? 'Guardar' : 'Actualizar',
      }).then(result => {

        if (this.tercero && result.value) {
          Swal.fire({
            title: this.isPost ? 'Guardando' : 'Actualizando' + ' caracterización',
            html: `<b></b> de ${this.infoVacunacion.length} registros ${this.isPost ? 'almacenados' : 'actualizados'}`,
            timerProgressBar: true,
            willOpen: () => {
              Swal.showLoading();
            },
          });

          let updated = 0;

          from(this.infoVacunacion)
            .subscribe((itemVacunacion: any) => {
              let itemVacunacionTercero = {
                TerceroId: { Id: this.tercero.Id },
                InfoComplementariaId: {
                  Id: itemVacunacion.Id,
                },
                Dato: JSON.stringify({ dato: itemVacunacion.dato }),
                Activo: true,
              };

              if (itemVacunacion.form?false:true) {
                this.request
                  .post(environment.TERCEROS_SERVICE, 'info_complementaria_tercero/', itemVacunacionTercero)
                  .subscribe((data: any) => {
                    updated += 1;
                    const content = Swal.getContent();
                    if (content) {
                      const b = content.querySelector('b');
                      if (b) {
                        b.textContent = `${updated}`;
                      }
                    }

                    if (updated === (this.infoVacunacion.length)) {
                      Swal.close();
                      Swal.fire({
                        title: `Registro correcto`,
                        text: `Se ingresaron correctamente ${this.infoVacunacion.length} registros`,
                        icon: 'success',
                      }).then((result) => {
                        if (result.value) {
                          this.isPost = false;
                          window.location.reload();
                        }
                      })
                      this.isPost = false;
                    }

                  }),
                  error => {
                    Swal.fire({
                      title: 'error',
                      text: `${JSON.stringify(error)}`,
                      icon: 'error',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      confirmButtonText: `Aceptar`,
                    });
                  };
              } else {
                this.request
                  .put(environment.TERCEROS_SERVICE, 'info_complementaria_tercero', itemVacunacionTercero, itemVacunacion.form.Id)
                  .subscribe((data: any) => {
                    updated += 1;
                    const content = Swal.getContent();
                    if (content) {
                      const b = content.querySelector('b');
                      if (b) {
                        b.textContent = `${updated}`;
                      }
                    }

                    if (updated === (this.infoVacunacion.length)) {
                      Swal.close();
                      Swal.fire({
                        title: `Actualización correcta`,
                        text: `Se actualizaron correctamente ${this.infoVacunacion.length} registros`,
                        icon: 'success',
                      }).then((result) => {
                        if (result.value) {
                          this.isPost = false;
                          window.location.reload();
                        }
                      })
                      this.isPost = false;
                    }

                  }),
                  error => {
                    Swal.fire({
                      title: 'error',
                      text: `${JSON.stringify(error)}`,
                      icon: 'error',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      confirmButtonText: `Aceptar`,
                    });
                  };

              }

            });
        }
      });
    }
  }
*/
  ngOnInit(): void {
  /*  this.formVacunacion = this.formBuilder.group({
      radioVacunacion: ['', Validators.required],
      eps: ['', Validators.required],
      fechaVacunacion: ['', this.conditionallyRequiredValidator],
      empresaVacunacion: ['', this.conditionallyRequiredValidator],
      urlCertificado: ['', [Validators.required, Validators.pattern("https:\/\/(mivacuna.sispro.gov.co\/MiVacuna\/CDVCOL\/ValCertDigVac){1}[/#?]?.*$")]],
      faseVacunacion: ['', this.conditionallyRequiredValidator]
    });
    this.formVacunacion.get('radioVacunacion').valueChanges
        .subscribe(value => {
            this.formVacunacion.get('fechaVacunacion').setValue("");
            this.formVacunacion.get('fechaVacunacion').updateValueAndValidity();
            this.formVacunacion.get('empresaVacunacion').setValue("");
            this.formVacunacion.get('empresaVacunacion').updateValueAndValidity();
            this.formVacunacion.get('faseVacunacion').setValue("");
            this.formVacunacion.get('faseVacunacion').updateValueAndValidity();
    });
*/
  //  this.cargarCampos();
    this.request.get(environment.TERCEROS_SERVICE, `info_complementaria?query=CodigoAbreviacion:FOTOCARNET`)
    .subscribe((datosInfoComplementaria: any) => {
          this.infoComplementariaId = datosInfoComplementaria[0].Id;
          
    });
    this.userService.user$.subscribe((data) => {
      this.request.get(environment.TERCEROS_SERVICE, `datos_identificacion/?query=Numero:` + data['userService']['documento'])
        .subscribe((datosInfoTercero: any) => {
          this.datosIdentificacion = {
            ...datosInfoTercero[0],
            ...{ FechaExpedicion: datosInfoTercero[0].FechaExpedicion ? this.corregirFecha(datosInfoTercero[0].FechaExpedicion) : '' }
          }
          this.tercero = this.datosIdentificacion.TerceroId;

          if (this.tercero) {
           /* this.tercero.FechaNacimiento = this.corregirFecha(this.tercero.FechaNacimiento);

            this.edad = this.calcularEdad(this.tercero ? this.tercero.FechaNacimiento ? this.tercero.FechaNacimiento : null : null);
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
              })*/
             this.request.get(environment.TERCEROS_SERVICE, `info_complementaria_tercero?query=TerceroId.Id:${!!this.tercero ? this.tercero.Id ? this.tercero.Id : '' : ''}`
              + `,InfoComplementariaId.GrupoInfoComplementariaId.Id:7,Activo:true`)
             .subscribe((grupoSanguineo: any) => {
               
                
                 this.request.get(environment.TERCEROS_SERVICE, `info_complementaria_tercero?query=TerceroId.Id:${!!this.tercero ? this.tercero.Id ? this.tercero.Id : '' : ''}`
              + `,InfoComplementariaId.GrupoInfoComplementariaId.Id:8,Activo:true`)
             .subscribe((factor: any) => {
                 this.RH=grupoSanguineo[0].InfoComplementariaId.Nombre+factor[0].InfoComplementariaId.Nombre;
               
              }, (error) => {
                console.log(error);
              });   
              }, (error) => {
                console.log(error);
              });
            this.request.get(environment.TERCEROS_SERVICE, `info_complementaria_tercero/?query=TerceroId.Id:${!!this.tercero ? this.tercero.Id ? this.tercero.Id : '' : ''}`
              + `,InfoComplementariaId.CodigoAbreviacion:FOTOCARNET,Activo:true`)
              .subscribe((fotoCarnet: any) => {
              
                this.fotoCarnet = (JSON.parse(fotoCarnet[0].Dato)).dato;
                 this.infoComplementariaTerceroId = fotoCarnet[0].Id;
                 this.request.get(environment.GESTOR_DOCUMENTAL, 'document/'+ this.fotoCarnet).subscribe((imagen_base64: any) => {
                    const reader = new FileReader();
                  reader.onload = () => {
                    this.imagePreview = reader.result;
                    }
                    
                    const imageBlob = this.base64ToBlob(imagen_base64.file, 'image/png');
                    reader.readAsDataURL(imageBlob);
                    

                  },
                  error => {
                    Swal.fire({
                      title: 'error',
                      text: `${JSON.stringify(error)}`,
                      icon: 'error',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      confirmButtonText: `Aceptar`,
                    });
                  });
                
               


              }, (error) => {
                console.log(error);
              })

          //  this.consultarInfoVacunacion();

            this.request.get(environment.TERCEROS_SERVICE, `vinculacion/?query=Activo:true,TerceroPrincipalId.Id:${!!this.tercero ? this.tercero.Id ? this.tercero.Id : '' : ''}&sortby=FechaFinVinculacion&order=desc&limit=1`)
              .subscribe((datosInfoVinculaciones: any) => {
                this.vinculaciones = datosInfoVinculaciones;
               // this.vinculacionesDocente = [];
               // this.vinculacionesEstudiante = [];
               // this.vinculacionesOtros = [];
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
                        this.vinculacion=vinculacion['Data'][0];
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
                
              })
          }
        }, (error) => {
          console.log(error);
          Swal.close();
        })
    })



  }
  obtenerImagen(enlace: string){
   this.request.get(environment.GESTOR_DOCUMENTAL,'document/' + enlace).
    subscribe((documento)=>{
      this.base64String = documento['file'];
      this.imageSrc = this.convertBase64ToImageSrc(this.base64String);
    })
  }
  convertBase64ToImageSrc(base64String: string): any {
    // Convertir la cadena base64 a una URL de objeto
    const imageBlob = this.base64ToBlob(base64String, 'image/png');
    const imageUrl = URL.createObjectURL(imageBlob);
    // Sanitizar la URL para prevenir problemas de seguridad
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
 
  base64ToBlob(base64String: string, type: string): Blob {
    // Obtener el contenido binario de la cadena base64
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    // Crear un objeto Blob a partir de los byteArrays
    return new Blob(byteArrays, { type: type });
  }
  
 onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.resetForm();

    if (!file) return;

    if (!this.allowedTypes.includes(file.type)) {
      this.errorMessage = 'Formato inválido. Usa .jpg, .jpeg o .png';
      event.target.value = ''; 
      return;
    }

    if (file.size > this.maxFileSize) {
      this.errorMessage = 'La imagen excede el límite máximo de 5 MB';
      event.target.value = ''; 
      return;
    }
    



    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      const base64String = (reader.result as string).split(',')[1];
        this.base64 = base64String; 
        let validarImagen = {imagen_base64: this.base64};
                 
                  this.request.post(environment.VALIDAR_IMAGEN, '/rostro/validar', JSON.stringify(validarImagen))
                  .subscribe((data: any) => {
                    
                    if(data.Data.valida&&data.Data.tiene_rostro&&data.Data.es_rostro_humano)
                    {
                      this.selectedFile = file;
                    }
                    else
                    {
                         this.errorMessage = 'No se detecta un rostro humano en la imagen';

                    }

                  },
                  error => {
                    Swal.fire({
                      title: 'error',
                      text: `${JSON.stringify(error)}`,
                      icon: 'error',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      confirmButtonText: `Aceptar`,
                    });
                  });
    };
    
    
    reader.readAsDataURL(file);
  }
  onUpload(): void {
    if (!this.selectedFile) return;

      const documento :Documento ={
              IdTipoDocumento : 202,
              nombre : 'carnet_' +this.tercero.Id+'.'+ this.selectedFile.type.split("/")[1],
              metadatos :{},
              descripcion:"Imagen de carnet",
              file : this.base64      
            }
             let array = [documento];
             this.request.post(environment.GESTOR_DOCUMENTAL, 'document/upload', array)
             .subscribe((data: any) => {
                    
                    this.enlace = data['res'].Enlace;
                    

              if (this.enlace) {
               

                let itemInfoComplementariaTercero = 
                {
                  TerceroId: { Id: this.tercero.Id },
                  InfoComplementariaId: {
                    Id: this.infoComplementariaId,
                  },
                  Dato: JSON.stringify({ dato: this.enlace }),
                  Activo: true
                  };
                  if(this.fotoCarnet)
                  {
                     

                       this.request
                    .put(environment.TERCEROS_SERVICE, '/info_complementaria_tercero', itemInfoComplementariaTercero, this.infoComplementariaTerceroId)
                    .subscribe((data: any) => {
                      Swal.fire({
                        title: 'informacion',
                        text: `imagen guardada correctamente`,
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonText: `Aceptar`,
                      });
                    

                    },
                    error => {
                      Swal.fire({
                        title: 'error',
                        text: `${JSON.stringify(error)}`,
                        icon: 'error',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: `Aceptar`,
                      });
                    });
                 

                  }
                  else
                  {
                    this.request
                    .post(environment.TERCEROS_SERVICE, 'info_complementaria_tercero/', itemInfoComplementariaTercero)
                    .subscribe((data: any) => {
                      Swal.fire({
                        title: 'informacion',
                        text: `imagen guardada correctamente`,
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonText: `Aceptar`,
                      });
                    

                    },
                    error => {
                      Swal.fire({
                        title: 'error',
                        text: `${JSON.stringify(error)}`,
                        icon: 'error',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: `Aceptar`,
                      });
                    });
                  }
                }
              },
              error => {
              Swal.fire({
                      title: 'error',
                      text: `${JSON.stringify(error)}`,
                      icon: 'error',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      confirmButtonText: `Aceptar`,
                    });
                  });

   
  }
   private resetForm(): void {
    this.errorMessage = null;
    this.imagePreview = null;
    this.selectedFile = null;
  }
 
}
