import { Component, OnInit } from '@angular/core';
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
  constructor(
    private request: RequestManager,
    private userService: UserService
    ) {


  }

  ngOnInit(): void {
    
    this.userService.user$.subscribe((data)=> {
      console.log("tercero",  data)
    })
    this.request.get(environment.TERCEROS_SERVICE,`tercero` )
    .subscribe((res: any) => {
      this.terceros = res;
    })
  }

}
