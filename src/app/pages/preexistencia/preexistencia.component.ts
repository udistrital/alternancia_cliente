import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RequestManager } from '../services/requestManager';
import { environment } from './../../../environments/environment';
import { QrService } from '../services/qrService';
import { UtilService } from '../services/utilService';
import { InfoComplementaria } from '../../@core/models/info_complementaria';
import { Tercero } from '../../@core/models/tercero';
import { ignoreElements, map } from 'rxjs/operators';
import { InfoComplementariaTercero } from '../../@core/models/info_complementaria_tercero';
import { UserService } from '../services/userService';
import { from } from 'rxjs';

export interface Opcion {
  name: string;
  isSelected: boolean;
  label: string;
}

@Component({
  selector: 'app-preexistencia',
  templateUrl: './preexistencia.component.html',
  styleUrls: ['./preexistencia.component.scss'],
})
export class PreexistenciaComponent implements OnInit {
  isPost = true;
  decision_presencialidad: boolean = false;
  
  isAgree = false;
  comorbilidadesArray: any = [];
  vinculacionesArray: any = [];
  otrosArray: any = [];
  tercero: Tercero;
  constructor(
    private utilService: UtilService,
    private qrService: QrService,
    private request: RequestManager,
    private userService: UserService
  ) { }

  vinculaciones: Opcion[] = [];
  comorbilidades: Opcion[] = [];
  otros: Opcion[] = [
    /*     { label: 'Convive con mayores de 70 años.', isSelected: false, name: 'convive_mayores_70' },
        { label: 'Convive con personas con comorbilidades.', isSelected: false, name: 'convive_comorbilidades' },
        {
          label: 'Convivie con personal que trabaje en el sector de la salud activos o en primera línea de atención.',
          isSelected: false,
          name: 'convive_trabajador_salud_covid',
        },
        { label: 'Reside fuera de Bogotá D.C.', isSelected: false, name: 'reside_fuera_bogota' },
        {
          label: 'Tiene dificultades económicas para transporte y sustento.',
          isSelected: false,
          name: 'dificultades_economicas_transporte_sustento',
        }, */
  ];

