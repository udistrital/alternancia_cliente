import {Component, ViewChild, ViewEncapsulation, OnInit, AfterViewInit} from '@angular/core';
import {QrScannerComponent} from 'angular2-qrscanner';

@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.component.html',
  styleUrls: ['./qrscan.component.scss']
})
export class QrscanComponent implements AfterViewInit {
  lectura: string = '';
  @ViewChild(QrScannerComponent, {static: false}) qrScannerComponent: QrScannerComponent ;
  videoDevices: any = null;
  dispositivoActual:any=  null;
  constructor() { }

  ngAfterViewInit(): void {
    this.qrScannerComponent.getMediaDevices()
    .then((devices) => {
      this.videoDevices = devices.filter((video)=>(video.kind === 'videoinput'));
    });
    this.qrScannerComponent.capturedQr.subscribe(result => {
        this.lectura = result;
        this.dispositivoActual = null;
    });
  }

  selectDevice (device){
    this.dispositivoActual = device;
    this.qrScannerComponent.chooseCamera.next(device);
  }

  clear() {
    this.dispositivoActual =  null;
    this.lectura = ''
  }



}
