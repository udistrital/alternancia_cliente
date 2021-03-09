import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

    constructor() {}

    submitAlert({ option, type, fn, data, info, fnReturn }) {
        Swal.fire({
            title: `Se ${option === 'update' ? 'actualizará' : 'creará'} ${type}`,
            text: info,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: `${option === 'update' ? 'Actualizar' : 'Crear'} ${type}`
            })
            .then((result) => {
                if (result.value) {
                Swal.fire({
                    title: 'Por favor espere!',
                    html: `${option === 'update' ? 'Actualizando' : 'Creando'} ${type}`,
                    allowOutsideClick: false,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    },
                });
                fn(data)
                    .then((response) => {
                    Swal.close();
                    Swal.fire(
                        `${option === 'update' ? 'Actualizado' : 'Creado'}`,
                        `Se ha ${option === 'update' ? 'actualizado' : 'Creado'}  ${type} ${response} de forma exitosa`,
                        'success'
                    ).then((data2) => {
                        fnReturn();
                    })
                    })
                    .catch(err => {
                    Swal.close();
                    Swal.fire(
                        `No se ha podido ${option === 'update' ? 'Actualizar' : 'Crear'}  ${type}`,
                        `error: ${err}`,
                        'error'
                    )
                    })
                }
            })
        }
}

