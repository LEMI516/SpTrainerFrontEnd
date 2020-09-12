import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelPComponent } from './panel-p.component';

describe('PanelPComponent', () => {
  let component: PanelPComponent;
  let fixture: ComponentFixture<PanelPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
