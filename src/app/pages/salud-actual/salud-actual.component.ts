import { Component, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import { UtilService } from '../services/utilService';

export interface Task {
  name: string;
  isSelected: boolean;
  label: string;
}

@Component({
  selector: 'app-salud-actual',
  templateUrl: './salud-actual.component.html',
  styleUrls: ['./salud-actual.component.scss']
})
export class SaludActualComponent implements OnInit {

  constructor(private utilService: UtilService) {
  }

  task: Task[] = [
      {name: 'congestion_nasal', isSelected: false, label: 'Congestión Nasal'},
      {name: 'dificultad_respiratoria', isSelected: false, label: 'Dificultad respiratoria'},
      {name: 'gotamiento', isSelected: false, label: 'Agotamiento'},
      {name: 'malestar_general', isSelected: false, label: 'Malestar general'},
      {name: 'estado_embarazo', isSelected: false, label: 'Estado de embarazo'},
    ]

  ngOnInit(): void {
  }

  clear(): void {
    this.task = this.task.map((option)=>({...option, ...{isSelected: false}}))
  }


  save(): void {
    let saveData = {
      info: {},
      date: new Date()
    };
    this.task.map((data)=> {
      saveData.info[data.name] = data.isSelected;
    })
    this.utilService.submitAlert({ 
      option:'update', 
      type:'Estado de salud', 
      fn: this.sendData , 
      data: saveData, 
      info: 'Estado de salud', 
      fnReturn: this.functionReturn}) 
    
  }

  sendData(data){
    return new Promise((resolve, reject)=> {
      const dataSave = localStorage.setItem('health_state',JSON.stringify(data))
      resolve('dato');
    })
  }

  functionReturn(){
    
  }
}