import { Component, OnInit } from '@angular/core';
import { DatosIdentificacion } from 'src/app/@core/models/datos_identificacion';
import { Tercero } from 'src/app/@core/models/tercero';
import { QrService } from '../services/qrService';
import { RequestManager } from '../services/requestManager';
import { UserService } from '../services/userService';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent implements OnInit {

  qrValue :string;
  tercero: Tercero;
  datosIdentificacion: DatosIdentificacion;

  constructor(private qrService: QrService, private userService: UserService,private request: RequestManager) {
    this.consultarInfo();
    this.qrService.qrData$.subscribe((data)=> {
      if(data !== '') {
      }
    })
  }
  ngOnInit(): void {
  }

  consultarInfo():void{
    this.userService.user$.subscribe((data) => {
      this.request.get(environment.TERCEROS_SERVICE, `datos_identificacion/?query=Numero:` + data['userService']['documento'])
        .subscribe((datosInfoTercero: any) => {
          this.datosIdentificacion = {
            ...datosInfoTercero[0]
          }
          this.tercero = this.datosIdentificacion.TerceroId;
          this.qrValue=btoa(JSON.stringify({Id:this.tercero.Id,cc:this.datosIdentificacion.Numero}));
        }, (error) => {
          console.log(error);
          Swal.close();
        })
    })
  }
}