  cargarCaracterizacion() {
    if (this.comorbilidadesArray) {
      this.comorbilidades = this.comorbilidadesArray.map((comorbilidad) => ({
        ...comorbilidad,
        label: comorbilidad['Nombre'],
        isSelected: false,
        name: comorbilidad['Nombre']
      }))

      // console.log(this.comorbilidades);      
    }

    if (this.otrosArray) {
      this.otros = this.otrosArray.map((otro) => ({
        ...otro,
        label: otro['Nombre'],
        isSelected: false,
        name: otro['Nombre']
      }))
    }

    if (this.vinculacionesArray) {
      console.log('vinculaciones array:', this.vinculacionesArray)
      console.log('vinculaciones array0:', this.vinculacionesArray[0])      
      this.vinculaciones = this.vinculacionesArray.map((vinculacion) => ({
        ...vinculacion,
        label: vinculacion.nombreVinculacion,
        isSelected: vinculacion.Alternancia,
        name: vinculacion.nombreVinculacion
      }))
      console.log('vinculaciones a secas:', this.vinculaciones)
    }


    this.userService.tercero$.subscribe((tercero: any) => {
      if (typeof tercero.Id !== 'undefined') {
        this.tercero = tercero;
        this.request.get(environment.TERCEROS_SERVICE,
          '/info_complementaria_tercero?limit=0&fields=Id,Dato&order=asc&sortby=Id&query=InfoComplementariaId.GrupoInfoComplementariaId.Id:47,TerceroId.Id:'
          + this.tercero.Id)
          .subscribe(
            (datosComorbilidades: any) => {
              if (typeof datosComorbilidades[0].Dato !== 'undefined') {


                for (let i = 0; i < this.comorbilidadesArray.length; i++) {
                  console.log(datosComorbilidades[i])
                  let isSelected = JSON.parse(datosComorbilidades[i].Dato)
                  this.comorbilidadesArray[i] = {
                    ... this.comorbilidadesArray[i],
                    isSelected: isSelected.dato,
                    IdTerceroCaracterizacion: datosComorbilidades[i].Id
                  }
                }
                console.log('datos comorbilidades array', this.comorbilidadesArray);
                console.log('datos comorbilidades', datosComorbilidades);

                this.request.get(environment.TERCEROS_SERVICE,
                  '/info_complementaria_tercero?limit=0&fields=Id,Dato&order=asc&sortby=Id&query=InfoComplementariaId.GrupoInfoComplementariaId.Id:48,TerceroId.Id:'
                  + this.tercero.Id)
                  .subscribe(
                    (datosOtros: any) => {
                      if (typeof datosOtros[0].Dato !== 'undefined') {
                        for (let i = 0; i < this.otrosArray.length; i++) {
                          console.log(datosOtros[i])
                          let isSelected = JSON.parse(datosOtros[i].Dato)
                          this.otrosArray[i] = {
                            ... this.otrosArray[i],
                            isSelected: isSelected.dato,
                            IdTerceroCaracterizacion: datosOtros[i].Id
                          }
                        }
                        console.log('otros: ', this.otrosArray);
                        console.log('datos otros: ', datosOtros);

                        this.isPost = false;
                        if (this.comorbilidadesArray) {
                          this.comorbilidades = this.comorbilidadesArray.map((comorbilidad) => ({
                            ...comorbilidad,
                            label: comorbilidad['Nombre'],
                            isSelected: comorbilidad.isSelected,
                            name: comorbilidad['Nombre']
                          }))

                          // console.log(this.comorbilidades);      
                        }

                        if (this.otrosArray) {
                          this.otros = this.otrosArray.map((otro) => ({
                            ...otro,
                            label: otro['Nombre'],
                            isSelected: otro.isSelected,
                            name: otro['Nombre']
                          }))
                        }
                      }

                    },
                    (error: any) => {
                      console.log(error)
                    }
                  )


              }
            },
            (error: any) => {
              console.log(error)
            }
          )
      }
    })
  }


  consultarCaracterizacion() {
    this.request.get(environment.TERCEROS_SERVICE, `/info_complementaria?query=GrupoInfoComplementariaId.Id:47&limit=0&order=asc&sortby=Id&fields=Id,Nombre`)
      .subscribe((consultaComorbilidades: any) => {
        this.comorbilidadesArray = consultaComorbilidades;
        //console.log(this.comorbilidadesArray);
        this.request.get(environment.TERCEROS_SERVICE, `/info_complementaria?query=GrupoInfoComplementariaId.Id:48&order=asc&sortby=Id&limit=0&fields=Id,Nombre`)
          .subscribe((consultaOtros: any) => {
            this.otrosArray = consultaOtros;
            //console.log(this.comorbilidadesArray);                        
            this.request.get(environment.TERCEROS_SERVICE, `vinculacion/?query=TerceroPrincipalId.Id:9759`)
           this.request.get(environment.TERCEROS_SERVICE, `vinculacion/?order=asc&sortby=Id&query=Activo:true,TerceroPrincipalId.Id:` + this.tercero.Id)
              .subscribe((datosInfoVinculaciones: any) => {
                this.vinculacionesArray = datosInfoVinculaciones;
                for (let i = 0; i < this.vinculacionesArray.length; i++){
                  console.log('vinculacion id', this.vinculacionesArray[i].TipoVinculacionId);
                  this.request.get(environment.PARAMETROS_SERVICE, `parametro/`+ this.vinculacionesArray[i].TipoVinculacionId)
                    .subscribe((vinculacionP: any) => {
                      vinculacionP = vinculacionP['Data'];
                      console.log('vinculacionp', vinculacionP);
                      this.vinculacionesArray[i] = {
                        ...this.vinculacionesArray[i],
                        nombreVinculacion: vinculacionP.Nombre
                      };
                      if (i + 1 == this.vinculacionesArray.length) {
                        this.cargarCaracterizacion();
                      }
                    })                  
                }
                
              })            
            
          })
      })


  }


