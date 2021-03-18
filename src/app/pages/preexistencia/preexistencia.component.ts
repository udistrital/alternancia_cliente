import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { RequestManager } from '../services/requestManager';
import { environment } from './../../../environments/environment';
import { QrService } from '../services/qrService';
import { UtilService } from '../services/utilService';
import { InfoComplementaria } from '../../@core/models/info_complementaria';
import { Tercero } from '../../@core/models/tercero';
import { ignoreElements, map } from 'rxjs/operators';
import { InfoComplementariaTercero } from '../../@core/models/info_complementaria_tercero';
import { UserService } from '../services/userService';
import { from } from 'rxjs';

export interface Opcion {
  name: string;
  isSelected: boolean;
  label: string;
}

@Component({
  selector: 'app-preexistencia',
  templateUrl: './preexistencia.component.html',
  styleUrls: ['./preexistencia.component.scss'],
})
export class PreexistenciaComponent implements OnInit {
  isEdit = false;
  decision_presencialidad: boolean = false;
  isAgree = false;
  comorbilidadesArray: InfoComplementaria[];
  tercero: Tercero;
  constructor(
    private utilService: UtilService,
    private qrService: QrService,
    private request: RequestManager,
    private userService: UserService
  ) {}

  comorbilidades: Opcion[] = [
    /*     { name: "asma", isSelected: false, label: "Asma" },
    { name: "enfermedad_cerebrobascular", isSelected: false, label: "Enfermedad Cerebrovascular" },
    { name: "fibrosis_quistica", isSelected: false, label: "Fibrosis quística" },
    { name: "hipertension", isSelected: false, label: "Hipertensión o presión arterial alta" },
    { name: "inmunodeprimidas", isSelected: false, label: "Personas inmunodeprimidas afecciones" },
    { name: "neurologicas_enfermedades_hepaticas", isSelected: false, label: "neurológicas enfermedad hepática" },
    { name: "sobrepeso", isSelected: false, label: "Sobrepeso" },
    { name: "fibrosis_pulmonar", isSelected: false, label: "Fibrosis pulmonar" },
    { name: "talasea", isSelected: false, label: "Talasemia (tipo de trastorno en la sangre)" },
    { name: "diabetes_tipo1", isSelected: false, label: "Diabetes Mellitus TIPO 1" },
    { name: "cancer", isSelected: false, label: "Cáncer" },
    { name: "enfermedad_renal_cronica", isSelected: false, label: "Enfermedad renal crónica" },
    { name: "epoc", isSelected: false, label: "EPOC (Enfermedad Pulmonar Obstructiva Crónica)" },
    { name: "afecciones_cardiacas", isSelected: false, label: "Afecciones cardiacas" },
    { name: "obesidad", isSelected: false, label: "Obesidad" },
    { name: "obesidad_grave", isSelected: false, label: "Obesidad grave" },
    { name: "enfermedad_celulas_falciformes", isSelected: false, label: "Enfermedad de células falciformes" },
    { name: "ha_tenido_transplantes", isSelected: false, label: "¿Ha tenido trasplantes?" },
    { name: "decision_presencialidad", isSelected: false, label: "¿Estaría dispuesto a realizar alguna de las siguientes actividades de forma presencial? (Contratista, Docente, Estudiante)" },
 */
  ];
  otros: Opcion[] = [
    { label: 'Convive con mayores de 70 años.', isSelected: false, name: 'convive_mayores_70' },
    { label: 'Convive con personas con comorbilidades.', isSelected: false, name: 'convive_comorbilidades' },
    {
      label: 'Convivie con personal que trabaje en el sector de la salud activos o en primera línea de atención.',
      isSelected: false,
      name: 'convive_trabajador_salud_covid',
    },
    { label: 'Reside fuera de Bogotá D.C.', isSelected: false, name: 'reside_fuera_bogota' },
    {
      label: 'Tiene dificultades económicas para transporte y sustento.',
      isSelected: false,
      name: 'dificultades_economicas_transporte_sustento',
    },
  ];

  cargarComorbilidades() {
    if (this.comorbilidadesArray) {
      this.comorbilidades = this.comorbilidadesArray.map(comorbilidad => ({
        ...comorbilidad,
        label: comorbilidad['Nombre'],
        isSelected: false,
        name: comorbilidad['Nombre'],
      }));
      // console.log(this.comorbilidades);
    }
    this.userService.tercero$.subscribe((tercero: any) => {
      if (typeof tercero.Id !== 'undefined') {
        this.tercero = tercero;
        return this.request
          .get(
            environment.TERCEROS_SERVICE,
            '/info_complementaria_tercero?limit=0&fields=Dato&query=InfoComplementariaId.GrupoInfoComplementariaId.Id:47,TerceroId.Id:' +
              this.tercero.Id
          )
          .subscribe(
            (data: any) => {
              if (typeof data[0].Dato !== 'undefined') {
                let datosComorbilidades = data;
                for (let i = 0; i < this.comorbilidades.length; i++) {
                  console.log(datosComorbilidades[i]);
                  let isSelected = JSON.parse(datosComorbilidades[i].Dato);
                  this.comorbilidades[i] = {
                    ...this.comorbilidades[i],
                    isSelected: isSelected.dato,
                  };
                }
                console.log(this.comorbilidades);
              }
            },
            (error: any) => {
              console.log(error);
            }
          );
      }
    });
  }

