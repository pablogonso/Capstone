import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanPruebasPage } from './plan-pruebas.page';

describe('PlanPruebasPage', () => {
  let component: PlanPruebasPage;
  let fixture: ComponentFixture<PlanPruebasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanPruebasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

