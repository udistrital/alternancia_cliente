import { Component, ViewChild, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';

import Swal from 'sweetalert2';
import { RequestManager } from '../services/requestManager';
import { environment } from './../../../environments/environment';
import { UserService } from '../services/userService';
import { EspacioFisico } from 'src/app/@core/models/espacio_fisico';
import { LoaderService } from 'src/app/loader/loader.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.component.html',
  styleUrls: ['./qrscan.component.scss']
})
export class QrscanComponent implements AfterViewInit {
  lectura: any = {};
  persona: any = {};
 
  show: boolean = false;
 
  formatosPermitidos: any[] = [];
  videoDevices: MediaDeviceInfo[] = [];
  dispositivoActual?: MediaDeviceInfo;
 

  sedes: EspacioFisico[];
  edificios: EspacioFisico[];
  edificiosSeleccion = {};
  sedeSeleccionada: string;
  edificioSeleccionado: string;
  idRol: number;
  edificioActivado: boolean;
  sedeCambiada: boolean;
  edificioCambiado: boolean;
  permisos: boolean;
  salon: string;
  tipo: string;
  vehiculo: any = {};
  vehiculos: any[] = [];
  opcionesRadio: Record<string, string> = {};
  data: any;
  private procesandoLectura: boolean = false;
  constructor(private request: RequestManager, private userService: UserService, public loaderService: LoaderService) {
    this.userService.tercero$.subscribe((tercero: any) => {
      if (tercero.Id) {
        this.request.get(environment.TERCEROS_SERVICE, `vinculacion/?query=Activo:true,TerceroPrincipalId.Id:${tercero.Id ? tercero.Id : ''}`)
          .subscribe((datosInfoVinculaciones: any) => {
            if (datosInfoVinculaciones.length > 0) {
              this.idRol = datosInfoVinculaciones[0].TipoVinculacionId
              /* roles=CONTRATISTA EXTERNO,DOCENTE DE CARRERA TIEMPO COMPLETO,DOCENTE DE CARRERA MEDIO TIEMPO,TIEMPO COMPLETO OCASIONAL,HORA CÁTEDRA PRESTACIONES,MEDIO TIEMPO OCASIONAL,HORA CÁTEDRA POR HONORARIOS)*/
              this.permisos = (this.idRol == 377 || this.idRol == 293 || this.idRol == 294 || (this.idRol >= 296 && this.idRol <= 299))
              if (this.idRol==377) {
                this.userService.user$.subscribe((data) => {
                this.sedeSeleccionada = data['userService']['documento'];
                });

              }
            }
          })
      }
    });

  }

  ngAfterViewInit(): void {
  
  }

 /* private inicializarEscaner(): void {
    console.log('Inicializando escáner de QR...');
    this._qrScannerComponent.getMediaDevices()
      .then((devices) => {
        this.videoDevices = devices.filter((video) => video.kind === 'videoinput');

        if (this.videoDevices.length > 0) {
          // 1. Buscar la cámara trasera en celulares (back / rear / environment)
          let camaraElegida = this.videoDevices.find((dev) =>
            /back|rear|trás|environment/i.test(dev.label)
          );

          // 2. En iOS Safari, las etiquetas vienen vacías antes de aceptar permisos;
          // la cámara trasera suele ser la última del arreglo.
          if (!camaraElegida) {
            camaraElegida = this.videoDevices[this.videoDevices.length - 1];
          }

          this.dispositivoActual = camaraElegida;
          this._qrScannerComponent.chooseCamera.next(camaraElegida);
        }
      })
      .catch((err) => {
        console.error('Error al obtener cámaras (verifica HTTPS y permisos):', err);
      });

    this._qrScannerComponent.capturedQr.subscribe(
      async (result) => {
        try {
          console.log(atob(result));
          this.lectura = JSON.parse(atob(result));

          if (this.lectura.IdTercero && this.permisos) {
            this.verificarAcceso();
            this.cargarDatosAprobados();
          } else if (this.lectura.IdEspacio) {
            this.accesoEspacio();
          } else {
            this.mostrarErrorQr();
          }
        } catch (error) {
          console.log(error);
          this.mostrarErrorQr();
        }
      },
      (error) => {
        console.log(error);
        this.mostrarErrorQr();
      }
    );
  }

  private mostrarErrorQr(): void {
    Swal.fire({
      title: 'Error',
      text: 'Error escaneando QR, por favor escanea nuevamente',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
    this.dispositivoActual = null;
  }

  selectDevice(device) {
    this.dispositivoActual = device;
    this.qrScannerComponent.chooseCamera.next(device);
  }
*/
  clear() {
  
    this.lectura = ''
  }

