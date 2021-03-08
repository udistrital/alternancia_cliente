import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RequestManager } from '../services/requestManager';
import { UserService } from '../services/userService';
import { environment } from './../../../environments/environment' 
@Component({
  selector: 'app-informacion-basica',
  templateUrl: './informacion-basica.component.html',
  styleUrls: ['./informacion-basica.component.scss']
})
export class InformacionBasicaComponent implements OnInit {
  terceros: any;
  loaded: boolean = false;
  constructor(
    private request: RequestManager,
    private userService: UserService
    ) {


  }

  ngOnInit(): void {
    Swal.fire({
      title: 'Por favor espere!',
      html: 'Cargando información del recurso ...',
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading()
      },
    });
    this.userService.user$.subscribe((data)=> {
      console.log("tercero",  data)

    })
    this.request.get(environment.TERCEROS_SERVICE,`tercero` )
    .subscribe((res: any) => {
      this.terceros = res;
      Swal.close();
      this.loaded = true;
    })
  }

}
