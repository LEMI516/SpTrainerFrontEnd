import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelGroupInfoComponent } from './model-group-info.component';

describe('ModelGroupInfoComponent', () => {
  let component: ModelGroupInfoComponent;
  let fixture: ComponentFixture<ModelGroupInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelGroupInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelGroupInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
