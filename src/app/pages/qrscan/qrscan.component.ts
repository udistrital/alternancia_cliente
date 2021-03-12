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

  @ViewChild(QrScannerComponent, {static: false}) qrScannerComponent: QrScannerComponent ;

  constructor() { }

  ngAfterViewInit(): void {
    this.qrScannerComponent.getMediaDevices().then(devices => {
      console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
          if (device.kind.toString() === 'videoinput') {
              videoDevices.push(device);
          }
      }
      if (videoDevices.length > 0){
          let choosenDev;
          for (const dev of videoDevices){
              if (dev.label.includes('front')){
                  choosenDev = dev;
                  break;
              }
          }
          if (choosenDev) {
              this.qrScannerComponent.chooseCamera.next(choosenDev);
          } else {
              this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
          }
      }
    });

    this.qrScannerComponent.capturedQr.subscribe(result => {
        console.log(result);
  });
  }



}