  consultarComorbilidades() {
    this.request
      .get(environment.TERCEROS_SERVICE, `/info_complementaria?query=GrupoInfoComplementariaId.Id:47&limit=0&fields=Id,Nombre`)
      .subscribe((consultaComorbilidades: any) => {
        this.comorbilidadesArray = consultaComorbilidades;
        //console.log(this.comorbilidadesArray);
        this.cargarComorbilidades();
      });
  }

  validarDesicionPresencialidad(nombreCheck: string, isChecked: boolean) {
    if (nombreCheck == 'decision_presencialidad') {
      this.decision_presencialidad = isChecked;
      this.otros = this.otros.map(option => ({ ...option, ...{ isSelected: false } }));
    }
  }

  async ngOnInit() {
    this.consultarComorbilidades();
    //this.cargarComorbilidades()
    const comorbilidad = localStorage.getItem('comorbilidad');
    if (comorbilidad) {
      const objComorbilidades = JSON.parse(comorbilidad);
      console.log(objComorbilidades);
      this.qrService.updateData(objComorbilidades);
      this.comorbilidades = this.comorbilidades.map((c: Opcion) => {
        return {
          ...c,
          isSelected: objComorbilidades.info.hasOwnProperty(c.name) ? objComorbilidades.info[c.name] : false,
        };
      });
      this.otros = this.otros.map((c: Opcion) => {
        return {
          ...c,
          isSelected: objComorbilidades.info.hasOwnProperty(c.name) ? objComorbilidades.info[c.name] : false,
        };
      });
    }
  }

  clear(): void {
    this.comorbilidades = this.comorbilidades.map(option => ({ ...option, ...{ isSelected: false } }));
    this.otros = this.otros.map(option => ({ ...option, ...{ isSelected: false } }));
  }

  functionReturn() {}

  async save() {
    let saveData = {
      comorbilidades: this.comorbilidades,
      info: {},
      date: new Date(),
    };
    this.comorbilidades.map(data => {
      saveData.info[data.name] = data.isSelected;
    });

    this.otros.map(data => {
      saveData.info[data.name] = data.isSelected;
    });
    const isValidTerm = await this.utilService.termsAndConditional();

    if (isValidTerm) {
      Swal.fire({
        title: 'Comorbilidades',
        text: `Se almacenarán las comorbilidades`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: `Guardar`,
      }).then(result => {
        if (result.value) {
          Swal.fire({
            title: 'Por favor espere!',
            html: `Guardando Comorbilidades`,
            allowOutsideClick: false,
            showConfirmButton: false,
            onBeforeOpen: () => {
              Swal.showLoading();
            },
          });

          if (this.tercero) {
            Swal.fire({
              title: 'Guardando Comorbilidades',
              html: `<b></b> de ${saveData.comorbilidades.length} registros actualizados`,
              timerProgressBar: true,
              onBeforeOpen: () => {
                Swal.showLoading();
              },
            });
            let updated = 0;
            const listComorbilidad = from(saveData.comorbilidades);
            listComorbilidad.subscribe((comorbilidad: any) => {
              let comorbilidadTercero = {
                TerceroId: { Id: this.tercero.Id },
                InfoComplementariaId: {
                  Id: comorbilidad.Id,
                },
                Dato: JSON.stringify(
                  new Object({
                    dato: comorbilidad.isSelected,
                  })
                ),
                Activo: true,
              };
              console.log(comorbilidadTercero);
              localStorage.setItem('comorbilidad', JSON.stringify(saveData));

              if (this.isEdit) {
                this.request
                  .post(environment.TERCEROS_SERVICE, 'info_complementaria_tercero/', comorbilidadTercero)
                  .subscribe((data: any) => {
                    const content = Swal.getContent();
                    if (content) {
                      const b = content.querySelector('b');
                      if (b) {
                        b.textContent = `${updated}`;
                      }
                    }
                    updated += 1;
                    if (updated === saveData.comorbilidades.length) {
                      Swal.close();
                      Swal.fire({
                        title: `Actualización correcta`,
                        text: `Se actualizaron correctamente ${saveData.comorbilidades.length} comorbilidades`,
                        icon: 'success',
                      });
                    }
                  }),
                  error => {
                    Swal.fire({
                      title: 'error',
                      text: `${JSON.stringify(error)}`,
                      icon: 'error',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      confirmButtonText: `Aceptar`,
                    });
                  };
              } else {
                this.request
                  .post(environment.TERCEROS_SERVICE, 'info_complementaria_tercero/', comorbilidadTercero)
                  .subscribe((data: any) => {
                    const content = Swal.getContent();
                    if (content) {
                      const b = content.querySelector('b');
                      if (b) {
                        b.textContent = `${updated}`;
                      }
                    }
                    updated += 1;
                    if (updated === saveData.comorbilidades.length) {
                      Swal.close();
                      Swal.fire({
                        title: `Actualización correcta`,
                        text: `Se actualizaron correctamente ${saveData.comorbilidades.length} comorbilidades`,
                        icon: 'success',
                      });
                    }
                  }),
                  error => {
                    Swal.fire({
                      title: 'error',
                      text: `${JSON.stringify(error)}`,
                      icon: 'error',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar',
                      confirmButtonText: `Aceptar`,
                    });
                  };
              }
            });
          }
        }
      });
    }
  }

  sendData(data) {
    return new Promise((resolve, reject) => {
      const dataSave = localStorage.setItem('comorbilidad', JSON.stringify(data));
      resolve('');
    });
  }
}