  accesoEspacio() {
    let id: string
    this.userService.tercero$.subscribe((tercero: any) => {
      id = tercero['Id']
    })
    this.request.get(environment.ALTERNANCIA_MID_SERVICE, `acceso/${id}/${this.lectura.IdEspacio}/${this.lectura.tipo}`)
      .subscribe(async (respuesta: any) => {
        this.persona = await respuesta["Data"];
        if (this.persona.Acceso == "No autorizado") {
          const { value: accept } = await Swal.fire({
            title: 'Control de aforo',
            icon: 'error',
            html: `
          <h3 class="title-term-conditional">${this.persona.Fecha}</h3>
          <p class="text-term-condional">
            <b>Usuario:</b> ${this.persona.Nombre}<br>
            
            <b>Acceso:</b> ${this.persona.Acceso}<br>
            <b>Causa:</b> ${this.persona.Causa}<br>
            <b>Cupo restante:</b> ${this.persona.Cupo}<br></p>`,
            confirmButtonText: 'Aceptar',
          })
        }
        else {
          const { value: accept } = await Swal.fire({
            title: 'Control de aforo',
            icon: 'success',

            html: `
            <h3 class="title-term-conditional">${this.persona.Fecha}</h3>
            <p class="text-term-condional">
            <b>Usuario:</b> ${this.persona.Nombre}<br>
            <b>Acceso:</b> ${this.persona.Acceso}<br>
            <b>Cupo restante:</b> ${this.persona.Cupo}<br><br>
            <center>Puede continuar</center></p>`,
            confirmButtonText: 'Aceptar',
          })
        }
      }, (error) => {
        console.log(error);
        Swal.close();
        Swal.fire({
          title: 'Error',
          text: `Error consultando datos, por favor escanea nuevamente`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        })
      });

    return
  }
  async seleccionarPlan() {
    this.opcionesRadio = {}; // Reiniciar las opciones antes de llenarlas nuevamentes
    // 2. Transformar el array de objetos a un formato clave-valor indexado por el ID
    this.opcionesRadio = this.vehiculos.reduce((acc, plan) => {
      // Clave: ID (como string) -> Valor: Texto formateado que verá el usuario
      acc[plan.id.toString()] = `${plan.placa} - ${plan.tipoVehiculo}`;
      return acc;
    }, {} as Record<string, string>);
  }
  consultarAcceso() {
    console.log("ingreso a consultar acceso");
    this.userService.tercero$.subscribe((tercero: any) => {
      this.request.get(environment.ALTERNANCIA_MID_SERVICE, `acceso/${this.lectura.IdTercero}/${tercero['Id']}/?sede=${this.sedeSeleccionada}&tipo=${this.tipo}${this.edificioSeleccionado ? "&edificio=" + this.edificioSeleccionado : ""}${this.salon ? "&aula=" + this.salon : ""}`)
        .subscribe(async (respuesta: any) => {
          this.persona = await respuesta["Data"];

          let codeHtml = `
                    <h3 class="title-term-conditional">Control de aforo</h3>
                    <h3 class="title-term-conditional">${this.persona.Fecha}</h3>
                    <h3 class="title-term-conditional">${this.tipo=="out"?"Salida":"Entrada"}</h3>
                    <p class="text-term-condional">
                    <b>Usuario:</b> ${this.persona.Nombre}<br>
                    <b>Identificación:</b> ${this.lectura.cc}<br>
                    <b>Ingreso:</b> ${this.persona.Acceso}<br>`

          if (this.persona.Causa != "") {
            codeHtml = codeHtml + `<b>Causa:</b> ${this.persona.Causa}<br>`
          }
          codeHtml = codeHtml + `<b>Cupo restante:</b> ${this.persona.Cupo}<br>
                </p>`
          if (this.opcionesRadio && Object.keys(this.opcionesRadio).length > 0) {
            const { value: accept } = await Swal.fire({

              html: codeHtml,
              icon: this.persona.Acceso == "Autorizado" ? 'success' : 'error',
              confirmButtonText: 'Aceptar',
              input: 'radio',
              inputOptions: this.opcionesRadio,
              inputValidator: (value) => {
                if (!value) {
                  return '¡Seleccione una placa!';
                }
              }
            });
          }
          else {
            const { value: accept } = await Swal.fire({

              html: codeHtml,
              icon: this.persona.Acceso == "Autorizado" ? 'success' : 'error',
              confirmButtonText: 'Aceptar',

            });
          }


        }, (error) => {
          console.log(error);
          Swal.close();
          Swal.fire({
            title: 'Error',
            text: `Error consultando datos, por favor verifica los datos de ingreso y escanea nuevamente`,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          })
        });
    })

    return
  }

