import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterPComponent } from './router-p.component';

describe('RouterPComponent', () => {
  let component: RouterPComponent;
  let fixture: ComponentFixture<RouterPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
