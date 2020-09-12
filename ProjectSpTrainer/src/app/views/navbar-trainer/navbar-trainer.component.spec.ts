import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTrainerComponent } from './navbar-trainer.component';

describe('NavbarTrainerComponent', () => {
  let component: NavbarTrainerComponent;
  let fixture: ComponentFixture<NavbarTrainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarTrainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
