import { Component, OnInit } from '@angular/core';
import { QrService } from '../services/qrService';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QrComponent implements OnInit {

  qrValue = "NO PUEDE INGRESAR"
  constructor(private qrService: QrService) {
    this.qrService.qrData$.subscribe((data)=> {
      this.qrValue = data;
    })
  }
  ngOnInit(): void {
  }

}
