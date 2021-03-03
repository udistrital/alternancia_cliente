import { Component, OnInit } from '@angular/core';
import { RequestManager } from '../services/requestManager';
import { environment } from './../../../environments/environment' 
@Component({
  selector: 'app-informacion-basica',
  templateUrl: './informacion-basica.component.html',
  styleUrls: ['./informacion-basica.component.scss']
})
export class InformacionBasicaComponent implements OnInit {
  terceros: any;
  constructor(private request: RequestManager) {

  }

  ngOnInit(): void {
    
    this.request.get(environment.TERCEROS_SERVICE,`tercero/?query=UsuarioWSO2:` )
    .subscribe((res: any) => {
      this.terceros = res;
    })
  }

}
