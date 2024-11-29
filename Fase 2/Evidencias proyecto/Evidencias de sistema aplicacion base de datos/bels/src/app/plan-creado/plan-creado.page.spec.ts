import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanCreadoPage } from './plan-creado.page';

describe('PlanCreadoPage', () => {
  let component: PlanCreadoPage;
  let fixture: ComponentFixture<PlanCreadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCreadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
