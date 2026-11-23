import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrscanBlueComponent } from './qrscanblue.component';

describe('QrscanBlueComponent', () => {
  let component: QrscanBlueComponent;
  let fixture: ComponentFixture<QrscanBlueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrscanBlueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrscanBlueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
