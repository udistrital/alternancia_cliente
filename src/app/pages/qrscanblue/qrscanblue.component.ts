import { Component, ViewChild, ViewEncapsulation, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { RequestManager } from '../services/requestManager';
import { environment } from '../../../environments/environment';
import { UserService } from '../services/userService';
import { EspacioFisico } from 'src/app/@core/models/espacio_fisico';
import { LoaderService } from 'src/app/loader/loader.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-qrscanblue',
  templateUrl: './qrscanblue.component.html',
  styleUrls: ['./qrscanblue.component.scss']
})
export class QrscanBlueComponent implements AfterViewInit {
  @ViewChild('scannerInput') scannerInput!: ElementRef<HTMLInputElement>;
  lectura: any = {};
  persona: any = {};
  show: boolean = false;

  public codigoCapturado: string = '';
  public escanerActivo: boolean = false;
  private temporizadorLectura: any;
  
  dispositivoActual: any = null;
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
                this.show = true;
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
    this.mantenerFoco();
  }
   
  mantenerFoco(): void {
    setTimeout(() => {
      if (this.scannerInput) {
        this.scannerInput.nativeElement.focus();
      }
    }, 50);
  }
  recuperarFoco(): void {
    // Si el usuario toca fuera o pierde el foco, lo recuperamos en 100ms
    setTimeout(() => {
      this.mantenerFoco();
    }, 100);
  }

     
   
  


  clear() {
    this.dispositivoActual = null;
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
    this.dispositivoActual = null;
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
    this.dispositivoActual = null;
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

  activarEscaner(): void {
    const inputEl = this.scannerInput.nativeElement;
    inputEl.value = '';
    inputEl.focus();
    this.escanerActivo = true;
  }

  // Se dispara cada vez que entra un carácter al input
  alEscribir(event: Event): void {
    clearTimeout(this.temporizadorLectura);

    // Si en 150ms no llegan más caracteres, asumimos que terminó el escaneo
    this.temporizadorLectura = setTimeout(() => {
      this.finalizarCaptura();
    }, 150);
  }
  procesarInmediato(event: Event): void {
    event.preventDefault();
    clearTimeout(this.temporizadorLectura);
    this.finalizarCaptura();
  }
  private finalizarCaptura(): void {
    const inputEl = this.scannerInput.nativeElement;
    const texto = inputEl.value;

    if (texto && texto.trim().length > 0) {
      // Limpia saltos de línea o tabulaciones residuales
      this.codigoCapturado = texto.replace(/[^a-zA-Z0-9]/g, '');
      console.log('Capturado con éxito:', this.codigoCapturado);
      try {
        console.log(atob(this.codigoCapturado));
        this.lectura = JSON.parse(atob(this.codigoCapturado));
        if (this.lectura.IdTercero && this.permisos) {
          this.verificarAcceso();
          this.cargarDatosAprobados();


        }
        else if (this.lectura.IdEspacio) {
          this.accesoEspacio();
        }
        else {
          Swal.fire({
            title: 'Error',
            text: `Error escaneando QR, por favor escanea nuevamente`,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          })
          this.dispositivoActual = null;
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: `Error escaneando QR, por favor escanea nuevamente`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        })
        this.dispositivoActual = null;
      }
    }

    // Limpiamos y mantenemos listo para el siguiente QR
    inputEl.value = '';
    inputEl.focus();
  }


}