  cambioSede(idSede: string) {
    this.sedeCambiada = true
    this.edificioSeleccionado = ""
    this.salon = ""
    /*    if(this.edificiosSeleccion[idSede].length>0){
          this.edificioActivado=true
          this.edificios=this.edificiosSeleccion[idSede]
          this.edificioCambiado=false
        }
        else{
          this.edificioActivado=false
          this.edificioCambiado=true
        }*/
  }

  cambioEdificio() {
    this.salon = ""
    this.edificioCambiado = true
  }

  cargarSedes() {
    this.request.get(environment.OIKOS_SERVICE, "espacio_fisico/?limit=-1&query=TipoEspacio.Id:38,Activo:true&sortby=Nombre&order=asc")
      .subscribe((res: any) => {
        if (res != [] && res != null) {
          this.sedes = res
          /* por el momento no se cargan los edificios, se cargan cuando se selecciona la sede */
          // this.cargarEdificios()
        }
      }, (error) => {
        console.log(error);
      });
  }

  cargarEdificios() {
    this.edificiosSeleccion = {}
    for (let sede of this.sedes) {
      try {
        this.request.get(environment.OIKOS_SERVICE, "espacio_fisico_padre/?limit=-1&query=Padre.Id:" + sede.Id)
          .subscribe((res: any) => {
            let edificios: EspacioFisico[] = []
            for (let respuesta of res) {
              if (respuesta.Hijo) {
                edificios.push(respuesta.Hijo)
              }
            }
            this.edificiosSeleccion[sede.Id.toString()] = edificios
          }, (error: HttpErrorResponse) => {
            this.edificiosSeleccion[sede.Id.toString()] = []
            console.log(error);
          });
      }
      catch (error) {
        this.edificiosSeleccion[sede.Id.toString()] = []
        console.log(error);
      }

    }
  }
  cargarDatosAprobados(): void {
    this.vehiculos = [];
    this.request.get(environment.TERCEROS_SERVICE, `info_complementaria_tercero/?query=TerceroId.Id:${this.lectura.IdTercero ? this.lectura.IdTercero : ''}`
      + `,InfoComplementariaId.GrupoInfoComplementariaId.CodigoAbreviacion:PARQUEADERO,Activo:true`)
      .subscribe((datosParqueadero: any) => {
        if (JSON.stringify(datosParqueadero[0]) !== '{}')
        {
          for (let i = 0; i < datosParqueadero.length; i++) {
            this.vehiculo = {};
            this.vehiculo.id = datosParqueadero[i].Id;
            this.vehiculo.tipoVehiculo = (JSON.parse(datosParqueadero[i].Dato)).tipoVehiculo;
            this.vehiculo.placa = (JSON.parse(datosParqueadero[i].Dato)).placa;
            this.vehiculo.sedes = (JSON.parse(datosParqueadero[i].Dato)).sedes;
            this.vehiculo.activo = datosParqueadero[i].Activo;
            this.vehiculos.push(this.vehiculo);
          }
        console.log(this.vehiculos);
        this.seleccionarPlan();
        }
      }, (error) => {
        console.log(error);
      })

  }

