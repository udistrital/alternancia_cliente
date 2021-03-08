import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

    constructor() {}

    submitAlert({ option, type, fn, data, info }) {
        Swal.fire({
            title: `Se ${option === 'update' ? 'actualizará' : 'creará'} el ${type}`,
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
                    html: `${option === 'update' ? 'Actualizando' : 'Creando'} el ${type}`,
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
                        `Se ha ${option === 'update' ? 'actualizado' : 'Creado'} el ${type} ${response} de forma exitosa`,
                        'success'
                    ).then((data2) => {
                        const buttonReturn = document.getElementById('return');
                        buttonReturn.click();
                    })
                    })
                    .catch(err => {
                    Swal.close();
                    Swal.fire(
                        `No se ha podido ${option === 'update' ? 'Actualizar' : 'Crear'} el ${type}`,
                        `error: ${err}`,
                        'error'
                    )
                    })
                }
            })
        }
}

