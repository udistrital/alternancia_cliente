import { Component, ViewChild, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import Swal from 'sweetalert2';
import { RequestManager } from '../services/requestManager';
import { environment } from './../../../environments/environment';
import { UserService } from '../services/userService';
import { EspacioFisico } from 'src/app/@core/models/espacio_fisico';
import { LoaderService } from 'src/app/loader/loader.service';

@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.component.html',
  styleUrls: ['./qrscan.component.scss']
})
export class QrscanComponent implements AfterViewInit {
  lectura: any = {};
  persona: any = {};
  @ViewChild(QrScannerComponent, { static: false }) 
  qrScannerComponent: QrScannerComponent;
  videoDevices: any = null;
  dispositivoActual: any = null;
  sedes:EspacioFisico[];
  edificios:EspacioFisico[];
  edificiosSeleccion={};
  sedeSeleccionada:string;
  edificioSeleccionado:string;
  edificioActivado=false;
  sedeCambiada=false;
  edificioCambiado=false;
  salon=""
  tipo=""

  constructor(private request: RequestManager, private userService: UserService, public loaderService: LoaderService) { }

  ngAfterViewInit(): void {
    this.cargarSedes()
    this.qrScannerComponent.getMediaDevices()
      .then((devices) => {
        this.videoDevices = devices.filter((video) => (video.kind === 'videoinput'));
      });
    this.qrScannerComponent.capturedQr.subscribe(async (result) => {      
      try{
        this.lectura = JSON.parse(atob(result));
        this.consultarAcceso()
      }catch(error){
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: `Error escaneando QR, por favor escanea nuevamente`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        })
        this.dispositivoActual = null;
      }
    }, (error) => {
      console.log(error);
      Swal.fire({
        title: 'Error',
        text: `Error escaneando QR, por favor escanea nuevamente`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
      })
    });
  }

  selectDevice(device) {
    this.dispositivoActual = device;
    this.qrScannerComponent.chooseCamera.next(device);
  }

  clear() {
    this.dispositivoActual = null;
    this.lectura = ''
  }

  consultarAcceso(){
    this.userService.tercero$.subscribe((tercero: any)=> {
      this.request.get(environment.ALTERNANCIA_MID_SERVICE, `acceso/`+this.lectura.Id+`/`+tercero['Id']+"/?sede="+this.sedeSeleccionada+"&edificio="+this.edificioSeleccionado+"&aula="+this.salon+"&tipo="+this.tipo)
        .subscribe(async(respuesta: any) => {          
          this.persona =await respuesta["Data"];
          let codeHtml=`
          <h3 class="title-term-conditional">Control de aforo</h3>
          <p class="text-term-condional">
              <b>Usuario:</b> ${this.persona.Nombre}<br>
              <b>Identificación:</b> ${this.lectura.cc}<br>`
          if(this.tipo=="in"){
            codeHtml=codeHtml+`<b>Ingreso:</b> ${this.persona.Acceso}<br>`
            if(this.persona.Causa!=""){
              codeHtml=codeHtml+`<b>Causa:</b> ${this.persona.Causa}<br>`
            }
          }
          codeHtml=codeHtml+`<b>Cupo restante:</b> ${this.persona.Cupo}<br>
          </p>`
          const { value: accept } = await Swal.fire({
            html: codeHtml,
            confirmButtonText: 'Aceptar',
          })
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

  cambioSede(idSede:string){
    this.sedeCambiada=true
    this.edificioSeleccionado=""
    this.salon=""
    if(this.edificiosSeleccion[idSede].length>1){
      this.edificioActivado=true
      this.edificios=this.edificiosSeleccion[idSede]
      this.edificioCambiado=false
    }
    else{
      this.edificioActivado=false
      this.edificioCambiado=true
    }
  }

  cambioEdificio(){
    this.salon=""
    this.edificioCambiado=true
  }

  cargarSedes(){
    this.request.get(environment.OIKOS_SERVICE,"espacio_fisico/?query=TipoEspacioFisicoId.Id:1")
    .subscribe((res :any) =>{
      if (res != [] && res!=null){
        this.sedes=res
        this.cargarEdificios()
      }
    }, (error) => {
      console.log(error);
    });
  }

  cargarEdificios(){
    this.edificiosSeleccion={}
    for (let sede of this.sedes){
      this.request.get(environment.OIKOS_SERVICE,"espacio_fisico_padre/?limit=-1&query=PadreId.Id:"+sede.Id)
      .subscribe((res :any) =>{
        let edificios:EspacioFisico[]=[]
        for(let respuesta of res){
          edificios.push(respuesta.HijoId)
        }
        this.edificiosSeleccion[sede.Id.toString()]=edificios
      }, (error) => {
        console.log(error);
      });
    }
  }

}