  validarDesicionPresencialidad(nombreCheck: string, isChecked: boolean) {
    if (nombreCheck == 'decision_presencialidad') {
      this.decision_presencialidad = isChecked;
      this.otros = this.otros.map(option => ({ ...option, ...{ isSelected: false } }));
    }
  }

  async ngOnInit() {
    this.consultarCaracterizacion();
    //this.cargarComorbilidades()
    const comorbilidad = localStorage.getItem('comorbilidad');
    if (comorbilidad) {
      const objComorbilidades = JSON.parse(comorbilidad);
      console.log(objComorbilidades);
      this.qrService.updateData(objComorbilidades);
      this.comorbilidades = this.comorbilidades.map((c: Opcion) => {
        return {
          ...c,
          isSelected: objComorbilidades.info.hasOwnProperty(c.name) ? objComorbilidades.info[c.name] : false,
        };
      });
      this.otros = this.otros.map((c: Opcion) => {
        return {
          ...c,
          isSelected: objComorbilidades.info.hasOwnProperty(c.name) ? objComorbilidades.info[c.name] : false,
        };
      });
    }
  }

  clear(): void {
    this.comorbilidades = this.comorbilidades.map(option => ({ ...option, ...{ isSelected: false } }));
    this.otros = this.otros.map(option => ({ ...option, ...{ isSelected: false } }));


    this.request.get(environment.TERCEROS_SERVICE,
      '/info_complementaria_tercero?limit=0&order=desc&sortby=Id&query=InfoComplementariaId.GrupoInfoComplementariaId.Id:47&fields=Id')
      .subscribe(
        (caracterizaciones: any) => {
          caracterizaciones.forEach(caracterizacion => {
            this.request.delete(environment.TERCEROS_SERVICE, '/info_complementaria_tercero/', caracterizacion.Id)
              .subscribe((data: any) => {
                console.log('borrando...', caracterizacion.Id)
                console.log('borrando...', data)
              })

          });

        },
        (error: any) => {
          console.log(error)
        }
      )

    this.request.get(environment.TERCEROS_SERVICE,
      '/info_complementaria_tercero?limit=0&order=desc&sortby=Id&query=InfoComplementariaId.GrupoInfoComplementariaId.Id:48&fields=Id')
      .subscribe(
        (caracterizaciones: any) => {
          caracterizaciones.forEach(caracterizacion => {
            this.request.delete(environment.TERCEROS_SERVICE, '/info_complementaria_tercero/', caracterizacion.Id)
              .subscribe((data: any) => {
                console.log('borrando...', caracterizacion.Id)
                console.log('borrando...', data)
              })

          });

        },
        (error: any) => {
          console.log(error)
        }
      )



  }

  functionReturn() { }

  updateStorage() {
    let saveData = {
      comorbilidades: this.comorbilidades,
      info: {},
      date: new Date(),
    };

    this.comorbilidades.map(data => {
      saveData.info[data.name] = data.isSelected;
    });

    this.otros.map(data => {
      saveData.info[data.name] = data.isSelected;
    });
    localStorage.setItem('comorbilidad', JSON.stringify(saveData));
  }


