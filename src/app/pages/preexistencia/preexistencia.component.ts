import { Component, OnInit } from '@angular/core';
import { UtilService } from '../services/utilService';


export interface Opcion {
  name: string;
  isSelected: boolean;
  label: string;
}

@Component({
  selector: 'app-preexistencia',
  templateUrl: './preexistencia.component.html',
  styleUrls: ['./preexistencia.component.scss']
})
export class PreexistenciaComponent implements OnInit {

  
  constructor(private utilService: UtilService) {
  }

  comorbilidades: Opcion[] = [
    { name: "asma", isSelected: false, label: "Asma"}, 
    { name: "enfermedad_cerebrobascular", isSelected: false, label: "Enfermedad Cerebrovascular"}, 
    { name: "fibrosis_quistica", isSelected: false, label: "Fibrosis quística"}, 
    { name: "hipertension", isSelected: false, label: "Hipertensión o presión arterial alta"}, 
    { name: "inmunodeprimidas", isSelected: false, label: "Personas inmunodeprimidas afecciones"}, 
    { name: "neurologicas_enfermedades_hepaticas", isSelected: false, label: "neurológicas enfermedad hepática"}, 
    { name: "sobrepeso", isSelected: false, label: "Sobrepeso"}, 
    { name: "fibrosis_pulmonar", isSelected: false, label: "Fibrosis pulmonar"}, 
    { name: "talasea", isSelected: false, label: "Talasemia (tipo de trastorno en la sangre)"}, 
    { name: "diabetes_tipo1", isSelected: false, label: "Diabetes Mellitus TIPO 1"}, 
    { name: "cancer", isSelected: false, label: "Cáncer"}, 
    { name: "enfermedad_renal_cronica", isSelected: false, label: "Enfermedad renal crónica"}, 
    { name: "epoc", isSelected: false, label: "EPOC (Enfermedad Pulmonar Obstructiva Crónica)"}, 
    { name: "afecciones_cardiacas", isSelected: false, label: "Afecciones cardiacas"}, 
    { name: "obesidad", isSelected: false, label: "Obesidad"}, 
    { name: "obesidad_grave", isSelected: false, label: "Obesidad grave"}, 
    { name: "enfermedad_celulas_falciformes", isSelected: false, label: "Enfermedad de células falciformes"}, 
    { name: "ha_tenido_transplantes", isSelected: false, label: "¿Ha tenido trasplantes?"}, 
  ]

  ngOnInit(): void {
    const comorbilidad = localStorage.getItem('comorbilidad');
    if(comorbilidad) {
      const objComorbilidades = JSON.parse(comorbilidad);
      console.log(objComorbilidades)
      this.comorbilidades = this.comorbilidades.map((c: Opcion) => {
        return {
          ...c,
          isSelected: objComorbilidades.info.hasOwnProperty(c.name)? objComorbilidades.info[c.name]:false
        }
      })
    }

  }

  clear(): void {
    this.comorbilidades = this.comorbilidades.map((option)=>({...option, ...{isSelected: false}}))
  }

  functionReturn(){
    
  }


  save(): void {
    let saveData = {
      info: {},
      date: new Date()
    };
    this.comorbilidades.map((data)=> {
      saveData.info[data.name] = data.isSelected;
    })
    console.log(saveData);
    this.utilService.submitAlert({ 
      option:'update', 
      type:'Comorbilidades', 
      fn: this.sendData, 
      data: saveData, 
      info: '¿Desea actualizar sus comorbilidades?',
      fnReturn: this.functionReturn
     }) 
    
  }

  sendData(data){
    return new Promise((resolve, reject)=> {
      const dataSave = localStorage.setItem('comorbilidad',JSON.stringify(data))
      resolve('saved');
    })
  }
}