  verificarAcceso() {
    //la verificacion se realiza por espacio fisico, por lo que se consulta el ultimo registro de acceso del tercero y se determina si es entrada o salida
    // a futuro es necesario que el servicio de seguimiento tenga un endpoint que permita consultar el ultimo registro de acceso del tercero y determinar si es entrada o salida
    // y la forma de controlar los cupos de los espacios fisicos padres
    this.request.get(environment.SEGUIMIENTO_SERVICE, `/seguimiento/?limit=1&order=desc&sortby=fecha_creacion&query=oikos_id:${this.sedeSeleccionada ? this.sedeSeleccionada : ''}&query:${this.lectura.IdTercero ? this.lectura.IdTercero : ''}`)
      .subscribe((accesos: any) => {
        if (accesos.Data.length > 0) {
          console.log("ingreso acceso array");
          this.tipo = accesos.Data[0].tipo_registro;
          console.log("tipo",this.tipo);
          if (this.tipo == "I") {
            console.log("tipo I");
            this.tipo = "out";
          }
          else {
            console.log("tipo contrario");
            this.tipo = "in";
          }
          this.consultarAcceso();
          console.log(this.tipo);
        }else
        {
          console.log("ingreso acceso no array");
          this.tipo="in";
          this.consultarAcceso();
        }

      }, (error) => {
        console.log(error);
      })
  }
  // Se dispara automáticamente cuando el navegador detecta las cámaras
  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.videoDevices = devices;

    if (devices.length > 0) {
      // Selecciona la cámara trasera por defecto en Android e iOS
      const camaraTrasera = devices.find((dev) =>
        /back|rear|trás|environment/i.test(dev.label)
      );
      this.dispositivoActual = camaraTrasera || devices[devices.length - 1];
    }
  }

  // Se dispara si no hay cámaras o si la página corre en HTTP sin SSL
  onCamerasNotFound(): void {
    Swal.fire({
      title: 'Cámara no encontrada',
      text: 'No se detectaron cámaras disponibles. Verifica que estés ingresando por HTTPS.',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });
  }

  // Se dispara si el usuario rechaza el permiso de cámara
  onPermissionResponse(permitido: boolean): void {
    if (!permitido) {
      Swal.fire({
        title: 'Permiso denegado',
        text: 'Debes permitir el acceso a la cámara en tu navegador para escanear el QR.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  // Se dispara al leer un código QR válido
  onScanSuccess(result: string): void {
    // Evita múltiples disparos mientras se muestra una alerta o procesa el QR
    if (this.procesandoLectura) {
      return;
    }
    this.procesandoLectura = true;

    try {
      const decodificado = atob(result);
      console.log(decodificado);
      this.lectura = JSON.parse(decodificado);

      if (this.lectura.IdTercero && this.permisos) {
        this.verificarAcceso();
        this.cargarDatosAprobados();
        this.habilitarNuevaLectura();
      } else if (this.lectura.IdEspacio) {
        this.accesoEspacio();
        this.habilitarNuevaLectura();
      } else {
        this.mostrarErrorQr();
      }
    } catch (error) {
      console.error(error);
      this.mostrarErrorQr();
    }
  }

  private mostrarErrorQr(): void {
    Swal.fire({
      title: 'Error',
      text: 'Error escaneando QR, por favor escanea nuevamente',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    }).then(() => {
      this.procesandoLectura = false;
    });
  }

  private habilitarNuevaLectura(): void {
    // Pausa de 2 segundos antes de permitir leer otro QR
    setTimeout(() => {
      this.procesandoLectura = false;
    }, 2000);
  }

}