  async save() {


    const isValidTerm = await this.utilService.termsAndConditional();
    let caracterizaciones = this.comorbilidades.concat(this.otros);
    let caracterizacionesArray: any[] = this.comorbilidadesArray.concat(this.otrosArray);

    for (let i = 0; i < caracterizaciones.length; i++) {
      caracterizacionesArray[i] = {
        ...caracterizacionesArray[i],
        isSelected: caracterizaciones[i].isSelected
      }
    }
    console.log("caracterizacionesArray:", caracterizacionesArray)
    if (isValidTerm) {
      Swal.fire({
        title: 'Información de caracterización',
        text: `Se ${this.isPost ? 'almacenará' : 'actualizará'} la información correspondiente a la caracterización`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: this.isPost ? 'Guardar' : 'Actualizar',
      }).then(result => {
        if (result.value) {
          Swal.fire({
            title: '¡Por favor espere!',
            html: this.isPost ? 'Guardando' : 'Actualizando' + ' caracterización',
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
              Swal.showLoading();
            },
          });

          if (this.tercero) {
            Swal.fire({
              title: this.isPost ? 'Guardando' : 'Actualizando' + ' caracterización',
              html: `<b></b> de ${caracterizaciones.length} registros ${this.isPost ? 'almacenados' : 'actualizados'}` ,
              timerProgressBar: true,
              onBeforeOpen: () => {
                Swal.showLoading();
              },
            });
            
            let vinculacionesC = [];
            this.vinculaciones.forEach((vinculacion: any ) => {
              vinculacion.Alternancia = vinculacion.isSelected;
              delete vinculacion.label;
              delete vinculacion.isSelected;
              delete vinculacion.name;
              delete vinculacion.nombreVinculacion;
              vinculacionesC.push(vinculacion);
            });
            from(vinculacionesC)
              .subscribe((vinculacionC: any) => {
                console.log('vinculacionC',vinculacionC)
                this.request.put(environment.TERCEROS_SERVICE, 'vinculacion', vinculacionC,vinculacionC.Id )
                  .subscribe((data) => {
                  
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
            })

            let updated = this.vinculaciones.length;
            const listComorbilidad = from(caracterizacionesArray);
            listComorbilidad.subscribe((caracterizacion: any) => {
              console.log("caracterizacion2: ", caracterizacion)
              let caracterizacionTercero = {
                TerceroId: { Id: this.tercero.Id },
                InfoComplementariaId: {
                  Id: caracterizacion.Id,
                },
                Dato: JSON.stringify(
                  new Object({
                    dato: caracterizacion.isSelected,
                  })
                ),
                Activo: true,
              };
              console.log(caracterizacionTercero);
              this.updateStorage()

              if (this.isPost) {
                this.request
                  .post(environment.TERCEROS_SERVICE, 'info_complementaria_tercero/', caracterizacionTercero)
                  .subscribe((data: any) => {
                    const content = Swal.getContent();
                    if (content) {
                      const b = content.querySelector('b');
                      if (b) {
                        b.textContent = `${updated}`;
                      }
                    }
                    updated += 1;
                    if (updated === (caracterizaciones.length + this.vinculaciones.length)) {
                      Swal.close();
                      Swal.fire({
                        title: `Registro correcto`,
                        text: `Se ingresaron correctamente ${caracterizaciones.length + this.vinculaciones.length} registros`,
                        icon: 'success',
                      });
                      this.isPost = false;
                      window.location.reload();
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
                console.log(caracterizacionTercero)
                this.request
                  .put(environment.TERCEROS_SERVICE, 'info_complementaria_tercero', caracterizacionTercero, caracterizacion.IdTerceroCaracterizacion)
                  .subscribe((data: any) => {
                    const content = Swal.getContent();
                    if (content) {
                      const b = content.querySelector('b');
                      if (b) {
                        b.textContent = `${updated}`;
                      }
                    }
                    updated += 1;
                    if (updated === (caracterizaciones.length + this.vinculaciones.length)) {
                      Swal.close();
                      Swal.fire({
                        title: `Actualización correcta`,
                        text: `Se actualizaron correctamente ${caracterizaciones.length + this.vinculaciones.length} registros`,
                        icon: 'success',
                      });
                      window.location.reload();
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
        }
      });
    }
  }

}
