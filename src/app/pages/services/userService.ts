import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { RequestManager } from './requestManager';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    private userSubject = new BehaviorSubject({});
    public user$ = this.userSubject.asObservable();

    private terceroSubject = new BehaviorSubject({});
    public tercero$ = this.terceroSubject.asObservable();
    public terceroData: any = {}

    constructor(private request: RequestManager) {
      this.user$.subscribe((data: any)=> {
        if(data?data.user?data.user.documento?true:false:false:false) {
          // this.request.get(environment.TERCEROS_SERVICE, `datos_identificacion/?query=Numero:`+ data.user.documento)
          // .subscribe((tercero)=> {
          //   console.log(this.terceroData);
          // })
          this.request.get(environment.TERCEROS_SERVICE, `datos_identificacion/?query=Numero:`+ '80761795')
          .subscribe((tercero)=> {
            this.updateTercero(tercero[1]);
            console.log(this.terceroData);
          })
        }
      })
    }

    updateUser(dataUser) {
        this.userSubject.next(dataUser);
    }

    updateTercero(data) {
      this.terceroData = {...this.terceroData, ...data}
      this.terceroSubject.next(this.terceroData);
    }

}
