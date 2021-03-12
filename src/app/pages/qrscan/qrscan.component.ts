import { Component, OnInit } from '@angular/core';


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
export class QrscanComponent implements OnInit {

  constructor() { }

  data: QrScannerTexts = {
      NotSupportedHTML: `You are using an <strong>outdated</strong> browser.`,
      DeviceDefaultPrefix: `Camera`,
      StopCameraText: `Stop Camera`,
      OpenButtonText: `Open QR Code File...` 
  }

  ngOnInit(): void {
  }

  capturedQr(event) {
    console.log(event);
  }

  onError(event) {
    console.log(event);
  }

}
