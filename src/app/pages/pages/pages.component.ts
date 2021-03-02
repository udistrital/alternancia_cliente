import { Component, OnInit } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  loaded = false;
  userData: any;
  environment: any;
  loadingRouter: boolean;

  constructor(    private router: Router  ) {
    this.environment = environment;
    router.events.subscribe((event) => {
      if (event instanceof RouteConfigLoadStart) {
        Swal.fire({
          title: 'Cargando módulo ...',
          html: `Por favor espere`,
          showConfirmButton: false,
          allowOutsideClick: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });
        this.loadingRouter = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.loadingRouter = false;
        Swal.close();
      } else {
        Swal.close();
      }

    });
  }
  ngOnInit(): void {
    this.loaded = true;
  }
}
