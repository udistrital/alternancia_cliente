import {Component, ViewChild, ViewEncapsulation, OnInit, AfterViewInit} from '@angular/core';
import {QrScannerComponent} from 'angular2-qrscanner';

export interface QrScannerTexts {
  NotSupportedHTML: string;
  DeviceDefaultPrefix: string;
  StopCameraText: string;
  OpenButtonText: string;
}


@Component({
  selector: 'app-qrscan',
  templateUrl: './qrscan.component.html',
  styleUrls: ['./qrscan.component.scss']
})
export class QrscanComponent implements AfterViewInit {
  lectura: string;
  @ViewChild(QrScannerComponent, {static: false}) qrScannerComponent: QrScannerComponent ;
  videoDevices: MediaDeviceInfo[] = [];
  dispositivoActual: null;
  constructor() { }

  ngAfterViewInit(): void {
    this.clear()
    this.qrScannerComponent.capturedQr.subscribe(result => {
        this.lectura = result;
    });
  }

  selectDevice (device){
    this.dispositivoActual = device;
    this.qrScannerComponent.chooseCamera.next(device);
  }

  clear() {
    this.qrScannerComponent.getMediaDevices()
    .then((devices) => {
       this.videoDevices = [];
      console.log(devices);
      for (const device of devices) {
          if (device.kind.toString() === 'videoinput') {
              this.videoDevices.push(device);
          }
      }
      // if (this.videoDevices.length > 0){
      //     let choosenDev;
      //     for (const dev of this.videoDevices){
      //         if (dev.label.includes('front')){
      //             choosenDev = dev;
      //             break;
      //         }
      //     }
      //     if (choosenDev) {
      //         this.qrScannerComponent.chooseCamera.next(choosenDev);
      //     } else {
      //         this.qrScannerComponent.chooseCamera.next(this.videoDevices[0]);
      //     }
      // }
    });


  }



}
