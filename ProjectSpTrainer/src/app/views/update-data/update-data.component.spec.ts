import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UPDATEDATAComponent } from './update-data.component';

describe('UPDATEDATAComponent', () => {
  let component: UPDATEDATAComponent;
  let fixture: ComponentFixture<UPDATEDATAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UPDATEDATAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UPDATEDATAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
